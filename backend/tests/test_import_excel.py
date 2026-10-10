import import_excel


def test_get_images_main_picture_first(tmp_path, monkeypatch):
    for name in ('1.2.jpg', '1.jpg', '1.1.JPG', '10.jpg', '11.1.jpg', '2.jpg'):
        (tmp_path / name).touch()
    monkeypatch.setattr(import_excel, 'IMAGES_DIR', tmp_path)

    assert import_excel.get_images(1) == ['1.jpg', '1.1.JPG', '1.2.jpg']


def test_get_images_none_found(tmp_path, monkeypatch):
    monkeypatch.setattr(import_excel, 'IMAGES_DIR', tmp_path)

    assert import_excel.get_images(42) == []


def test_workbook_fish_photos_are_free_and_on_disk():
    import json

    from fish_data import PHOTOS_FILE
    from tools.commons import FREE_LICENCE
    from tools.fetch_fish_photos import WORKBOOK_PHOTOS

    credits = json.loads(PHOTOS_FILE.read_text(encoding='utf-8'))
    for stem, titles in json.loads(WORKBOOK_PHOTOS.read_text(encoding='utf-8')).items():
        assert 0 < len(credits[stem]) <= len(titles), stem
        for credit in credits[stem]:
            assert FREE_LICENCE.match(credit['licence']), (stem, credit['licence'])
            assert (import_excel.IMAGES_DIR / credit['fichier']).is_file(), credit['fichier']


def test_free_photos_replace_the_workbook_pictures():
    from sqlalchemy import create_engine
    from sqlalchemy.orm import Session

    from models import Base
    from tests.test_data_quality import EXCEL_ROW

    engine = create_engine('sqlite://')
    Base.metadata.create_all(engine)
    fish = import_excel.parse_row(EXCEL_ROW)
    credits = [{'fichier': 'paracheirodon-axelrodi-1.jpg', 'auteur': 'A', 'licence': 'CC0',
                'source': 'https://commons.wikimedia.org/wiki/File:A.jpg'}]
    with Session(engine) as db:
        free = import_excel.to_params(db, fish, credits)
        original = import_excel.to_params(db, fish)

    assert (free['images'], free['credits']) == (['paracheirodon-axelrodi-1.jpg'], credits)
    # Sans photo libre choisie, les images du classeur restent, sans crédit
    assert original['credits'] is None
    engine.dispose()


def test_main_imports_the_workbook_then_updates_it(tmp_path, monkeypatch, capsys):
    from openpyxl import Workbook
    from sqlalchemy import func, select
    from sqlalchemy.orm import Session

    from models import Plante, Poisson
    from models.meta import get_engine
    from tests.test_data_quality import EXCEL_ROW

    engine = get_engine(f'sqlite:///{tmp_path / "aquarius.db"}')
    monkeypatch.setattr(import_excel, 'engine', engine)
    workbook = tmp_path / 'db.xlsx'

    def write(row):
        wb = Workbook()
        wb.active.append(['code'])
        wb.active.append(row)
        wb.save(workbook)

    write(EXCEL_ROW)
    import_excel.main(str(workbook))
    write(EXCEL_ROW[:2] + ('Cardinal',) + EXCEL_ROW[3:])
    import_excel.main(str(workbook))

    with Session(engine) as db:
        cardinals = db.scalars(select(Poisson).filter_by(nom_scientifique='Paracheirodon axelrodi')).all()
        assert [p.nom_commun for p in cardinals] == ['Cardinal']
        # Le classeur passe avant les poissons, plantes et invertébrés décrits par fichier
        assert db.scalar(select(func.count()).select_from(Poisson)) > 1
        assert db.scalar(select(func.count()).select_from(Plante)) > 0
    assert 'nom_commun : Cardinalis -> Cardinal' in capsys.readouterr().out
    engine.dispose()


def test_main_without_workbook(tmp_path, monkeypatch, capsys):
    from models.meta import get_engine

    monkeypatch.setattr(import_excel, 'engine', get_engine(f'sqlite:///{tmp_path / "aquarius.db"}'))

    import_excel.main(str(tmp_path / 'absent.xlsx'))

    assert 'Classeur Excel non trouvé' in capsys.readouterr().out
