# Università degli Studi di Bari Aldo Moro — copertura corsi (verificata via combo.php + adapter grid/test_call)

`uniba-giurisprudenza` · base `easyacademy.ict.uniba.it/PortaleStudenti`.

Deployment EasyAcademy **parziale**: su questo host pubblicano solo il Dipartimento di
Giurisprudenza e il Dipartimento di Scienze Politiche → **12 corsi, tutti live**. Il resto
di UniBA (Informatica, Ingegneria, Economia, Medicina, …) usa altri sistemi → resta manuale.
Nessuno split riforma 2025/26 su questo host (un `corso` per laurea, anni via suffisso
`anno2`; alcuni curricula con spazi letterali, es. `RISPI 1|1`, tenuti esatti).

Orari live: **12/12** (`celle>0` su ogni source, verificato esercitando l'adapter reale
end-to-end). Esami live (`Appelli>0`): **4** (area Giurisprudenza); le 8 lauree di Scienze
Politiche tengono gli appelli fuori da EasyAcademy → solo orario (`exams:false`).
Verificato il **2026-06-17**. Codici dal portale `combo.php?sw=ec_&aa=2025&page=corsi`,
mai inventati.

## Corsi

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Consulente del Lavoro e Operatore D'impresa | `7968` | 1,2,3 | 52 | 4 | ✅ live orari+esami |
| Giurisprudenza | `6001` | 1,2,3,4,5 | 135 | 23 | ✅ live orari+esami |
| Giurisprudenza D'impresa | `6002` | 1,2,3,4,5 | 99 | 4 | ✅ live orari+esami |
| Interclasse Magistrale RISPI | `8915` | 1,2 | 80 | 0 | 🟢 live orari (esami 0) |
| L-16 Scienze Politiche, Economiche e Amministrative (SPEA) | `7975` | 1,2,3 | 72 | 0 | 🟢 live orari (esami 0) |
| L-36 Scienze Politiche (SP) | `7976` | 1,2,3 | 92 | 0 | 🟢 live orari (esami 0) |
| L-39/L40 Interclasse Scienze del Servizio Sociale e Sociologia (SSSS) Percorso Sociologia | `7977` | 1,2,3 | 137 | 0 | 🟢 live orari (esami 0) |
| Laurea Magistrale in Diritto dello Sviluppo Sostenibile | `8988` | 1,2 | 34 | 0 | 🟢 live orari (esami 0) |
| LM-52 Relazioni Internazionali e Studi Europei (RISE) | `8985` | 1,2 | 61 | 0 | 🟢 live orari (esami 0) |
| LM-63 Scienze delle Amministrazioni (SA) | `8990` | 1,2 | 65 | 0 | 🟢 live orari (esami 0) |
| LM-87 Innovazione Sociale e Politiche di Inclusione (ISPI) | `8986` | 1,2 | 24 | 0 | 🟢 live orari (esami 0) |
| Scienze dei Servizi Giuridici | `7222` | 1,2,3 | 52 | 7 | ✅ live orari+esami |

## Manuali

Nessun corso manuale sull'host EasyAcademy (i 12 esposti sono tutti live). Gli altri
dipartimenti dell'ateneo non pubblicano qui → restano in modalità manuale generica.

> `🟢 live orari (esami 0)` = orario verificato live, ma `test_call.php` non espone appelli
> per quel `corso` (esami su altro sistema d'ateneo); riproponibile a ottobre 2026.
