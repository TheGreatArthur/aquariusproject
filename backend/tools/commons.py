"""
Photos Wikimedia Commons sous licence libre : recherche, crédits et téléchargement

Partagé par les outils des plantes (`tools/fetch_plants.py`) et des poissons (`tools/fetch_fish_photos.py`).
Seules les photos en domaine public, CC0, CC BY ou CC BY-SA sont acceptées, avec un auteur connu : chaque photo
publiée garde son auteur, sa licence et le lien vers sa page Commons.
"""

import html
import io
import json
import re
import urllib.parse
from pathlib import Path

from tools.fetch_sources import download, fetch, slug

COMMONS_API = 'https://commons.wikimedia.org/w/api.php?'
PHOTO_MAX_SIDE = 2000
PHOTO_QUALITY = 82
# Licences libres acceptées : domaine public, CC0, CC BY et CC BY-SA (toutes versions)
FREE_LICENCE = re.compile(r'^(public domain|pd\b.*|cc0( 1\.0)?|cc by(-sa)? \d\.\d( [a-z]{2})?)$', re.IGNORECASE)
# Fichiers qui ne sont pas des photos de l'animal ou de la plante vivants
NOT_A_PHOTO = re.compile(r'herbar|illustrat|drawing|dessin|specimen|museum|preserved|skeleton|skull|x-ray|radiograph'
                         r'|\bmap\b|distribution|\brange\b|stamp|timbre|plate|tafel|\bpl\.|lithograph|engraving|poster'
                         r'|\.svg$|\.tiff?$|\.pdf$|\.gif$', re.IGNORECASE)


def strip_markup(text: str | None) -> str:
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', text or ''))).strip()


def api(params: dict, cache_name: str) -> dict:
    _, body = fetch(COMMONS_API + urllib.parse.urlencode({**params, 'format': 'json'}), cache_name)
    return json.loads(body or '{}')


def commons_info(title: str) -> dict:
    """ Adresse, taille, auteur et licence d'un fichier Commons """
    data = api({'action': 'query', 'titles': title, 'prop': 'imageinfo', 'iiprop': 'url|size|mime|extmetadata|user',
                'iiurlwidth': PHOTO_MAX_SIDE}, f'commons-{slug(title)}.json')
    page = next(iter(data.get('query', {}).get('pages', {}).values()), {})
    if 'imageinfo' not in page:
        return {}
    info = page['imageinfo'][0]
    meta = info.get('extmetadata', {})
    return dict(
        titre=page['title'],
        url=info.get('thumburl') or info['url'],
        source=info['descriptionurl'],
        largeur=info.get('width'),
        hauteur=info.get('height'),
        mime=info.get('mime'),
        # Sans champ « Artist » (vieux fichiers), l'auteur est la personne qui a versé la photo
        auteur=strip_markup(meta.get('Artist', {}).get('value')) or info.get('user'),
        licence=strip_markup(meta.get('LicenseShortName', {}).get('value')),
        licence_url=meta.get('LicenseUrl', {}).get('value'),
        description=strip_markup(meta.get('ImageDescription', {}).get('value'))[:300],
    )


def clean_author(text: str) -> str:
    """ 'photo: S. Tanaka' -> 'S. Tanaka' ; 'W. Follette @ USDA-NRCS PLANTS Database / USDA NRCS. 1992...' ->
    'W. Follette, USDA-NRCS PLANTS Database' (la référence bibliographique reste sur la page Commons) """
    text = re.sub(r'^(photo|photograph|author)\s*:\s*', '', text.split(' / ')[0], flags=re.IGNORECASE)
    return text.replace(' @ ', ', ').strip()


def check_licence(info: dict) -> str | None:
    """ Erreur si la photo ne peut pas être publiée dans le dépôt """
    if not info:
        return 'fichier introuvable sur Commons'
    if not FREE_LICENCE.match(info['licence'] or ''):
        return f'licence non libre ou inconnue : {info["licence"]!r}'
    if not info['auteur']:
        return 'auteur inconnu (attribution impossible)'
    return None


def category_files(category: str) -> list[str]:
    """ Fichiers d'une catégorie Commons (« Paracheirodon axelrodi ») et de ses sous-catégories directes """
    def members(cat: str, kind: str) -> list[str]:
        data = api({'action': 'query', 'list': 'categorymembers', 'cmtitle': f'Category:{cat}', 'cmtype': kind,
                    'cmlimit': 500}, f'commons-cat-{kind}-{slug(cat)}.json')
        return [m['title'] for m in data.get('query', {}).get('categorymembers', [])]

    files = members(category, 'file')
    for sub in members(category, 'subcat'):
        if not NOT_A_PHOTO.search(sub):
            files += members(sub.removeprefix('Category:'), 'file')
    return list(dict.fromkeys(files))


def infos(titles: list[str], thumb_width: int = 400) -> list[dict]:
    """ Taille, licence, auteur et vignette de plusieurs fichiers, par lots de 50 (une requête par lot) """
    found = []
    for i in range(0, len(titles), 50):
        batch = titles[i:i + 50]
        data = api({'action': 'query', 'titles': '|'.join(batch), 'prop': 'imageinfo',
                    'iiprop': 'url|size|mime|extmetadata|user', 'iiurlwidth': thumb_width},
                   f'commons-batch-{slug(batch[0])}-{len(batch)}.json')
        for page in data.get('query', {}).get('pages', {}).values():
            if 'imageinfo' not in page:
                continue
            info, meta = page['imageinfo'][0], page['imageinfo'][0].get('extmetadata', {})
            found.append(dict(
                titre=page['title'], source=info['descriptionurl'], vignette=info.get('thumburl'),
                largeur=info.get('width'), hauteur=info.get('height'), mime=info.get('mime'),
                auteur=strip_markup(meta.get('Artist', {}).get('value')) or info.get('user'),
                licence=strip_markup(meta.get('LicenseShortName', {}).get('value')),
                licence_url=meta.get('LicenseUrl', {}).get('value'),
                description=strip_markup(meta.get('ImageDescription', {}).get('value'))[:300],
            ))
    return found


def search_files(name: str) -> list[str]:
    """ Fichiers dont la page mentionne le nom exact (« "Corydoras similis" »), pour les espèces mal catégorisées """
    data = api({'action': 'query', 'list': 'search', 'srsearch': f'"{name}"', 'srnamespace': 6, 'srlimit': 50},
               f'commons-search-{slug(name)}.json')
    return [r['title'] for r in data.get('query', {}).get('search', [])]


def candidates(categories: list[str], min_width: int = 640) -> list[dict]:
    """
    Photos libres des catégories d'une espèce, les plus prometteuses d'abord : plus grandes, en paysage,
    prises en aquarium plutôt qu'en main ou sur un étal. Avec moins de trois fichiers classés, la recherche par
    nom complète la liste : ses résultats sont plus souvent d'une autre espèce et doivent être vérifiés à l'œil.
    """
    titles = list(dict.fromkeys(t for c in categories for t in category_files(c)))
    if len(titles) < 3:
        titles += [t for c in categories for t in search_files(c) if t not in titles]
    titles = [t for t in titles if not NOT_A_PHOTO.search(t)]
    found = []
    for info in infos(titles):
        if check_licence(info) or info.get('mime') not in ('image/jpeg', 'image/png', 'image/webp'):
            continue
        if (info.get('largeur') or 0) < min_width:
            continue
        text = f"{info['titre']} {info['description']}".lower()
        score = min(info['largeur'], 3000) / 1000 + (1 if info['largeur'] >= info['hauteur'] else -1)
        score += 1.5 * any(w in text for w in ('aquarium', 'aquaria', 'tank'))
        score -= 2 * any(w in text for w in ('market', 'dead', 'fishing', 'caught', 'hand', 'dish', 'food'))
        found.append({**info, 'score': round(score, 2)})
    return sorted(found, key=lambda f: -f['score'])


def save_photo(data: bytes, path: Path) -> None:
    """ Enregistre la photo en JPEG progressif, 2000 px au plus sur le grand côté (comme `make images`) """
    from PIL import Image, ImageOps

    with Image.open(io.BytesIO(data)) as im:
        icc = im.info.get('icc_profile')
        im = ImageOps.exif_transpose(im).convert('RGB')
        im.thumbnail((PHOTO_MAX_SIDE, PHOTO_MAX_SIDE), Image.LANCZOS)
        path.parent.mkdir(parents=True, exist_ok=True)
        im.save(path, 'JPEG', quality=PHOTO_QUALITY, optimize=True, progressive=True, icc_profile=icc)


def download_photos(name: str, titles: list[str], folder: Path,
                    previous: list[dict] = ()) -> tuple[list[dict], list[str]]:
    """
    Télécharge les photos <name>-1.jpg, -2.jpg... dans `folder` et renvoie leurs crédits. Une photo déjà présente
    n'est gardée que si elle vient du même fichier Commons qu'au passage précédent (`previous`), pour que l'image
    et son crédit correspondent toujours ; les photos <name>-N.jpg qui ne sont plus listées sont supprimées.
    """
    sources = {c['fichier']: c['source'] for c in previous}
    credits, errors = [], []
    for i, title in enumerate(titles, start=1):
        info = commons_info(title)
        if error := check_licence(info):
            errors.append(f'{title} : {error}')
            continue
        path = folder / f'{name}-{i}.jpg'
        if not path.exists() or sources.get(path.name) != info['source']:
            # Un fichier tronqué ou une erreur réseau n'arrête pas les autres photos : deux essais, puis signalement
            for attempt in (1, 2):
                try:
                    save_photo(download(info['url']), path)
                    break
                except OSError as e:
                    error = f'{title} : téléchargement impossible ({e})'
            else:
                errors.append(error)
                continue
        credits.append(dict(fichier=path.name, auteur=clean_author(info['auteur'])[:150], licence=info['licence'],
                            licence_url=info['licence_url'], source=info['source']))
    kept = {c['fichier'] for c in credits}
    for path in folder.glob(f'{name}-*.jpg'):
        if re.fullmatch(rf'{re.escape(name)}-\d+\.jpg', path.name) and path.name not in kept:
            path.unlink()
    return credits, errors
