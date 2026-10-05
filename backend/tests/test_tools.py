""" Outils de collecte des sources : analyse des pages et filtres, sans accès réseau """

import json
from types import SimpleNamespace

import tools.build_occurrences as occ
import tools.fetch_sources as fs
from tools.compare_sources import check, fishbase_values, seriouslyfish_values
from tools.draft_profiles import draft

FISHBASE = """
<title>Paracheirodon axelrodi,  Cardinal tetra  : fisheries, aquarium</title>
<a href='../Country/CountryList.php?ID=8195&GenusName=Paracheirodon'>Territories</a>
<div>Species in Acestrorhamphidae - Classification - Megalamphodinae Acestrorhamphidae Characiformes Teleostei
Chordata Animalia Paracheirodon axelrodi ( Schultz , 1956 ) Cardinal tetra</div>
<p>Environment: milieu / climate zone / depth range / distribution range Ecology Freshwater; pelagic;
pH range: 4.0 - 6.0; dH range: 5 - 12; non-migratory. Tropical; 23&deg;C - 27&deg;C (Ref. 1672 )
Distribution Territories | FAO areas | Faunafri South America: Upper Orinoco and Negro River basins.
Size / Weight / Age Max length : 3.0 cm SL male/unsexed; Biology Glossary (e.g. epibenthic) Occurs in shoals.
Life cycle and mating behavior IUCN Red List Status (Ref. 130435) Least Concern (LC) ; Date assessed CITES</p>
"""

FISHBASE_COUNTRIES = """<table>
<tr><th>Continent</th><th>Territory</th></tr>
<tr><td>South America</td><td>Brazil</td><td>BRA</td><td>native</td><td>4537</td></tr>
<tr><td>Europe</td><td>Czech Republic</td><td>CZE</td><td>introduced</td><td>1</td></tr>
</table>"""

SERIOUSLYFISH = """
<h1>Paracheirodon axelrodi</h1><h2>Quick facts</h2>
<div class="_cell_1"><div class="_key_1">Length</div>
  <div class="_value_1"><span class="unit-metric">35<small>mm SL</small></span>
  <span class="unit-imperial">1.4</span></div></div>
<div class="_cell_1"><div class="_key_1">Temp</div>
  <div class="_value_1"><span class="unit-metric">23–29 °C</span></div></div>
<div class="_cell_1"><div class="_key_1">pH</div><div class="_value_1">3.5–7.5</div></div>
<div class="_cell_1"><div class="_key_1">Hardness</div><div class="_value_1">1–12 <small>dGH</small></div></div>
<section id="habitat"><h2>Habitat</h2>Forest   streams.<aside>Recommended equipment</aside></section>
"""


def fake_fetch(pages: dict[str, tuple[int, str]]):
    def fetch(url, cache_name):
        return next((page for prefix, page in pages.items() if cache_name.startswith(prefix)), (404, ''))
    return fetch


def test_fetch_reads_the_disk_cache(tmp_path, monkeypatch):
    monkeypatch.setattr(fs, 'CACHE_DIR', tmp_path)
    (tmp_path / 'raw').mkdir()
    (tmp_path / 'raw' / 'page.html').write_text('200\n<html>cached</html>', encoding='utf-8')

    assert fs.fetch('https://example.org/', 'page.html') == (200, '<html>cached</html>')


def test_fishbase_summary_and_countries(monkeypatch):
    monkeypatch.setattr(fs, 'fetch', fake_fetch({
        'fishbase-countries': (200, FISHBASE_COUNTRIES), 'fishbase-': (200, FISHBASE),
    }))

    fb = fs.fishbase('Paracheirodon axelrodi')

    assert fb['valid_name'] == 'Paracheirodon axelrodi'
    assert (fb['author'], fb['author_in_parentheses']) == ('Schultz, 1956', True)
    assert (fb['order'], fb['family'], fb['subfamily']) == ('Characiformes', 'Acestrorhamphidae', 'Megalamphodinae')
    assert fb['spec_code'] == 8195 and fb['iucn_code'] == 'LC'
    assert fb['distribution'] == 'South America: Upper Orinoco and Negro River basins.'
    assert [c['iso3'] for c in fb['countries']] == ['BRA', 'CZE']


def test_fishbase_missing_page(monkeypatch):
    monkeypatch.setattr(fs, 'fetch', fake_fetch({}))

    assert fs.fishbase('Nomen nudum') is None


def test_seriouslyfish_quick_facts_and_sections(monkeypatch):
    monkeypatch.setattr(fs, 'fetch', fake_fetch({'seriouslyfish-': (200, SERIOUSLYFISH)}))

    sf = fs.seriouslyfish('Paracheirodon axelrodi')

    assert sf['facts']['Length'] == '35 mm SL'
    assert sf['facts']['Hardness'] == '1–12 dGH'
    assert sf['sections'] == {'habitat': 'Forest streams.'}


def test_compare_flags_values_outside_the_sources(monkeypatch):
    monkeypatch.setattr(fs, 'fetch', fake_fetch({
        'fishbase-countries': (200, FISHBASE_COUNTRIES), 'fishbase-': (200, FISHBASE),
        'seriouslyfish-': (200, SERIOUSLYFISH),
    }))
    fb = fishbase_values(fs.fishbase('Paracheirodon axelrodi'))
    sf = seriouslyfish_values(fs.seriouslyfish('Paracheirodon axelrodi'))
    fish = SimpleNamespace(temp_mini=25, temp_maxi=34, ph_mini=4, ph_maxi=6.5, gh_mini=3, gh_maxi=12, taille=4,
                           famille=SimpleNamespace(nom='Characidae'), zone_geo=SimpleNamespace(nom='Asie'))

    assert fb['continents'] == ['Amérique du Sud']
    assert sf['taille'] == (3.5, 'SL')
    assert check(fish, fb, sf) == [
        'temp 25–34 vs sources 23.0–29.0',
        'famille Characidae vs FishBase Acestrorhamphidae',
        'zone Asie vs FishBase Amérique du Sud',
    ]


def test_draft_prefills_facts_from_the_sources():
    fb = dict(url='https://fb', valid_name='Hoplisoma sterbai', author='Knaack, 1962', author_in_parentheses=True,
              order='Siluriformes', family='Callichthyidae', iucn_code='LC',
              countries=[{'iso3': 'BRA', 'status': 'native'}, {'iso3': 'USA', 'status': 'introduced'}])
    sources = dict(lookup='Corydoras sterbai', fishbase=fb, seriouslyfish={'url': 'https://sf'},
                   gbif={'usageKey': 12, 'acceptedUsageKey': None, 'rank': 'SPECIES'})

    profile = draft('Corydoras sterbai', sources)

    assert profile['nom_valide'] == 'Hoplisoma sterbai'
    assert profile['auteur'] == '(Knaack, 1962)'
    assert profile['classification'] == 'Siluriformes › Callichthyidae'
    assert profile['pays'] == ['BRA']
    assert [s['nom'] for s in profile['sources']] == ['FishBase', 'Seriously Fish', 'GBIF']
    assert profile['presentation'] == ''


def test_draft_skips_a_gbif_match_that_is_not_a_species():
    sources = dict(lookup='Trichogaster fasciata', fishbase=None, seriouslyfish=None,
                   gbif={'usageKey': 1, 'acceptedUsageKey': None, 'rank': 'KINGDOM'})

    assert draft('Trichogaster fasciata', sources)['sources'] == []


def test_occurrences_skip_introduced_and_null_island(monkeypatch):
    page = {'endOfRecords': True, 'results': [
        {'decimalLongitude': -67.12, 'decimalLatitude': 1.94},
        {'decimalLongitude': -60.0, 'decimalLatitude': 2.0, 'establishmentMeans': 'Introduced'},
        {'decimalLongitude': 0, 'decimalLatitude': 0},
        {'decimalLongitude': None, 'decimalLatitude': 3.0},
    ]}
    monkeypatch.setattr(occ, 'fetch', lambda url, cache_name: (200, json.dumps(page)))

    assert occ.occurrences(2353911, ['BR']) == [(-67.1, 1.9)]


def test_points_are_clipped_to_the_bounding_box_and_isolated_ones_dropped():
    points = [(34.2, -11.0), (34.4, -11.5), (34.6, -12.0), (34.8, -12.5), (40.7, -15.0)]

    assert occ.within(points, [33.8, -15.0, 35.4, -9.3]) == points[:4]
    assert occ.without_isolated(points) == points[:4]
    assert occ.without_isolated(points[3:]) == points[3:]  # trop peu de points pour juger


def test_thin_keeps_at_most_max_points(monkeypatch):
    monkeypatch.setattr(occ, 'MAX_POINTS', 3)

    assert occ.thin([(i, 0) for i in range(9)]) == [(0, 0), (3, 0), (6, 0)]


def test_cache_name_of_a_long_country_list_stays_short():
    few = ['BR', 'CO', 'PE']
    many = [f'{a}{b}' for a in 'ABCDEFGHIJ' for b in 'ABCDEFGHIJ']

    # Les noms des fiches existantes ne changent pas ; une plante presque cosmopolite a une empreinte
    assert occ.countries_key(few) == 'BR-CO-PE'
    assert len(occ.countries_key(many)) == 12 and occ.countries_key(many) != occ.countries_key(many[1:])


def test_plant_profiles_give_the_native_countries_and_the_gbif_taxon(monkeypatch):
    # Pas de réseau : seul le taxon de l'espèce d'une variété est cherché sur GBIF
    monkeypatch.setattr(occ, 'gbif_plant', lambda name: ({'taxon': 42} if name == 'Anubias barteri' else {}, []))

    profiles = occ.plant_profiles()

    wendtii = profiles['Cryptocoryne wendtii']
    assert wendtii['pays'] == ['LKA'] and wendtii['gbif']
    # L'Anubias nain n'a pas d'aire propre dans la WCVP : ses points sont ceux de l'espèce Anubias barteri
    assert profiles['Anubias barteri var. nana']['gbif'] == 42
