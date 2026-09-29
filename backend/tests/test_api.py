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


def test_familles_sorted_by_name(client):
    res = client.get('/poissons/familles')

    assert [f['nom'] for f in res.get_json()['familles']] == ['Characidae', 'Cichlidae']
