# University coverage — Italian public atenei

Census of Italian public universities and their online-timetable systems, with
the integration status in StudentOS. Compiled 2026-06-15.

**Systems seen** (only **EasyAcademy** is currently wired):
- **EasyAcademy** (EasyStaff / "agendaweb") — the one adapter we ship
  (`adapters/easyacademy.ts`). Public JSON over `grid_call.php` (lessons) +
  `test_call.php` (exams). ~30 atenei use it → highest-leverage integration.
- **Cineca University Planner (UP)** — `*.up.cineca.it/calendarioPubblico`. A
  distinct Cineca product (≠ Esse3). ~9 atenei. Adapter not implemented.
- **GOMP** (Be Smart) — `*-public.gomp.it`. Sapienza, Roma Tre, Catania, Cassino.
- **Esse3** as timetable (rare — most use Esse3 only for careers): Insubria,
  Teramo, Catanzaro.
- **In-house / custom**: Bologna (corsi.unibo.it), PoliMi/PoliTo (homegrown),
  Palermo (OffWeb), L'Aquila (MRBS), Milano/Bicocca/Bergamo (PortaleStudenti),
  Molise/Sannio (dept PDFs).

**Status legend**: ✅ live (timetable+exams verified against the real endpoint) ·
🟢 live (timetable only — ateneo keeps exams in Esse3) · 🟡 EasyAcademy but
unverifiable (grid not published / no target degree) → manual · ⚪ manual
(system has no adapter yet). All non-live atenei still let the student log in and
use manual entry / PDF import.

## ✅ Live EasyAcademy presets (verified 2026-06-15)

| ateneo | email domain | preset id | area | base url |
|---|---|---|---|---|
| Roma Tor Vergata | uniroma2.it | uniroma2-informatica-triennale | Informatica | easyutv.uniroma2.it/agendaweb |
| Trieste | units.it | units-ingegneria-informatica | Ing. Elettronica e Informatica | orari.units.it/agendaweb |
| Perugia | unipg.it | unipg-informatica | Informatica | easyacademy.unipg.it/agendaweb |
| Cagliari | unica.it | unica-informatica | Informatica | unica.easystaff.it/AgendaWeb |
| Trento | unitn.it | unitn-informatica | Informatica | easyacademy.unitn.it/AgendaStudentiUnitn |
| Napoli Federico II 🟢 | unina.it | unina-informatica | Informatica | easyacademy.unina.it/agendastudenti |
| Ferrara | unife.it | unife-informatica | Informatica | aule.unife.it/AgendaStudenti |
| Parma | unipr.it | unipr-informatica | Informatica | agendastudenti.unipr.it |
| Salerno | unisa.it | unisa-informatica | Informatica | easycourse.unisa.it/AgendaStudenti |
| Sassari | uniss.it | uniss-ingegneria-informatica | Ing. Informatica | orario.uniss.it/AgendaStudenti |
| Firenze | unifi.it | unifi-informatica | Informatica | kairos.unifi.it/agendaweb |
| Genova | unige.it | unige-informatica | Informatica | easyacademy.unige.it/portalestudenti |
| Piemonte Orientale | uniupo.it | uniupo-informatica | Informatica (Vercelli) | upoplanner.uniupo.it/timetable |
| Stranieri di Siena 🟢 | unistrasi.it | unistrasi-mediazione | Mediazione Linguistica | gd.unistrasi.it/agendaweb |
| Ca' Foscari Venezia | unive.it | unive-informatica | Informatica (69 corsi live, verif. 2026-06-17) | orari.unive.it/AgendaWebUnive |
| Salento (Lecce) | unisalento.it | unisalento-economia | Whole ateneo (81 corsi live, 31 con esami, verif. 2026-06-17) | logistica.unisalento.it/PortaleStudenti |
| Campania "Vanvitelli" 🟢 | unicampania.it | unicampania-ingegneria | Ingegneria (17 corsi live, 10 con esami, verif. 2026-06-17) | easyacademy.easystaff.it/agendastudenti |
| Bari Aldo Moro | uniba.it | uniba-giurisprudenza | Giurisprudenza + Scienze Politiche (12 corsi live, 4 con esami, verif. 2026-06-17) | easyacademy.ict.uniba.it/PortaleStudenti |
| Politecnica Marche | univpm.it | univpm-economia | Economia/Scienze/Medicina/Agraria (55 corsi live, 35 con esami, verif. 2026-06-22; Ingegneria NON pubblicata → manual) | aule.univpm.it/agendastudenti |

🟢 = timetable verified, exams not published via EasyAcademy (kept in Esse3).

## 🟡 EasyAcademy present but NOT wired (manual) — do not invent codes

| ateneo | email domain | base url | why not live |
|---|---|---|---|
| Padova | unipd.it | agendastudentiunipd.easystaff.it | grid is semester-keyed, `grid_call.php` returns celle=0 for every course/date (corso codes valid — exams work, timetable not exposed) |
| Roma Tre | uniroma3.it | easystaff.uniroma3.it/agendaweb | combo OK (33 corsi, elenco_anni pieno) ma **adapter end-to-end** → 0/33 corsi con celle>0 (grid_call `contains_data:0`, anche a novembre); esami in shape `Insegnamenti:[]` (array, incompat. adapter). Ri-verificato batch-4 2026-06-22 col metodo affidabile → NON pubblica orari |
| Tuscia (Viterbo) | unitus.it | orari.unitus.it/agendaweb | combo 51 corsi (scuola vuota, sede-keyed); **adapter end-to-end** → 0/51 con celle>0. Ri-verificato batch-4 2026-06-22 → manual |
| Chieti-Pescara | unich.it | easystaff.unich.it/agendaweb | catalogue is health/medical only — no Informatica/Ingegneria/Matematica; grid empty |

## ⚪ Other public atenei — manual (system has no adapter)

| ateneo | email domain | system | preset |
|---|---|---|---|
| Bologna | studio.unibo.it | custom (corsi.unibo.it) | unibo (manual) |
| Sapienza Roma | studenti.uniroma1.it | GOMP | uniroma1-sapienza (manual) |
| Milano Statale | studenti.unimi.it | PortaleStudenti | EXTRA domain, manual pick |
| Torino | edu.unito.it | Cineca University Planner | unito (manual) |
| Politecnico Milano | mail.polimi.it | custom (homegrown) | polimi (manual) |
| Politecnico Torino | studenti.polito.it | custom (homegrown) | polito (manual) |
| Pisa | studenti.unipi.it | EasyAcademy/UP (migrating) | unipi (manual — to re-probe) |
| Catania | studium.unict.it | GOMP | EXTRA domain, manual |
| Palermo | community.unipa.it | custom (OffWeb) | EXTRA domain, manual |
| Milano-Bicocca | campus.unimib.it | PortaleStudenti | EXTRA domain, manual |
| Pavia | universitadipavia.it | per-faculty | unipv (manual) |
| Politecnico Bari | poliba.it | EasyAcademy | EXTRA domain, manual (to probe) |
| Verona | univr.it | Cineca UP | EXTRA domain, manual (migrated off EasyAcademy) |
| Modena e Reggio Emilia | studenti.unimore.it | PortaleStudenti | EXTRA domain, manual |
| Calabria | studenti.unical.it | Cineca University Planner | EXTRA domain, manual |
| Messina | studenti.unime.it | Cineca University Planner | EXTRA domain, manual |
| Brescia | studenti.unibs.it | Cineca University Planner | migrated off EasyAcademy; manual |
| Bergamo | studenti.unibg.it | PortaleStudenti | EXTRA domain, manual |
| Insubria | studenti.uninsubria.it | Esse3 | EXTRA domain, manual |
| Udine | spes.uniud.it | PortaleStudenti | EXTRA domain, manual |
| Siena | student.unisi.it | EasyAcademy | unisi (manual, to probe) |
| Foggia | studenti.unifg.it | Cineca University Planner | EXTRA domain, manual |
| Reggio Calabria (Mediterranea) | studenti.unirc.it | Cineca University Planner | EXTRA domain, manual |
| Basilicata | studenti.unibas.it | Cineca University Planner | EXTRA domain, manual |
| Molise | studenti.unimol.it | dept PDFs | EXTRA domain, manual |
| Sannio | studenti.unisannio.it | dept PDFs | EXTRA domain, manual |
| Cassino | studentmail.unicas.it | GOMP | EXTRA domain, manual |
| L'Aquila | student.univaq.it | MRBS | EXTRA domain, manual |
| Teramo | studenti.unite.it | Esse3 | EXTRA domain, manual |
| Camerino | studenti.unicam.it | custom | EXTRA domain, manual |
| Macerata | studenti.unimc.it | EasyAcademy | EXTRA domain, manual (to probe) |
| Urbino | campus.uniurb.it | Cineca University Planner | manual |
| IUAV Venezia | stud.iuav.it | EasyAcademy (PortaleStudenti) | EXTRA domain, manual |
| Catanzaro | studenti.unicz.it | Esse3 | manual |
| Foro Italico (IUSM) | studenti.uniroma4.it | Cineca University Planner | manual |

> "to probe" = a likely EasyAcademy host not yet verified — next batch to run the
> combo-cascade extraction + `grid_call.php` verification on (same recipe used
> for the live ones). Never flip to `liveSources: true` without a real request
> returning `celle > 0`.

## How a live preset is derived (repeatable recipe)

1. `GET {base}/combo.php?sw=ec_&aa=2025&page=corsi` → `var elenco_corsi = [...]`
   (each entry: `label`, `valore`=corso, `scuola`, `elenco_anni[].valore`=anno2).
2. Pick the target degree (informatica/ingegneria). The 2025/26 reform often
   splits it across two `corso` codes (year-1 vs years-2/3) → per-year mapping.
3. Verify timetable: `POST {base}/grid_call.php` with scuola+corso+anno2[]+date
   → must return `celle > 0` on a term Monday.
4. Verify exams: `POST {base}/test_call.php` with esami_cdl + plain-year anno2[].
5. Wire with `easyAcademyPreset(...)` in `easyacademy-live.ts`; map the email
   domain in `emailToAteneo.ts`; the array is registered in `index.ts`.

## Recon 2026-06-17 — sistemi orari atenei manual-mode

Phase-1 reconnaissance (probe via throwaway `curl`, no preset written).
Classifies the 12 manual-mode presets in `italian-atenei.ts` + a quick
EasyAcademy probe of the secondary "to probe" hosts. **Detection of the system
(EasyAcademy vs Cineca UP vs GOMP vs custom vs login-walled) is reliable;**
see the off-season caveat below for why timetable `celle>0` could not be
confirmed for ANY ateneo in June.

### ✅ "celle=0" caveat — RESOLVED (was a raw-contract artifact, not off-season)

The recon initially concluded that `grid_call.php` returns `celle=0` everywhere in
June (off-season) and that only `combo.php` was verifiable. **That was wrong**: a
hand-built raw `grid_call.php` POST returns `celle=0` even for the shipping,
verified-live `units` preset — but the **real easyacademy adapter** returns
`celle>0` for the same course right now (units Architettura: 37/24/15 celle for
AA-2025/26; Ca' Foscari Informatica: 124/120/82 celle + 47/49/53 Appelli). So
`celle=0` from a manual curl is a **contract artifact** (the adapter encodes
fields/date-walking the raw POST omits), NOT proof of "not published". **The
reliable verification is to drive the adapter end-to-end** (a throwaway tsx over a
preset's `degreeSources`), which is exactly how the live presets are confirmed.
Ca' Foscari was wired live this session on that basis; Salento and Campania remain
combo-confirmed candidates to verify the same way next batch.

### Primary scope (the 12 manual-mode presets)

| ateneo | dominio email | sistema rilevato | host orario | endpoint orario | slug EasyAcademy | verdict |
|---|---|---|---|---|---|---|
| Sapienza Roma (uniroma1) | studenti.uniroma1.it | GOMP | corsidilaurea.uniroma1.it (GOMP) | n/a | — | GOMP |
| Bologna (unibo) | studio.unibo.it | in-house | corsi.unibo.it | n/a | — | in-house |
| Politecnico Milano (polimi) | mail.polimi.it | in-house | ceda.polimi.it / manifesti | n/a | — | in-house |
| Politecnico Torino (polito) | studenti.polito.it | in-house | didattica.polito.it | n/a | — | in-house |
| Padova (unipd) | unipd.it | EasyAcademy (period-keyed) | agendastudentiunipd.easystaff.it/AgendaStudentiUnipd | combo OK (400 corsi) ma `elenco_anni` VUOTO → grid celle=0 | agendastudentiunipd | EasyAcademy non pubblicato (period/semester-keyed, no course-grid anno2) |
| Siena (unisi) | student.unisi.it | **Cineca UP** | unisi.prod.up.cineca.it/calendarioPubblico | n/a | — | Cineca UP (coverage hypothesis "EasyAcademy" era ERRATA — migrato a Cineca) |
| Pisa (unipi) | studenti.unipi.it | **Cineca UP** | unipi.prod.up.cineca.it/calendarioPubblico | n/a | — | Cineca UP |
| Milano Statale (unimi) | studenti.unimi.it | EasyAcademy **login-walled** + PortaleStudenti | orari-be.divsi.unimi.it/EasyAcademy (login) · orari.unimi.it/PortaleStudenti | combo → "File not found" (auth) | — | login-walled |
| Torino (unito) | edu.unito.it | **Cineca UP** | unito.prod.up.cineca.it/calendarioPubblico | n/a | — | Cineca UP |
| Ca' Foscari Venezia (unive) | stud.unive.it | **EasyAcademy** | orari.unive.it/AgendaWebUnive | combo 130 corsi / 81 label; **adapter celle>0 + Appelli>0** (Informatica CTR3→CT3) | AgendaWebUnive | ✅ **WIRED LIVE 2026-06-17** — 69 corsi (65 con esami), preset `unive-informatica`; vedi `_unive-informatica_coverage.md` |
| Bocconi (unibocconi) | unibocconi.it | in-house (yoU@B) | didattica.unibocconi.eu/lezioni | n/a | — | in-house / login-walled |
| Pavia (unipv) | universitadipavia.it | **Cineca UP** | unipv.prod.up.cineca.it/calendarioPubblico | n/a | — | Cineca UP |

### Secondary scope (EasyAcademy quick-probe of "to probe" hosts)

| ateneo | dominio email | sistema rilevato | host orario | endpoint orario | slug EasyAcademy | verdict |
|---|---|---|---|---|---|---|
| Verona (univr) | univr.it | **Cineca UP** | univr.prod.up.cineca.it/calendarioPubblico | n/a | — | Cineca UP (NON EasyAcademy) |
| Salento/Lecce (unisalento) | studenti.unisalento.it | **EasyAcademy** | logistica.unisalento.it/PortaleStudenti | combo 158 corsi; **adapter celle>0** su tutti gli 81 raggruppamenti, Appelli>0 su 31 | PortaleStudenti | ✅ **WIRED LIVE 2026-06-17** — 81 corsi, preset `unisalento-economia`; vedi `_unisalento-economia_coverage.md` |
| Bari (uniba) | uniba.it | EasyAcademy (parziale) | easyacademy.ict.uniba.it/PortaleStudenti | combo 12 corsi (Giurisprudenza + Scienze Politiche); **adapter celle>0 su tutti i 12**, Appelli>0 su 4 | PortaleStudenti | ✅ **WIRED LIVE 2026-06-17** — 12 corsi, preset `uniba-giurisprudenza`; vedi `_uniba-giurisprudenza_coverage.md`. (Il resto dell'ateneo usa altri sistemi → manual) |
| Politecnico Bari (poliba) | poliba.it | in-house (PDF/dept) | poliba.it/orariolezioni (PDF) | n/a | — | in-house (orari pubblicati in PDF per dipartimento) |
| Campania Vanvitelli (unicampania) | studenti.unicampania.it | **EasyAcademy** | easyacademy.easystaff.it/agendastudenti | combo 40 corsi; **adapter celle>0** su tutti i 17 raggruppamenti, Appelli>0 su 10 (ingegneria) | agendastudenti (shared host) | ✅ **WIRED LIVE 2026-06-17** — 17 corsi, preset `unicampania-ingegneria`; vedi `_unicampania-ingegneria_coverage.md` |
| Macerata (unimc) | studenti.unimc.it | app/dept (myUNIMC + docenti.unimc.it) | nessun host agendaweb pubblico | n/a | — | in-house / app-based (nessun combo.php pubblico trovato) |
| IUAV Venezia (iuav) | stud.iuav.it | EasyAcademy (combo vuoto) | orarilezioni.iuav.it/PortaleStudentiIuav | combo `elenco_corsi=[]` per ogni aa (2023–2026) | PortaleStudentiIuav | EasyAcademy presente ma enumerazione corsi NON pubblica → login-walled/non verificabile |

### Verdetto sintetico

- **EasyAcademy wirati LIVE (sessioni 2026-06-17):** Ca' Foscari Venezia (unive,
  `unive-informatica`, 69 corsi, orari+esami) · Salento/Lecce (unisalento,
  `unisalento-economia`, 81 corsi, 31 con esami) · Campania Vanvitelli
  (unicampania, `unicampania-ingegneria`, 17 corsi, 10 con esami). Tutti
  verificati esercitando l'adapter reale end-to-end (`celle`/`Appelli` non vuoti).
- **EasyAcademy wirato LIVE 2026-06-17 (batch 3):** Bari Aldo Moro (uniba,
  `uniba-giurisprudenza`, 12 corsi live — Giurisprudenza + Scienze Politiche, 4
  con esami; deployment EasyAcademy parziale, resto ateneo su altri sistemi).
- **EasyAcademy ma non utilizzabile (nessun candidato verificabile rimasto):**
  Padova (period-keyed, anno2 assenti), Milano Statale (login-walled), IUAV
  (combo `elenco_corsi=[]` per ogni aa → login-walled), Macerata (nessun host
  agendaweb pubblico — app/dipartimentale), Roma Tre / Tuscia / Chieti / Politecnica
  Marche (grid non pubblicata).
- **Cineca University Planner (no adapter):** Siena, Pisa, Torino, Pavia, Verona.
- **GOMP:** Sapienza.
- **In-house / login-walled (no adapter):** Bologna, PoliMi, PoliTo, Bocconi,
  Politecnico Bari, Macerata.

## Batch-4 (2026-06-22) — sonda EasyAcademy adapter-end-to-end + manifesto discovery

Metodo orari: adapter reale end-to-end (mai curl grezzo — vedi caveat celle=0).
Metodo manifesto: fan-out di 20 agenti (web research + curl), bar = isManifestoHtml
(HTTP 200 + `<table>` + CFU/crediti), ri-verificato col contratto reale di discovery
(redirect:manual, no `-L`).

### Nuovi preset EasyAcademy
- **univpm** (`univpm-economia`) — Politecnica delle Marche, aule.univpm.it/agendastudenti:
  combo 119 corsi → **55 programmi live, 35 con esami** (Economia/Scienze/Medicina/Agraria).
  Ingegneria (41 corsi) sondata corso-per-corso: 0 celle → manual. Esami per-anno.

### Preset espansi
- **unicampania** — combo 40 corsi, preset già a 17. I 12 corsi scoperti sono stati
  sondati end-to-end: 8 tornano celle=0 (Scienze Agrarie/Ambientali/STAT, year-1
  Biologia/Sc.Biologiche/Alimenti), 3 (A48 Farmacia y4-5, B13 Ing. Biomedica y1,
  V17 Ing. Gestionale y1) sono varianti riforma/coorte duplicate di degree già
  presenti → conflitto anno-duplicato. **Nessuna espansione pulita**: i 17 restano
  il set verificato-completo per questo host. (Dato duplicato/sbagliato è peggio di nessuno.)

### Atenei sondati EasyAcademy e falliti (adapter end-to-end, non più curl)
- **Roma Tre** (easystaff.uniroma3.it/agendaweb): combo 33 corsi con `elenco_anni`
  pieno, ma **0/33 con celle>0** (grid_call `contains_data:0` anche a novembre);
  esami in shape `Insegnamenti:[]` (array, incompat. adapter). → NON pubblica orari.
- **Tuscia** (orari.unitus.it/agendaweb): combo 51 corsi (scuola vuota, sede-keyed),
  **0/51 con celle>0**. → manual.

### Manifesto discovery AGGIUNTO a discovery.ts (corsoUrls corso-gated, mai `urls` ateneo-wide)
- **unipg** (live) — www.unipg.it offerta-formativa, mappa nome→idcorso: Informatica,
  Chimica, Biotecnologie, Scienze Biologiche, Valutazione funz. psicologia.
- **uniupo** (live) — of.uniupo.it/syllabus, mappa nome→id: Informatica, Chimica.
- **unistrasi** (live) — dipartimento.unistrasi.it (tabella ~57 insegnamenti): Mediazione
  Linguistica e Culturale, Lingua e Cultura Italiana per l'insegnamento.
- **unitus** (DORMIENTE — nessun preset live) — GOMP unitus-public.gomp.it/manifesti,
  5 corsi area scienze (GUID opachi). Tenuto per futuro.
- **uniroma3** (DORMIENTE — nessun preset live) — matematicafisica.uniroma3.it, Fisica/Matematica.

### Manifesto discovery FALLITO (15/20) — motivo
| ateneo | motivo |
|---|---|
| univpm | pagine corso SPA/JS, niente tabella CFU statica (orari EasyAcademy LIVE, manifesto no) |
| unica | pagine corso www.unica.it senza `<table>`+CFU |
| unitn | offertaformativa.unitn.it interamente in manutenzione (ogni URL down) |
| unina | nessun manifesto server-rendered uniforme verificabile |
| unife | Plone, contenuto frammentato (mai `<table>`+CFU insieme) |
| unipr | Drupal, path con codici interni opachi non derivabili dal nome |
| unisa | slug-dal-nome ma pagina senza tabella CFU statica |
| uniss | catalogo Cineca coursecatalogue = SPA Angular |
| unive | codici numerici opachi senza relazione col nome, nessun URL utile |
| unisalento | Liferay, pagina dettaglio corso senza `<table>` |
| unicampania | decentralizzato, ogni dip. ha un sottodominio Joomla proprio |
| uniba | www.uniba.it dietro Radware Bot Manager (anti-bot challenge) → curl bloccato |
| unifi | dati insegnamenti in 3 posti, nessuno valido per isManifestoHtml |
| units | nessuna pagina con il token `<table>` |
| unige | un solo MF-code di corso ignoto, non mappabile dal nome → manual |

### Totali dopo batch-4
- Atenei EasyAcademy live: **19** (18 + Politecnica Marche).
- Atenei con manifesto discovery in discovery.ts: **12** (uniroma2, unibo + i 5 base-only
  unifi/units/unipd/unige/polito preesistenti, + i 5 nuovi unipg/uniupo/unistrasi/unitus/uniroma3).
  Di questi, **corso-gated funzionanti su preset live**: uniroma2, unibo, unipg, uniupo, unistrasi.
