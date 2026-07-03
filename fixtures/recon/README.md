# fixtures/recon — stato: VUOTA per policy di rete (2026-07-03)

Questa cartella dovrebbe contenere **una risposta reale grezza** per ateneo
(`<ateneo>.html` / `<ateneo>.json`, scaricata senza modifiche — FASE 3 della
ricognizione). **Oggi 2026-07-03 è vuota** perché in questo ambiente la policy
di egress dell'organizzazione **nega tutti e 6 gli host bersaglio**: ogni
richiesta HTTPS (curl, WebFetch, browser) riceve `403` alla CONNECT dal proxy.

Evidenza salvata: `_proxy-status-2026-07-03.json` (dump di
`http://127.0.0.1:40587/__agentproxy/status`) elenca i `recentRelayFailures`
`connect_rejected — gateway answered 403 to CONNECT (policy denial)` per
`corsidilaurea.uniroma1.it`, `corsi.unibo.it`, `www.unibo.it`, `www.polimi.it`,
`onlineservices.polimi.it`, `didattica.polito.it`, `swas.polito.it`,
`www.unipd.it`, `agendastudentiunipd.easystaff.it`, `www.unipi.it`,
`unipi.prod.up.cineca.it`, `www.uniroma1.it`.

Muro #4 + regola del README del proxy: non si aggira una policy denial e non si
fabbrica un esempio. Quindi **nessuna fixture inventata**: la cartella resta
vuota finché l'egress non viene abilitato (o finché la ricognizione non gira in
un ambiente con rete aperta, come è successo il 2026-07-02).

## Cosa catturare per ateneo quando l'egress sarà disponibile

Percorsi già individuati e verificati con richieste reali il **2026-07-02**
(vedi `_recon_cineca-gomp_2026-07-02.md` e `docs/recon-cineca-gomp.md`). Da
riconfermare al momento della cattura.

| File atteso | Richiesta grezza da salvare |
|---|---|
| `sapienza.json` | `GET https://corsidilaurea.uniroma1.it/it/services/gomp/timetable-data/33503?start=2025-10-13&end=2025-10-18` (feed orario GOMP-via-Drupal, JSON) |
| `sapienza-appelli.html` | `GET https://corsidilaurea.uniroma1.it/it/course/33503/attendance/exams` (tabella appelli HTML) |
| `bologna.html` | `GET https://corsi.unibo.it/laurea/informatica/appelli` (tabelle appelli HTML pubbliche) — l'orario JSON `@@orario_reale_json` torna `[]` fuori semestre |
| `polimi.html` | `GET https://onlineservices.polimi.it/manifesti/manifesti/controller/ManifestoPublic.do?EVN_DEFAULT=evento&aa=2026&k_cf=222&k_corso_la=1030&lang=IT` (manifesto pubblico; orario/appelli reali sono dietro login) |
| `polito.html` | `GET https://swas.polito.it/dotnet/orari_lezione_pub/filtri_consultazione_generale.aspx` (cascata WebForms; la griglia richiede `__doPostBack`+`__VIEWSTATE`) |
| `padova.json` | `POST https://agendastudentiunipd.easystaff.it/test_call.php` body EasyAcademy (`view=easytest&form-type=et_cdl&scuola=ScuoladiScienze&esami_cdl=SC2987&anno2[]=1,2,3&datefrom=…&dateto=…`) — ⚠️ `robots.txt` = `Disallow: /` |
| `pisa.json` | `POST https://unipi.prod.up.cineca.it/api/Impegni/getImpegniCalendarioPubblico` body `{clienteId, linkCalendarioId, dataInizio, dataFine}` (Cineca University Planner, JSON) |

Salvare **grezzo**, nessuna riformattazione (`curl … -o fixtures/recon/<file>`).
