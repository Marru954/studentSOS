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
| Verona | univr.it | EasyAcademy | EXTRA domain, manual (to probe) |
| Ca' Foscari Venezia | stud.unive.it | EasyAcademy | unive-cafoscari (manual, to probe) |
| Modena e Reggio Emilia | studenti.unimore.it | PortaleStudenti | EXTRA domain, manual |
| Salento (Lecce) | studenti.unisalento.it | EasyAcademy | EXTRA domain, manual (to probe) |
| Calabria | studenti.unical.it | Cineca University Planner | EXTRA domain, manual |
| Campania Vanvitelli | studenti.unicampania.it | EasyAcademy | EXTRA domain, manual (to probe) |
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
