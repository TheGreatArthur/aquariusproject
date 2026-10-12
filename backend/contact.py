"""
Formulaire de contact : validation du message et envoi par e-mail (SMTP) au serveur de messagerie de l'éditeur

Le serveur se règle par variables d'environnement, jamais dans le dépôt : CONTACT_SMTP_HOST, CONTACT_SMTP_PORT (465 :
TLS dès la connexion, par défaut ; 587 : STARTTLS), CONTACT_SMTP_USER, CONTACT_SMTP_PASSWORD, CONTACT_TO (destinataire)
et CONTACT_FROM (expéditeur, par défaut l'utilisateur SMTP). L'API remet le message directement à ce serveur : aucun
service tiers ne le voit passer, et aucun identifiant n'arrive dans le navigateur.
"""

import os
import re
import smtplib
import ssl
from email.message import EmailMessage

# Champs attendus et longueur maximale (caractères)
CHAMPS = {'nom': 100, 'prenom': 100, 'email': 254, 'sujet': 150, 'message': 5000}
EMAIL = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
# Un humain met plus de 3 secondes à remplir le formulaire ; un robot l'envoie dès l'affichage
DELAI_MIN_MS = 3000
REGLAGES = ('CONTACT_SMTP_HOST', 'CONTACT_SMTP_USER', 'CONTACT_SMTP_PASSWORD', 'CONTACT_TO')


def erreurs(data: dict) -> dict[str, str]:
    """ Erreur par champ (« requis », « trop long », « invalide ») ; vide si le message peut partir """
    out = {}
    for champ, limite in CHAMPS.items():
        valeur = data.get(champ)
        if not isinstance(valeur, str) or not valeur.strip():
            out[champ] = 'requis'
        elif len(valeur) > limite:
            out[champ] = 'trop long'
        # Un retour à la ligne dans un champ d'en-tête permettrait d'injecter d'autres en-têtes
        elif champ != 'message' and ('\r' in valeur or '\n' in valeur):
            out[champ] = 'invalide'
    if 'email' not in out and not EMAIL.match(data['email'].strip()):
        out['email'] = 'invalide'
    return out


def robot(data: dict) -> bool:
    """ Piège à robots : champ caché « site » rempli, ou formulaire envoyé trop vite après son affichage """
    delai = data.get('delai')
    return bool(data.get('site')) or not isinstance(delai, (int, float)) or delai < DELAI_MIN_MS


def configure() -> bool:
    return all(os.environ.get(nom) for nom in REGLAGES)


def message(data: dict) -> EmailMessage:
    env = os.environ
    nom = f"{data['prenom'].strip()} {data['nom'].strip()}"
    msg = EmailMessage()
    msg['From'] = env.get('CONTACT_FROM') or env['CONTACT_SMTP_USER']
    msg['To'] = env['CONTACT_TO']
    # Répondre écrit directement au visiteur ; l'expéditeur reste l'adresse du serveur (SPF, DKIM)
    msg['Reply-To'] = data['email'].strip()
    msg['Subject'] = f"[Aquarius] {data['sujet'].strip()}"
    msg.set_content(f"{nom} <{data['email'].strip()}>\n\n{data['message'].strip()}\n")
    return msg


def envoyer(data: dict) -> None:
    """ Remet le message au serveur SMTP ; lève OSError ou smtplib.SMTPException en cas d'échec """
    env = os.environ
    host, port = env['CONTACT_SMTP_HOST'], int(env.get('CONTACT_SMTP_PORT') or 465)
    contexte = ssl.create_default_context()
    with (smtplib.SMTP_SSL(host, port, context=contexte, timeout=10) if port == 465
          else smtplib.SMTP(host, port, timeout=10)) as smtp:
        if port != 465:
            smtp.starttls(context=contexte)
        smtp.login(env['CONTACT_SMTP_USER'], env['CONTACT_SMTP_PASSWORD'])
        smtp.send_message(message(data))
