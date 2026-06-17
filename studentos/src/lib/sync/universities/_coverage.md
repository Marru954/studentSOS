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

🟢 = timetable verified, exams not published via EasyAcademy (kept in Esse3).

## 🟡 EasyAcademy present but NOT wired (manual) — do not invent codes

| ateneo | email domain | base url | why not live |
|---|---|---|---|
| Padova | unipd.it | agendastudentiunipd.easystaff.it | grid is semester-keyed, `grid_call.php` returns celle=0 for every course/date (corso codes valid — exams work, timetable not exposed) |
| Roma Tre | uniroma3.it | easystaff.uniroma3.it/agendaweb | instance live but publishes NO grid/exam data (celle=0 everywhere) |
| Tuscia (Viterbo) | unitus.it | orari.unitus.it/agendaweb | timetables organised by sede, not the standard course-grid contract → celle=0 |
| Chieti-Pescara | unich.it | easystaff.unich.it/agendaweb | catalogue is health/medical only — no Informatica/Ingegneria/Matematica; grid empty |
| Politecnica Marche | univpm.it | aule.univpm.it/agendastudenti | Ingegneria grid not published (other schools work); exams verify but timetable doesn't |

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
| Bari Aldo Moro | studenti.uniba.it | EasyAcademy | EXTRA domain, manual (to probe) |
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
| Bari (uniba) | studenti.uniba.it | EasyAcademy (parziale) | easyacademy.ict.uniba.it/PortaleStudenti | combo OK ma **solo 12 corsi** (solo Giurisprudenza + Scienze Politiche; no Info/Ing/Eco) | PortaleStudenti | EasyAcademy ma catalogo pubblico ridotto → manual finché non compaiono Info/Ing |
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
- **EasyAcademy verificabile (combo) — prossimo batch:** Bari (uniba, ma catalogo
  pubblico ridotto a 12 corsi), Macerata/IUAV (da riprovare). Vedi tabella sotto.
- **EasyAcademy ma non utilizzabile:** Padova (period-keyed, anno2 assenti),
  Bari (catalogo pubblico ridotto a 12 corsi), Milano Statale (login-walled),
  IUAV (combo vuoto).
- **Cineca University Planner (no adapter):** Siena, Pisa, Torino, Pavia, Verona.
- **GOMP:** Sapienza.
- **In-house / login-walled (no adapter):** Bologna, PoliMi, PoliTo, Bocconi,
  Politecnico Bari, Macerata.
