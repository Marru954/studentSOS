# Tracking atenei EasyAcademy

Creato il 2026-09-26, insieme alla modalità `--auto` di `scripts/safe-merge.sh`, per avere in un posto solo lo stato reale delle sorgenti universitarie (le decisioni sull'auto-merge sono nel Registro decisioni di STATO.md).

**Come leggerlo.** Vale la regola di sempre: dato non verificato = dato non pubblicato ("wrong data is worse than none"). Una sorgente è "ok" solo se una POST reale a `grid_call.php` ha restituito `celle>0` (orari) o una a `test_call.php` `Appelli>0` (esami). *Nessuna data di lotto futuro è stata fissata da nessuno*: la colonna "Prossimo lotto" riporta il **trigger** già noto (STATO.md, CLAUDE.md), non una data inventata.

- **Anno verificato**: `2026` = a.a. 2026/27 (valore `anno` mandato a `grid_call.php`).
- **Stato sorgenti**: `ok` = orari verificati vivi · `0 lezioni` = l'ateneo risponde ma `celle=0` per l'anno richiesto · `manuale` = nessuna sorgente live (lo studente inserisce a mano o importa PDF).
- **Conteggi** = programmi live · sorgenti orario · sorgenti esami, letti dal codice (`UNIVERSITY_PRESETS[].livePrograms`) il 2026-09-26. Totale: **18 atenei, 1.484 programmi, 3.345 sorgenti orario, 2.489 esami**, uguale a `LIVE_PROGRAMME_COUNT`.

## Lotti verificati (tutti con richieste reali, mai codici inventati)

| Data | Lotto | Atenei | Esito |
|---|---|---|---|
| 2026-09-25 | Bump `anno` 2026 | 18 atenei live | 3.664 sorgenti rilette: 14 funzionanti prima → 1.970 dopo (con `anno=2025` /orario era vuoto da settembre). |
| 2026-09-25 | Ri-cattura codici, lotto 1 | unica, unife, unifi, unige, unina, unipg, unipr, uniss, unistrasi, unitn, units, uniupo | Preset rigenerati dal `combo.php` 2026; audit indipendente: 100% delle sorgenti orario vive (prima ~55%). |
| 2026-09-25 | Ri-cattura, lotto 2 | unive, unisa, uniroma2 | Audit dopo: 100% orari vivi. |
| 2026-09-25 | Ri-cattura, lotto 3 | unicampania, unisalento, univpm | Audit dopo: 100% orari vivi. |
| 2026-09-25 | Regola esami rigida | unifi, unina, uniroma2 (+ unisa rigenerata con lo stesso strumento) | Un anno tiene la sorgente esami solo se `test_call.php` ha appelli 2026/27; un errore di rete non spegne nulla. |
| 2026-09-25 | Tentativo lotto TV/Firenze/Federico II | uniroma2, unifi, unina | **Non è un lotto**: rete negata (403) dall'ambiente cloud, zero verifiche, nessun preset toccato. |

## Stato per ateneo

| Ateneo (preset) | Anno verificato | Stato sorgenti | Ultimo lotto verificato | Prossimo lotto | Note |
|---|---|---|---|---|---|
| Bari Aldo Moro (`uniba`) | — (wiring 2025/26, ultima verifica 2026-06-17) | **0 lezioni → manuale** | 2026-09-25 (rimesso in manuale) | Da pianificare: rivalidare il `combo.php` 2026 quando si popola | Eccezione. Il combo 2026 risponde 0 corsi e `grid_call` dà 0 celle in 10 settimane. `liveSources:false`; il wiring 2025/26 (12 corsi) resta in `UNIBA_LIVE_PROGRAMS_2025_26` per il ripristino (spostarlo in `livePrograms`, `liveSources:true`, bump `ANNO`). Il resto dell'ateneo usa altri sistemi. |
| Cagliari (`unica`) | 2026 | ok | 2026-09-25 · lotto 1 | Set 2027 + sessione esami | 119 programmi · 271 orari · 258 esami. |
| Ca' Foscari Venezia (`unive`) | 2026 | ok | 2026-09-25 · lotto 2 | Set 2027 + sessione esami | 68 programmi · 145 orari · 135 esami. |
| Campania Vanvitelli (`unicampania`) | 2026 | ok | 2026-09-25 · lotto 3 | Set 2027 + sessione esami | 11 programmi · 27 orari · 25 esami (a giugno erano 17 corsi: la ri-cattura tiene solo gli anni con `celle>0`). |
| Ferrara (`unife`) | 2026 + **2025 per 14 percorsi** | ok, con **0 lezioni su 2026** per i 14 percorsi abilitanti | 2026-09-25 · lotto 1 | Set 2027; ri-provare i 14 percorsi con `anno` 2026 quando pubblicano | Eccezione. I percorsi abilitanti (classi `a0xx`/`ab22`/`ac22`) restano su `ANNO_2025`: verificato che l'agendaweb li serve ancora sotto il 2025, con 2026 darebbero 0 celle (sarebbe una regressione). 104 programmi · 204 orari (190 su 2026, 14 su 2025) · 154 esami. |
| Firenze (`unifi`) | 2026 | ok | 2026-09-25 · lotto 1 + regola esami | A sessione esami aperta: rilanciare `recapture-codes.ts --exams-rule` | 173 programmi · 344 orari · 242 esami: gli anni senza appelli 2026/27 non hanno la sorgente esami (rilanciando lo strumento a sessione aperta si riattivano). |
| Genova (`unige`) | 2026 | ok | 2026-09-25 · lotto 1 | Set 2027 + sessione esami | 155 programmi · 369 orari · 337 esami. |
| Napoli Federico II (`unina`) | 2026 | ok (solo orari) | 2026-09-25 · lotto 1 + regola esami | Set 2027 | 101 programmi · 221 orari · 0 esami per scelta: gli appelli stanno in Esse3. Aperto: certificato di `easyacademy.unina.it` (`curl` dà `CRYPT_E_REVOKED`, Node funziona). |
| Parma (`unipr`) | 2026 | ok | 2026-09-25 · lotto 1 | Set 2027 + sessione esami | 121 programmi · 282 orari · 257 esami. |
| Perugia (`unipg`) | 2026 | ok | 2026-09-25 · lotto 1 | Set 2027 + sessione esami | 51 programmi · 131 orari · 131 esami. |
| Piemonte Orientale (`uniupo`) | 2026 | ok | 2026-09-25 · lotto 1 | Set 2027 + sessione esami | 66 programmi · 157 orari · 131 esami. |
| Politecnica delle Marche (`univpm`) | 2026 | ok | 2026-09-25 · lotto 3 | Set 2027 + sessione esami | 55 programmi · 139 orari · 82 esami. Ingegneria non pubblicata su EasyAcademy → manuale (sondata il 2026-06-22). |
| Salento (`unisalento`) | 2026 | ok | 2026-09-25 · lotto 3 | Set 2027 + sessione esami | 82 programmi · 198 orari · 78 esami. A settembre molte sorgenti esami danno 0 appelli: non spente, da rilanciare a sessione aperta. |
| Salerno (`unisa`) | 2026 | ok | 2026-09-25 · lotto 2 + regola esami | A sessione esami aperta: rilanciare `--exams-rule` | 76 programmi · 184 orari · 58 esami (esami spenti sugli anni senza appelli 2026/27). |
| Sassari (`uniss`) | 2026 | ok | 2026-09-25 · lotto 1 | Set 2027 + sessione esami | 85 programmi · 171 orari · 147 esami. |
| Stranieri di Siena (`unistrasi`) | 2026 | ok (solo orari) | 2026-09-25 · lotto 1 | Set 2027 | 12 programmi · 17 orari · 0 esami per scelta (in Esse3). |
| Tor Vergata (`uniroma2`) | 2026 | ok, ma **26 corsi in manuale** | 2026-09-25 · lotto 2 + regola esami | Da pianificare: rilanciare `recapture-codes.ts` quando pubblicano l'orario 2026/27 dei corsi tolti; riattivare esami e Lettere | 48 programmi · 123 orari · 117 esami. I 26 corsi tolti (quasi tutti Lettere/Psicologia) non avevano celle: probabile orario 2026/27 non ancora pubblicato. Informatica (triennale) è cablata a mano, non toccata dalla rigenerazione. |
| Trento (`unitn`) | 2026 | ok | 2026-09-25 · lotto 1 | Set 2027 + sessione esami | 74 programmi · 152 orari · 131 esami. |
| Trieste (`units`) | 2026 | ok | 2026-09-25 · lotto 1 | Set 2027 + sessione esami | 83 programmi · 210 orari · 206 esami. |

"Set 2027" è la regola annuale di CLAUDE.md ("ogni settembre, bump di `anno` e ri-verifica"); "sessione esami" indica che gli esami vanno riverificati con la sessione aperta (a settembre i calendari 2026/27 non sono ancora pubblicati).

## EasyAcademy presente ma non collegato (manuale)

Dal censimento di giugno (`src/lib/sync/universities/_coverage.md`), non riverificati dopo: **Padova** (griglia legata al semestre, `celle=0` per ogni corso; gli appelli funzionano ma serve una decisione sul suo `robots.txt`), **Roma Tre** e **Tuscia** (0 corsi con celle a fine giugno, ri-verificato il 2026-06-22), **Chieti-Pescara** (solo catalogo sanitario). Cineca UP e GOMP non stanno in questa tabella: vedi `_coverage.md` (adapter UP dormiente, nessun preset).

## Come tenerlo aggiornato

- I numeri si rileggono dal codice: da `studentos/`, un piccolo script `tsx` che itera `UNIVERSITY_PRESETS`, sorgenti per `capability` (`timetable`/`exams`) e valori distinti di `params.anno`.
- Un branch che cambia preset, coverage o modulo di sync **non** si auto-mergia: `safe-merge.sh --auto` si ferma anche a gate verde e chiede la conferma manuale (v. Registro decisioni in STATO.md). Aggiorna questo file nello stesso branch, dopo aver mostrato l'output reale della verifica.
