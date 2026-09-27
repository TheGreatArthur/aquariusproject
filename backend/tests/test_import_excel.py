import import_excel


def test_get_images_main_picture_first(tmp_path, monkeypatch):
    for name in ('1.2.jpg', '1.jpg', '1.1.JPG', '10.jpg', '11.1.jpg', '2.jpg'):
        (tmp_path / name).touch()
    monkeypatch.setattr(import_excel, 'IMAGES_DIR', tmp_path)

    assert import_excel.get_images(1) == ['1.jpg', '1.1.JPG', '1.2.jpg']


def test_get_images_none_found(tmp_path, monkeypatch):
    monkeypatch.setattr(import_excel, 'IMAGES_DIR', tmp_path)

    assert import_excel.get_images(42) == []


def test_get_images_real_files_exist_for_first_fish():
    assert import_excel.get_images(1)[0] == '1.jpg'
