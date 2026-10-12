""" Photos des biotopes : crédits écrits par biotope et par type (nature, bacs), sans accès réseau """

import json

import tools.fetch_biotope_photos as fbp


def test_writes_credits_per_biotope_and_kind(tmp_path, monkeypatch):
    photos = tmp_path / 'photos.json'
    photos.write_text(json.dumps({'rio-negro': {'nature': ['File:A.jpg', 'File:B.jpg'], 'bacs': ['File:C.jpg']}}))
    credits = tmp_path / 'credits.json'
    monkeypatch.setattr(fbp, 'PHOTOS_FILE', photos)
    monkeypatch.setattr(fbp, 'CREDITS_FILE', credits)
    calls = []

    def fake_download(name, titles, folder, previous):
        calls.append((name, titles, previous))
        return [{'fichier': f'{name}-{i}.jpg', 'source': t} for i, t in enumerate(titles, start=1)], []

    monkeypatch.setattr(fbp, 'download_photos', fake_download)

    assert fbp.main() == 0
    written = json.loads(credits.read_text())
    assert [c['fichier'] for c in written['rio-negro']['nature']] == ['rio-negro-1.jpg', 'rio-negro-2.jpg']
    assert [c['fichier'] for c in written['rio-negro']['bacs']] == ['rio-negro-bac-1.jpg']
    # Un second passage repart des crédits écrits : les photos inchangées ne sont pas retéléchargées
    calls.clear()
    fbp.main()
    assert calls[0][2] == written['rio-negro']['nature']


def test_reports_rejected_photos(tmp_path, monkeypatch, capsys):
    photos = tmp_path / 'photos.json'
    photos.write_text(json.dumps({'floride': {'nature': ['File:X.jpg']}}))
    monkeypatch.setattr(fbp, 'PHOTOS_FILE', photos)
    monkeypatch.setattr(fbp, 'CREDITS_FILE', tmp_path / 'credits.json')
    monkeypatch.setattr(fbp, 'download_photos', lambda *a: ([], ['File:X.jpg : licence non libre']))

    assert fbp.main() == 1
    assert 'licence non libre' in capsys.readouterr().err
