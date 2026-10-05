def test_list_all_poissons(client):
    res = client.get('/poissons')

    assert res.status_code == 200
    noms = [p['nom_commun'] for p in res.get_json()['poissons']]
    assert sorted(noms) == ['Cardinalis', 'Scalaire']


def test_list_includes_related_names(client):
    poisson = next(p for p in client.get('/poissons').get_json()['poissons'] if p['id'] == 1)

    assert poisson['nom_famille'] == 'Characidae'
    assert poisson['nom_genre'] == 'Paracheirodon'
    assert poisson['nom_comportement'] == 'pacifique'
    assert poisson['nom_mode_vie'] == 'banc'
    assert poisson['nom_robustesse'] == 'robuste'
    assert poisson['nom_zone_geo'] == 'Amérique du Sud'
    assert poisson['nom_courant'] is None


def test_quick_search_is_case_insensitive_prefix(client):
    for q in ('card', 'PARACH', 'charac', 'pacif'):
        res = client.get('/poissons', query_string={'q': q})
        assert [p['id'] for p in res.get_json()['poissons']] == [1], q


def test_quick_search_without_match(client):
    res = client.get('/poissons', query_string={'q': 'zzz'})

    assert res.get_json()['poissons'] == []


def test_quick_search_treats_wildcards_as_text(client):
    for q in ('%', '_', 'c%'):
        res = client.get('/poissons', query_string={'q': q})
        assert res.get_json()['poissons'] == [], q


def test_filter_by_famille(client):
    res = client.get('/poissons', query_string={'famille': 'cichlidae'})

    assert [p['id'] for p in res.get_json()['poissons']] == [2]


def test_get_poisson(client):
    res = client.get('/poissons/1')

    assert res.status_code == 200
    data = res.get_json()
    assert data['nom_scientifique'] == 'Paracheirodon axelrodi'
    assert data['images'] == ['1.jpg', '1.1.jpg']


def test_get_poisson_not_found(client):
    res = client.get('/poissons/999')

    assert res.status_code == 404


def test_filter_by_famille_is_exact(client):
    for fam in ('%', 'cichlid', 'cichlidae%'):
        res = client.get('/poissons', query_string={'famille': fam})
        assert res.get_json()['poissons'] == [], fam


def test_get_poisson_rejects_non_numeric_id(client):
    assert client.get('/poissons/abc').status_code == 404


def test_familles_sorted_by_name(client):
    res = client.get('/poissons/familles')

    assert [f['nom'] for f in res.get_json()['familles']] == ['Characidae', 'Cichlidae']


def load_versioned_plants():
    from app import db
    from plants import load_plants, upsert_plants

    upsert_plants(db.session, load_plants())
    db.session.commit()


def test_list_plantes_sorted_with_main_photo(client):
    from plants import load_plants

    load_versioned_plants()

    plantes = client.get('/plantes').get_json()['plantes']

    noms = [p['nom_commun'] for p in plantes]
    assert len(noms) == len(load_plants()) and len(noms) >= 100 and noms == sorted(noms)
    anubias = next(p for p in plantes if p['nom_scientifique'] == 'Anubias barteri var. nana')
    assert anubias['image']['fichier'] == 'anubias-barteri-var-nana-1.jpg'
    assert anubias['type'] == 'épiphyte' and anubias['ph_mini'] == 5
    # Les textes longs ne sont renvoyés que sur le détail
    assert 'culture' not in anubias and 'sources' not in anubias


def test_get_plante(client):
    load_versioned_plants()
    plantes = client.get('/plantes').get_json()['plantes']
    plante_id = next(p['id'] for p in plantes if p['nom_commun'] == 'Fougère de Java')

    data = client.get(f'/plantes/{plante_id}').get_json()

    assert data['nom_scientifique'] == 'Microsorum pteropus'
    assert data['nom_valide'] == 'Leptochilus pteropus'
    assert len(data['images']) == 3 and data['culture']
    assert {s['nom'] for s in data['sources']} >= {'Flowgrow', 'Tropica', 'GBIF'}


def test_get_plante_not_found(client):
    assert client.get('/plantes/999').status_code == 404
