import smtplib

import pytest

import contact

MESSAGE = {'nom': 'Durand', 'prenom': 'Léa', 'email': 'lea@example.org', 'sujet': 'Une espèce à ajouter',
           'message': 'Bonjour,\nPourriez-vous ajouter Betta mahachaiensis ?', 'site': '', 'delai': 12000}
SMTP = {'CONTACT_SMTP_HOST': 'mail.example.net', 'CONTACT_SMTP_USER': 'aquarius@example.net',
        'CONTACT_SMTP_PASSWORD': 'secret', 'CONTACT_TO': 'arthur@example.net'}


class FauxSMTP:
    envoyes = []

    def __init__(self, host, port, **kwargs):
        self.host, self.port, self.tls = host, port, False

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def starttls(self, context=None):
        self.tls = True

    def login(self, user, password):
        self.user = user

    def send_message(self, msg):
        FauxSMTP.envoyes.append((self, msg))


@pytest.fixture
def smtp(monkeypatch):
    for nom, valeur in SMTP.items():
        monkeypatch.setenv(nom, valeur)
    FauxSMTP.envoyes = []
    monkeypatch.setattr(smtplib, 'SMTP_SSL', FauxSMTP)
    monkeypatch.setattr(smtplib, 'SMTP', FauxSMTP)
    return FauxSMTP.envoyes


def test_a_valid_message_reaches_the_configured_mailbox(client, smtp):
    response = client.post('/contact', json=MESSAGE)

    assert response.status_code == 202
    serveur, msg = smtp[0]
    assert (serveur.host, serveur.port, serveur.user) == ('mail.example.net', 465, 'aquarius@example.net')
    assert msg['To'] == 'arthur@example.net' and msg['From'] == 'aquarius@example.net'
    assert msg['Reply-To'] == 'lea@example.org'
    assert msg['Subject'] == '[Aquarius] Une espèce à ajouter'
    assert 'Léa Durand <lea@example.org>' in msg.get_content() and 'Betta mahachaiensis' in msg.get_content()


def test_port_587_uses_starttls(client, smtp, monkeypatch):
    monkeypatch.setenv('CONTACT_SMTP_PORT', '587')

    assert client.post('/contact', json=MESSAGE).status_code == 202
    assert smtp[0][0].tls


@pytest.mark.parametrize('champ, valeur, erreur', [
    ('email', 'pas-une-adresse', 'invalide'),
    ('sujet', 'Sujet\r\nBcc: tous@example.com', 'invalide'),
    ('message', ' ', 'requis'),
    ('nom', 'x' * 101, 'trop long'),
])
def test_invalid_fields_are_refused_and_nothing_is_sent(client, smtp, champ, valeur, erreur):
    response = client.post('/contact', json={**MESSAGE, champ: valeur})

    assert response.status_code == 400
    assert response.get_json()['erreurs'] == {champ: erreur}
    assert smtp == []


@pytest.mark.parametrize('piege', [{'site': 'https://spam.example'}, {'delai': 400}, {'delai': None}])
def test_robots_get_a_success_but_nothing_is_sent(client, smtp, piege):
    assert client.post('/contact', json={**MESSAGE, **piege}).status_code == 202
    assert smtp == []


def test_without_a_mail_server_the_form_reports_it(client, monkeypatch):
    for nom in SMTP:
        monkeypatch.delenv(nom, raising=False)

    assert client.post('/contact', json=MESSAGE).status_code == 503


def test_a_mail_server_failure_is_reported(client, smtp, monkeypatch):
    def refuse(self, user, password):
        raise smtplib.SMTPAuthenticationError(535, b'bad credentials')
    monkeypatch.setattr(FauxSMTP, 'login', refuse)

    assert client.post('/contact', json=MESSAGE).status_code == 502


def test_header_values_cannot_inject_headers():
    assert contact.erreurs({**MESSAGE, 'nom': 'Léa\nBcc: x@example.com'}) == {'nom': 'invalide'}
