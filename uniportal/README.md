# UniPortal

Portale universitario per l'Università di Roma **Tor Vergata**, con
autenticazione **SSO SAML 2.0** verso l'Identity Provider d'ateneo (federazione
**IDEM GARR**). Il sito agisce da **Service Provider (SP)**.

```
uniportal/
├─ server/   Node.js + Express + passport-saml + Prisma (SP SAML, API, sessioni PG)
├─ client/   React + TypeScript + Vite + TailwindCSS (login + dashboard)
└─ docker-compose.yml   PostgreSQL per sviluppo
```

## Stack

| Livello        | Tecnologia                                  |
|----------------|---------------------------------------------|
| Frontend       | React + TypeScript + TailwindCSS (Vite)     |
| Backend        | Node.js + Express                           |
| Autenticazione | SAML 2.0 SSO via `@node-saml/passport-saml` (IDEM GARR) |
| Database       | PostgreSQL (sessioni + dati sincronizzati)  |
| ORM            | Prisma                                       |

## Endpoint SAML (Service Provider)

| Endpoint               | Metodo   | Funzione                                                        |
|------------------------|----------|-----------------------------------------------------------------|
| `/saml/login`          | GET      | Avvia l'SSO: AuthnRequest → redirect all'IdP                    |
| `/saml/acs`            | POST     | Assertion Consumer Service: valida la Response, estrae attributi |
| `/saml/metadata`       | GET      | Metadata XML del SP (da registrare presso l'IdP/federazione)     |
| `/saml/logout`         | GET      | Single Logout iniziato dal SP                                    |
| `/saml/logout/callback`| GET/POST | Risposta di logout dall'IdP (**firma validata**)                |
| `/saml/dev-login`      | GET      | *Solo sviluppo*: sessione demo con dati mock, senza IdP          |

### Attributi estratti dalla Assertion

| OID                                   | Campo            |
|---------------------------------------|------------------|
| `urn:oid:1.3.6.1.4.1.25178.1.2.9`     | matricola        |
| `urn:oid:2.16.840.1.113730.3.1.241`   | nome completo    |
| `urn:oid:0.9.2342.19200300.100.1.3`   | email istituzionale |
| `urn:oid:1.3.6.1.4.1.25178.1.2.14`    | corso di laurea  |

Mappatura in `server/src/auth/attributes.ts`.

## Avvio in sviluppo

### 1. Database

```bash
docker compose up -d        # PostgreSQL su localhost:5432
```

### 2. Backend (Service Provider)

```bash
cd server
cp .env.example .env        # rivedi i valori (IdP, segreti)
npm install
npm run certs               # genera le chiavi autofirmate del SP (sviluppo)
npm run prisma:generate
npm run prisma:migrate      # crea le tabelle (users, synced_data)
npm run dev                 # http://localhost:4000
```

Poi scarica il **certificato di firma dell'IdP** dal suo metadata e salvalo in
`server/certs/idp-cert.pem` (senza di esso le Assertion non vengono validate).

### 3. Frontend

```bash
cd client
npm install
npm run dev                 # http://localhost:5173 (proxy /api e /saml → :4000)
```

Apri <http://localhost:5173> → "Accedi con SSO Tor Vergata".

### Provare la dashboard senza IdP (sviluppo)

Con `NODE_ENV=development` la pagina di login mostra **"Accesso demo"**, che usa
`/saml/dev-login`: crea una sessione con un utente fittizio e popola
`SyncedData` con dati mock (esami, CFU, piano di studi) tramite
`server/src/sync/mockAdapter.ts`. La dashboard mostra carriera, esami e piano
di studi senza bisogno dell'Identity Provider reale.

## Registrazione presso l'IdP

1. Avvia il SP e apri `http://localhost:4000/saml/metadata`.
2. Fornisci quel metadata all'amministratore dell'IdP di Tor Vergata (o alla
   federazione IDEM) per stabilire il trust.
3. Verifica che `entityID`, ACS (`/saml/acs`) e SLO (`/saml/logout/callback`)
   nel metadata corrispondano agli URL pubblici reali (in produzione: HTTPS).

## Note di sicurezza e limiti (scaffold)

- Le **chiavi sono autofirmate** e solo per sviluppo: in produzione usa un
  certificato registrato e ruotalo periodicamente.
- I file `.pem` e `.env` sono in `.gitignore`: **non committarli mai**.
- `wantAssertionsSigned` è attivo; imposta il **certificato IdP** (`idpCert`)
  prima del go-live.
- Il **logout callback** valida la firma del messaggio di logout
  (`LogoutResponse`/`LogoutRequest`) tramite l'istanza `SAML`: se la firma non
  è valida la sessione **non** viene chiusa (difesa da messaggi forgiati).
- In produzione: `secure: true` sui cookie (già attivo con `NODE_ENV=production`),
  HTTPS ovunque, `trust proxy` configurato dietro reverse proxy.
