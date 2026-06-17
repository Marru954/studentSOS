# Università degli Studi di Bari Aldo Moro — copertura corsi (verificata via combo.php + adapter grid/test_call)

`uniba-giurisprudenza` · base `easyacademy.ict.uniba.it/PortaleStudenti`.

Deployment EasyAcademy **parziale**: su questo host pubblicano solo il Dipartimento di
Giurisprudenza e il Dipartimento di Scienze Politiche → **12 corsi, tutti live**. Il resto
di UniBA (Informatica, Ingegneria, Economia, Medicina, …) usa altri sistemi → resta manuale.
Nessuno split riforma 2025/26 su questo host (un `corso` per laurea, anni via suffisso
`anno2`; alcuni curricula con spazi letterali, es. `RISPI 1|1`, tenuti esatti).

Orari live: **12/12** (`celle>0` su ogni source, verificato esercitando l'adapter reale
end-to-end). Esami live (`Appelli>0`): **1 sola source** — Giurisprudenza anno-1 (2 appelli
reali). Ri-verificato il **2026-06-17** sull'intero anno accademico (Mar 2026 → Feb 2027,
finestra che include anche la sessione invernale): tutti gli altri corsi — comprese
Giurisprudenza anni 2-5, Giurisprudenza D'impresa, Consulente del Lavoro, Scienze dei
Servizi Giuridici — tengono gli appelli fuori da EasyAcademy (`test_call.php` torna
`Insegnamenti` vuoto) → solo orario (`exams:false`). Codici dal portale
`combo.php?sw=ec_&aa=2025&page=corsi`, mai inventati.

> **Nota (correzione 2026-06-17):** un primo censimento aveva marcato 4 corsi area
> Giurisprudenza come `exams:true`; un QA su finestra intero anno accademico ha trovato
> appelli reali solo per Giurisprudenza anno-1. Gli altri sono stati riportati a
> `exams:false` (regola "dato vuoto è peggio di nessun dato"). Riproponibile a ottobre 2026.

## Corsi

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Consulente del Lavoro e Operatore D'impresa | `7968` | 1,2,3 | 52 | 0 | 🟢 live orari (esami 0) |
| Giurisprudenza | `6001` | 1,2,3,4,5 | 135 | 2 (solo anno-1) | ✅ live orari + esami anno-1 |
| Giurisprudenza D'impresa | `6002` | 1,2,3,4,5 | 99 | 0 | 🟢 live orari (esami 0) |
| Interclasse Magistrale RISPI | `8915` | 1,2 | 80 | 0 | 🟢 live orari (esami 0) |
| L-16 Scienze Politiche, Economiche e Amministrative (SPEA) | `7975` | 1,2,3 | 72 | 0 | 🟢 live orari (esami 0) |
| L-36 Scienze Politiche (SP) | `7976` | 1,2,3 | 92 | 0 | 🟢 live orari (esami 0) |
| L-39/L40 Interclasse Scienze del Servizio Sociale e Sociologia (SSSS) Percorso Sociologia | `7977` | 1,2,3 | 137 | 0 | 🟢 live orari (esami 0) |
| Laurea Magistrale in Diritto dello Sviluppo Sostenibile | `8988` | 1,2 | 34 | 0 | 🟢 live orari (esami 0) |
| LM-52 Relazioni Internazionali e Studi Europei (RISE) | `8985` | 1,2 | 61 | 0 | 🟢 live orari (esami 0) |
| LM-63 Scienze delle Amministrazioni (SA) | `8990` | 1,2 | 65 | 0 | 🟢 live orari (esami 0) |
| LM-87 Innovazione Sociale e Politiche di Inclusione (ISPI) | `8986` | 1,2 | 24 | 0 | 🟢 live orari (esami 0) |
| Scienze dei Servizi Giuridici | `7222` | 1,2,3 | 52 | 1 (anno-2, troppo sparso) | 🟢 live orari (esami 0) |

## Manuali

Nessun corso manuale sull'host EasyAcademy (i 12 esposti sono tutti live). Gli altri
dipartimenti dell'ateneo non pubblicano qui → restano in modalità manuale generica.

> `🟢 live orari (esami 0)` = orario verificato live, ma `test_call.php` non espone appelli
> per quel `corso` (esami su altro sistema d'ateneo); riproponibile a ottobre 2026.
