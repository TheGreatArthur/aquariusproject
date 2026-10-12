# 0022. Contact form sent by the API over SMTP to the publisher's mail server
Date: 2026-10-12
Status: Accepted

## Context
The contact page sent its messages through EmailJS, from the browser. The service needed four `NEXT_PUBLIC_*`
keys built into the public JavaScript, the demo never had them (the form always failed), and every message went
through a third-party service. Arthur asked for a contact form that works, with the messages arriving on a private
server.

## Decision
- **The page posts the message to the API** (`POST /contact`, through the site's `/api` proxy). `backend/contact.py`
  validates it (required fields, lengths, email format, no line break in the fields that become mail headers) and
  sends it with Python's `smtplib` straight to the mail server set by environment variables: `CONTACT_SMTP_HOST`,
  `CONTACT_SMTP_PORT` (465 with TLS by default, 587 with STARTTLS), `CONTACT_SMTP_USER`, `CONTACT_SMTP_PASSWORD`,
  `CONTACT_TO` and optionally `CONTACT_FROM`. Any server works: a self-hosted one or a mailbox at a chosen provider.
  No credential is in the repository or in the browser, and no third party sees the message.
- **The mail comes from the server's own address** (`From`), with the visitor in `Reply-To`: answering writes to
  the visitor, and the sender stays aligned with the server's SPF and DKIM.
- **Bots** are stopped by a hidden field (`site`) and a minimum fill time (3 s, sent by the page). A bot caught this
  way gets the same success answer as a person, so nothing tells it about the trap.
- **Answers**: 202 when sent, 400 with the invalid fields (shown under each field), 503 when no mail server is
  configured (the page says the form is not connected yet), 502 when the server refuses (logged).
- The terms page (`/cgu`) says what the form collects, why, and for how long (one year at most after the last
  exchange), as the GDPR requires.

## Alternatives considered
- **Keep EmailJS** with its keys set on Vercel: the least work, but the keys stay public, and the messages go
  through a third party.
- **A form service (Formspree, Resend…)**: no SMTP code, but again a third party, and an account to manage.
- **Store the messages in a database read by an admin page**: no mail server needed, but the demo database is
  read-only, and it adds an authenticated page to build and secure.

## Consequences
- The form only works once the `CONTACT_*` variables are set in the API's Vercel project; until then it says so.
- There is no rate limit: Vercel functions keep no shared state between calls. If spam gets past the trap, a
  shared counter (Vercel KV or the mail server's own limits) is the next step.
- Vercel functions must be able to reach the mail server on port 465 or 587.
