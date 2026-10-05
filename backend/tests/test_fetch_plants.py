""" Collecte des plantes : analyse des pages Flowgrow, Tropica, GBIF et Commons, sans accès réseau """

import io
import json

import pytest
from PIL import Image

import tools.commons as commons
import tools.fetch_plants as fp

FLOWGROW = """
<div><strong>Aquarium suitability:</strong>&nbsp;yes<br/></div>
<div><strong>Usage:</strong>&nbsp;Epiphyte (growing on hardscape), Cichlid proof plant, Midground, Nano tanks,
  Foreground, group<br></div>
<div><strong>Difficulty:</strong>&nbsp;very easy<br/></div>
<div><strong>Growth:</strong>&nbsp;slow<br/></div>
<img class="s360__product--tab--gmap" src="region_12.png" title="Regions: Central Africa"/>
<br><strong>Height:</strong>&nbsp;5 - 10&thinsp;cm<br/><strong>Width:</strong>&nbsp;5 - 20&thinsp;cm<br/>
<div title="Habit, plant type: rhizome or creeping stem" class="type option326"></div>
<div title="Habit, plant type: epiphyte or epilith" class="type option321"></div>
<strong>Botanical name <span class="tooltip">[?]</span>:</strong>&nbsp;<i>Anúbias bárteri</i> var. <i>nána</i><br/>
<div class="family-flag"><div class="text"><strong>Order:</strong> Alismatales </div></div>
<div class="family-flag"><div class="text"><strong>Family:</strong> Araceae </div></div>
<table><tbody>
  <tr><td>Light</td><td>low to high&thinsp;</td></tr>
  <tr><td>Temperature tolerance</td><td>12 to 30&thinsp;°C</td></tr>
  <tr><td>Optimum temperature</td><td>22 to 26&thinsp;°C</td></tr>
  <tr><td>Carbonate hardness</td><td>0 to 21&thinsp;°dKH</td></tr>
  <tr><td>pH value</td><td>5 to 8&thinsp;</td></tr>
</tbody></table>
<div><strong>Propagation:</strong>&nbsp;Rhizomteilung, Splitting, cutting off daughter plants, Spores<br></div>
<div><strong>Can grow emersed?:</strong>&nbsp;yes<br/></div>
"""

TROPICA = """<table class="specficationTable">
<tr><th>Type:</th><td>Rhizomatous</td><td class="helpTextExpander" /></tr>
<tr><th>Origin:</th><td>Africa</td><td class="helpTextExpander"></td></tr>
<tr class="plantInfoHelpText"><td colspan="2">Country or continent where a plant is the most common.</td></tr>
<tr><th>Height:</th><td>5 - 15+</td><td></td></tr>
<tr><th>CO2
:</th><td>Low</td><td></td></tr>
</table>"""


def fake_fetch(pages: dict[str, tuple[int, str]]):
    def fetch(url, cache_name):
        return next((page for prefix, page in pages.items() if cache_name.startswith(prefix)), (404, ''))
    return fetch


@pytest.mark.parametrize('text, expected', [
    ('12 to 30 °C', (12, 30)), ('5 - 15+', (5, 15)), ('4.5 to 8', (4.5, 8)), ('6', (6, 6)), ('', None), (None, None),
])
def test_parse_range(text, expected):
    assert fp.parse_range(text) == expected


def test_parse_levels():
    assert fp.parse_levels('low to high', fp.LUMIERES) == ('faible', 'forte')
    assert fp.parse_levels('medium', fp.LUMIERES) == ('moyenne', 'moyenne')
    assert fp.parse_levels('blinding', fp.LUMIERES) is None


def test_split_known_prefers_labels_containing_a_comma():
    found, unknown = fp.split_known('Midground, Foreground, group, Foreground, ground cover, Aquascape', fp.USAGES)

    assert found == [fp.USAGES['Midground'], fp.USAGES['Foreground, group'], fp.USAGES['Foreground, ground cover']]
    assert unknown == ['Aquascape']


def test_flowgrow_page_is_translated():
    values, warnings = fp.flowgrow_values(fp.parse_flowgrow(FLOWGROW))

    assert values == dict(
        ph_mini=5, ph_maxi=8, kh_mini=0, kh_maxi=21, temp_mini=12, temp_maxi=30, temp_opti_mini=22,
        temp_opti_maxi=26, hauteur_mini=5, hauteur_maxi=10, lumiere_mini='faible', lumiere_maxi='forte',
        difficulte='très facile', croissance='lente',
        positions=['sur le décor', 'plan intermédiaire', 'premier plan'],
        usages=['résiste aux cichlidés', 'nano-aquarium'],
        multiplication=['division du rhizome', 'séparation des rejets'],
        type='épiphyte', emergee=True, ordre='Alismatales', famille='Araceae', regions='Central Africa',
    )
    assert warnings == ["multiplication inconnue : 'Spores'"]


def test_flowgrow_aggregate_page_without_botanical_name_is_read(monkeypatch):
    aggregate = '\n'.join(line for line in FLOWGROW.splitlines() if 'Botanical name' not in line)
    monkeypatch.setattr(fp, 'fetch', fake_fetch({'flowgrow-': (200, aggregate)}))

    values, warnings = fp.flowgrow('callitriche-palustris-agg')

    assert not any('introuvable' in w for w in warnings)
    assert (values['ph_mini'], values['famille']) == (5, 'Araceae')


def test_flowgrow_unknown_level_is_reported():
    values, warnings = fp.flowgrow_values({'Difficulty': 'impossible', 'Growth': 'medium'})

    assert 'difficulte' not in values and values['croissance'] == 'moyenne'
    assert warnings == ["Difficulty inconnu : 'impossible'"]


@pytest.mark.parametrize('ports, usages, expected', [
    (['tige', 'flottante'], [], 'flottante'),
    (['rhizome', 'épiphyte'], [], 'épiphyte'),
    (['rhizome'], ['nano-aquarium', 'tapis'], 'tapissante'),
    (['épiphyte', 'mousse'], ['tapis'], 'mousse'),
    ([], [], None),
])
def test_main_type(ports, usages, expected):
    assert fp.main_type(ports, usages) == expected


def test_tropica_table():
    raw = fp.parse_tropica(TROPICA)

    assert raw == {'Type': 'Rhizomatous', 'Origin': 'Africa', 'Height': '5 - 15+', 'CO2': 'Low'}
    assert fp.tropica_values(raw) == {'hauteur_mini': 5, 'hauteur_maxi': 15, 'co2': 'faible', 'origine': 'Africa'}


def test_missing_pages_are_reported(monkeypatch):
    monkeypatch.setattr(fp, 'fetch', fake_fetch({}))

    assert fp.flowgrow('nope') == ({}, ["Flowgrow : page 'nope' introuvable (404)"])
    assert fp.tropica('nope')[1] == ["Tropica : page 'nope' introuvable (404)"]


def test_gbif_synonym_gives_the_accepted_species(monkeypatch):
    monkeypatch.setattr(fp, 'fetch', fake_fetch({
        'gbif-plant-match-': (200, json.dumps({
            'usageKey': 7289955, 'acceptedUsageKey': 8451579, 'matchType': 'EXACT', 'status': 'SYNONYM',
            'order': 'Polypodiales', 'family': 'Polypodiaceae'})),
        'gbif-plant-species-7289955': (200, json.dumps({
            'rank': 'SPECIES', 'species': 'Leptochilus pteropus', 'authorship': '(Blume) Copel. '})),
    }))

    values, warnings = fp.gbif('Microsorum pteropus')

    assert warnings == []
    assert values == dict(url='https://www.gbif.org/species/7289955', statut='SYNONYM', auteur='(Blume) Copel.',
                          ordre='Polypodiales', famille='Polypodiaceae', nom_valide='Leptochilus pteropus',
                          taxon=8451579)


def test_gbif_gives_the_phylum_and_the_iucn_category(monkeypatch):
    monkeypatch.setattr(fp, 'fetch', fake_fetch({
        'gbif-plant-match-': (200, json.dumps({'usageKey': 2869214, 'matchType': 'EXACT', 'status': 'ACCEPTED',
                                                'phylum': 'Tracheophyta', 'family': 'Araceae'})),
        'gbif-plant-species-': (200, json.dumps({'rank': 'SPECIES', 'authorship': 'de Wit'})),
        'gbif-iucn-2869214': (200, json.dumps({'category': 'NEAR_THREATENED', 'code': 'NT'})),
    }))

    values, _ = fp.gbif('Cryptocoryne wendtii')

    assert (values['taxon'], values['embranchement'], values['uicn']) == (2869214, 'Tracheophyta', 'NT')


def test_gbif_fuzzy_match_is_rejected(monkeypatch):
    monkeypatch.setattr(fp, 'fetch', fake_fetch({
        'gbif-plant-match-': (200, json.dumps({'usageKey': 1, 'matchType': 'FUZZY'})),
    }))

    assert fp.gbif('Anubias nanna') == ({}, ["GBIF : pas de correspondance exacte pour 'Anubias nanna' (FUZZY)"])


def test_plain_name_keeps_the_rank():
    usage = {'scientificName': 'Anubias barteri var. nana (Engl.) Crusio', 'authorship': '(Engl.) Crusio'}

    assert fp.plain_name(usage) == 'Anubias barteri var. nana'


@pytest.mark.parametrize('licence, free', [
    ('CC BY-SA 4.0', True), ('CC BY 2.0', True), ('CC BY-SA 2.0 fr', True), ('CC0', True), ('Public domain', True),
    ('CC BY-NC 4.0', False), ('CC BY-ND 3.0', False), ('GFDL', False), ('', False),
])
def test_only_free_licences_are_accepted(licence, free):
    assert bool(commons.FREE_LICENCE.match(licence)) is free


@pytest.mark.parametrize('author, expected', [
    ('photo: S. Tanaka', 'S. Tanaka'),
    ('William & Wilma Follette @ USDA-NRCS PLANTS Database / USDA NRCS. 1992. Western wetland flora',
     'William & Wilma Follette, USDA-NRCS PLANTS Database'),
    ('Krzysztof Ziarnek, Kenraiz', 'Krzysztof Ziarnek, Kenraiz'),
    ('No machine-readable author provided. Ged~commonswiki assumed (based on copyright claims).', 'Ged'),
])
def test_clean_author(author, expected):
    assert commons.clean_author(author) == expected


COMMONS = json.dumps({'query': {'pages': {'1': {'title': 'File:Anubia nana.jpg', 'imageinfo': [{
    'url': 'https://upload.wikimedia.org/a.jpg', 'thumburl': 'https://upload.wikimedia.org/thumb/a.jpg',
    'descriptionurl': 'https://commons.wikimedia.org/wiki/File:Anubia_nana.jpg', 'user': 'Carlosar',
    'extmetadata': {'Artist': {'value': '<a href="//commons.wikimedia.org/wiki/User:Carlosar">Carlosar</a>'},
                    'LicenseShortName': {'value': 'CC BY-SA 3.0'},
                    'LicenseUrl': {'value': 'https://creativecommons.org/licenses/by-sa/3.0'}},
}]}}}})


def jpeg(width: int, height: int) -> bytes:
    out = io.BytesIO()
    Image.new('RGB', (width, height), 'green').save(out, 'JPEG')
    return out.getvalue()


def test_photos_are_downloaded_resized_and_credited(tmp_path, monkeypatch):
    monkeypatch.setattr(fp, 'PHOTOS_DIR', tmp_path)
    monkeypatch.setattr(commons, 'fetch', fake_fetch({'commons-file-anubia-nana': (200, COMMONS)}))
    monkeypatch.setattr(commons, 'download', lambda url: jpeg(3000, 1500))

    credits, errors = fp.photos('anubias', ['File:Anubia nana.jpg', 'File:Absent.jpg'])

    assert errors == ['File:Absent.jpg : fichier introuvable sur Commons']
    assert credits == [dict(fichier='anubias-1.jpg', auteur='Carlosar', licence='CC BY-SA 3.0',
                            licence_url='https://creativecommons.org/licenses/by-sa/3.0',
                            source='https://commons.wikimedia.org/wiki/File:Anubia_nana.jpg')]
    with Image.open(tmp_path / 'anubias-1.jpg') as im:
        assert im.size == (2000, 1000)


def test_non_free_photo_is_refused(tmp_path, monkeypatch):
    monkeypatch.setattr(fp, 'PHOTOS_DIR', tmp_path)
    non_free = COMMONS.replace('CC BY-SA 3.0', 'CC BY-NC 4.0')
    monkeypatch.setattr(commons, 'fetch', fake_fetch({'commons-': (200, non_free)}))

    credits, errors = fp.photos('anubias', ['File:Anubia nana.jpg'])

    assert credits == [] and errors == ["File:Anubia nana.jpg : licence non libre ou inconnue : 'CC BY-NC 4.0'"]
    assert not (tmp_path / 'anubias-1.jpg').exists()


def test_photo_is_downloaded_again_when_the_commons_file_changes(tmp_path, monkeypatch):
    monkeypatch.setattr(fp, 'PHOTOS_DIR', tmp_path)
    monkeypatch.setattr(commons, 'fetch', fake_fetch({'commons-': (200, COMMONS)}))
    downloads = []
    monkeypatch.setattr(commons, 'download', lambda url: downloads.append(url) or jpeg(10, 10))
    (tmp_path / 'anubias-1.jpg').write_bytes(jpeg(10, 10))
    same = [{'fichier': 'anubias-1.jpg', 'source': 'https://commons.wikimedia.org/wiki/File:Anubia_nana.jpg'}]
    other = [{'fichier': 'anubias-1.jpg', 'source': 'https://commons.wikimedia.org/wiki/File:Autre.jpg'}]

    fp.photos('anubias', ['File:Anubia nana.jpg'], same)
    assert downloads == []

    fp.photos('anubias', ['File:Anubia nana.jpg'], other)
    assert downloads == ['https://upload.wikimedia.org/thumb/a.jpg']


def test_photos_no_longer_listed_are_removed(tmp_path, monkeypatch):
    monkeypatch.setattr(fp, 'PHOTOS_DIR', tmp_path)
    monkeypatch.setattr(commons, 'fetch', fake_fetch({'commons-': (200, COMMONS)}))
    monkeypatch.setattr(commons, 'download', lambda url: jpeg(10, 10))
    for name in ('anubias-2.jpg', 'anubias-nana-1.jpg'):
        (tmp_path / name).write_bytes(b'old')

    fp.photos('anubias', ['File:Anubia nana.jpg'])

    # La photo d'une autre plante dont le nom commence pareil est conservée
    assert sorted(p.name for p in tmp_path.iterdir()) == ['anubias-1.jpg', 'anubias-nana-1.jpg']


def test_a_broken_download_is_reported_without_stopping_the_others(tmp_path, monkeypatch):
    monkeypatch.setattr(fp, 'PHOTOS_DIR', tmp_path)
    monkeypatch.setattr(commons, 'fetch', fake_fetch({'commons-': (200, COMMONS)}))
    payloads = iter([jpeg(10, 10)[:40], jpeg(10, 10)[:40], jpeg(10, 10)])
    monkeypatch.setattr(commons, 'download', lambda url: next(payloads))

    credits, errors = fp.photos('anubias', ['File:Anubia nana.jpg', 'File:Anubia nana.jpg'])

    # Deux essais pour la première photo (fichier tronqué), la seconde est enregistrée
    assert [c['fichier'] for c in credits] == ['anubias-2.jpg']
    assert len(errors) == 1 and 'téléchargement impossible' in errors[0]
    assert not (tmp_path / 'anubias-1.jpg').exists()


# --- Aire de répartition ----------------------------------------------------------------------------

TDWG_TABLE = """L4 code*L4 country*L3 code*L4 ISOcode*Ed2status*Notes\r
SRL-OO*Sri Lanka*SRL*LK**\r
FLA-OO*Florida*FLA*US**\r
GRB-OO*Great Britain*GRB*UK**\r
YUG-SE*Serbia*YUG*YU**\r
YUG-KO*Kosovo*YUG*YU**\r
YUG-SL*Slovenia*YUG*SL**\r
NAM-OO*Namibia*NAM*ZA**\r
ITA-IT*Italy*ITA*IT**\r
ITA-VC*Vatican City*ITA*VA**\r
SUD-OO*Sudan*SUD*SD**\r
SUD-SS*South Sudan*SUD*SS**\r
REU-OO*R\u00e9union*REU*RE**\r
"""
ISO3 = {'LK': 'LKA', 'US': 'USA', 'GB': 'GBR', 'RS': 'SRB', 'XK': 'XKX', 'SD': 'SDN', 'SS': 'SSD', 'RE': 'REU',
        'TH': 'THA', 'VN': 'VNM', 'FR': 'FRA', 'NZ': 'NZL', 'SI': 'SVN', 'SL': 'SLE', 'NA': 'NAM', 'ZA': 'ZAF',
        'IT': 'ITA', 'VA': 'VAT'}
ON_MAP = {'LKA', 'USA', 'GBR', 'SRB', 'KOS', 'SDN', 'SDS', 'THA', 'VNM', 'FRA', 'NZL', 'SVN', 'SLE', 'NAM', 'ZAF',
          'ITA', 'VAT'}


def test_tdwg_regions_become_map_countries():
    regions = fp.tdwg_countries(TDWG_TABLE, ISO3, ON_MAP)

    # Codes ISO de 2001 remplacés (UK, YU) ou faux (Slovénie « SL », Namibie « ZA »), codes du fond de carte
    # (Kosovo, Soudan du Sud), territoires hors carte, micro-État rattaché à la région de son voisin (Vatican)
    assert regions == {'SRL': ['LKA'], 'FLA': ['USA'], 'GRB': ['GBR'], 'YUG': ['SRB', 'KOS', 'SVN'],
                       'NAM': ['NAM'], 'ITA': ['ITA'], 'SUD': ['SDN', 'SDS'], 'REU': []}


@pytest.mark.parametrize('name, expected', [
    ('Anubias barteri var. nana', 'Anubias barteri nana'),
    ("Echinodorus grisebachii 'Bleherae'", 'Echinodorus grisebachii'),
    ('Bolbitis heteroclita "difformis"', 'Bolbitis heteroclita'),
    ('Eleocharis pusilla ("E. parvula")', 'Eleocharis pusilla'),
    ('Callitriche palustris agg.', 'Callitriche palustris'),
])
def test_range_name(name, expected):
    assert fp.range_name(name) == expected


def wcvp_pages(search: list[dict], distributions: list[dict]) -> dict:
    return {
        'wcvp-search-': (200, json.dumps({'results': search})),
        'gbif-plant-species-20': (200, json.dumps({'key': 20, 'canonicalName': 'Elodea densa',
                                                   'references': 'https://powo.science.kew.org/taxon/x'})),
        'wcvp-distributions-20': (200, json.dumps({'results': distributions})),
    }


def test_wcvp_range_separates_native_and_introduced_countries(monkeypatch):
    monkeypatch.setattr(fp, 'fetch', fake_fetch(wcvp_pages(
        [{'key': 10, 'canonicalName': 'Egeria densa', 'taxonomicStatus': 'SYNONYM', 'acceptedKey': 20},
         {'key': 11, 'canonicalName': 'Egeria densa x', 'taxonomicStatus': 'ACCEPTED'}],
        [{'locationId': 'TDWG:SRL'}, {'locationId': 'TDWG:FLA', 'establishmentMeans': 'INTRODUCED'},
         {'locationId': 'TDWG:GRB', 'establishmentMeans': 'INTRODUCED'}, {'locationId': 'TDWG:XXX'}])))
    regions = {'SRL': ['LKA'], 'FLA': ['USA'], 'GRB': ['GBR']}

    values, warnings = fp.wcvp_range('Egeria densa', regions)

    # Le synonyme renvoie au taxon accepté de la WCVP, dont la fiche POWO devient la source
    assert values == dict(source='POWO', url='https://powo.science.kew.org/taxon/x', nom='Elodea densa',
                          natif=['LKA'], introduit=['GBR', 'USA'])
    assert warnings == ["WCVP : région TDWG inconnue 'XXX'"]


def test_wcvp_variety_missing_from_the_list_falls_back_to_its_species(monkeypatch):
    searched = []

    def fetch(url, cache_name):
        searched.append(cache_name)
        if cache_name == 'wcvp-search-cabomba-caroliniana.json':
            return 200, json.dumps({'results': [{'key': 20, 'canonicalName': 'Cabomba caroliniana',
                                                 'taxonomicStatus': 'ACCEPTED'}]})
        return wcvp_pages([], [])[next(p for p in wcvp_pages([], []) if cache_name.startswith(p))]
    monkeypatch.setattr(fp, 'fetch', fetch)

    assert fp.wcvp_usage('Cabomba caroliniana var. caroliniana')['key'] == 20
    assert searched[:2] == ['wcvp-search-cabomba-caroliniana-caroliniana.json', 'wcvp-search-cabomba-caroliniana.json']


def test_wcvp_homonyms_without_accepted_name_are_reported(monkeypatch):
    monkeypatch.setattr(fp, 'fetch', fake_fetch(wcvp_pages(
        [{'key': 1, 'canonicalName': 'Rotala indica', 'taxonomicStatus': 'SYNONYM', 'acceptedKey': 5},
         {'key': 2, 'canonicalName': 'Rotala indica', 'taxonomicStatus': 'SYNONYM', 'acceptedKey': 6}], [])))

    assert fp.wcvp_range('Rotala indica', {}) == ({}, ["WCVP : pas de taxon accepté unique pour 'Rotala indica'"])


def test_moss_range_keeps_observed_countries_on_its_continents(monkeypatch):
    counts = [{'name': 'FR', 'count': 900}, {'name': 'NZ', 'count': 40}, {'name': 'TH', 'count': 1},
              {'name': 'VN', 'count': 3}]
    monkeypatch.setattr(fp, 'fetch', fake_fetch({
        'gbif-plant-countries-': (200, json.dumps({'facets': [{'field': 'COUNTRY', 'counts': counts}]})),
    }))
    monkeypatch.setattr(fp, 'gbif_countries', lambda: [
        {'iso2': 'FR', 'gbifRegion': 'EUROPE'}, {'iso2': 'NZ', 'gbifRegion': 'OCEANIA'},
        {'iso2': 'TH', 'gbifRegion': 'ASIA'}, {'iso2': 'VN', 'gbifRegion': 'ASIA'}])

    values, warnings = fp.gbif_range(42, 'Europe, Southeast Asia', ISO3, ON_MAP)

    # La Nouvelle-Zélande est hors des continents d'origine, la Thaïlande n'a qu'une observation
    assert values == dict(source='GBIF', url='https://www.gbif.org/species/42', natif=['FRA', 'VNM'], introduit=[])
    assert warnings == []
    assert fp.gbif_range(42, None, ISO3, ON_MAP)[0]['natif'] == ['FRA', 'NZL', 'VNM']


def test_external_photos_are_kept_after_the_commons_ones(tmp_path, monkeypatch):
    monkeypatch.setattr(fp, 'PHOTOS_DIR', tmp_path)
    monkeypatch.setattr(commons, 'fetch', fake_fetch({'commons-file-anubia-nana': (200, COMMONS)}))
    monkeypatch.setattr(commons, 'download', lambda url: jpeg(10, 10))
    for name in ('anubias-1.jpg', 'anubias-2.jpg'):
        (tmp_path / name).write_bytes(jpeg(10, 10))
    inat = {'fichier': 'anubias-2.jpg', 'auteur': 'pbsg', 'licence': 'CC BY 4.0',
            'source': 'https://www.inaturalist.org/photos/1'}
    previous = [{'fichier': 'anubias-1.jpg', 'source': 'https://commons.wikimedia.org/wiki/File:Anubia_nana.jpg'},
                inat]
    external = [{'source': 'https://www.inaturalist.org/photos/1'}, {'source': 'https://www.inaturalist.org/photos/2'}]

    # Titre Commons sans préfixe « File: », comme dans les fiches ajoutées en lot
    credits, errors = fp.photos('anubias', ['Anubia nana.jpg'], previous, external)

    assert [c['fichier'] for c in credits] == ['anubias-1.jpg', 'anubias-2.jpg'] and credits[1] == inat
    assert sorted(p.name for p in tmp_path.iterdir()) == ['anubias-1.jpg', 'anubias-2.jpg']
    assert errors == ['https://www.inaturalist.org/photos/2 : photo externe sans crédit enregistré']


def test_commons_cache_names_never_mix_two_titles():
    titles = ['File:矮珍珠.jpg', 'File:Яванский мох.jpg', 'File:Weather loach.jpg', 'File:Weather Loach.jpg']

    # Le slug seul donnait « file-jpg » aux deux premiers : la photo de l'un était publiée pour l'autre
    assert len({commons.cache_key(t) for t in titles}) == 4
    assert commons.cache_key('File:Anubia nana.jpg').startswith('file-anubia-nana-jpg-')


def test_public_domain_photo_links_to_the_commons_page(tmp_path, monkeypatch):
    monkeypatch.setattr(fp, 'PHOTOS_DIR', tmp_path)
    licence_url = '"LicenseUrl": {"value": "https://creativecommons.org/licenses/by-sa/3.0"}'
    public_domain = COMMONS.replace('CC BY-SA 3.0', 'Public domain').replace(licence_url, '"Copyrighted": {}')
    monkeypatch.setattr(commons, 'fetch', fake_fetch({'commons-': (200, public_domain)}))
    monkeypatch.setattr(commons, 'download', lambda url: jpeg(10, 10))

    credits, _ = fp.photos('anubias', ['File:Anubia nana.jpg'])

    assert (credits[0]['licence'], credits[0]['licence_url']) == ('Public domain', commons.PUBLIC_DOMAIN_URL)
