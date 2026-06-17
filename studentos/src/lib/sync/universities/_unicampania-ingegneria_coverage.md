# Università della Campania "Luigi Vanvitelli" — copertura corsi (verificata via combo.php + adapter grid/test_call)

`unicampania-ingegneria` · base `easyacademy.easystaff.it/agendastudenti` ·
scuola `DipartimentodiIngegneria` per i corsi di ingegneria, vuota per scienze/farmacia.

Totale corsi combo: **40** → raggruppati in **17 lauree live** + 3 corsi di scienze manuali.
Orari live: **17/17** (ogni source restituisce `celle>0`). Esami live (`Appelli>0`): **10**
(ingegneria); le 7 lauree scienze/farmacia espongono solo l'orario (`exams:false`).
Verificato il **2026-06-17** esercitando i `degreeSources` end-to-end tramite l'adapter
easyacademy reale (non il raw `grid_call.php`). Codici (`corso`/`anno2`/`scuola`) dal portale
`combo.php?sw=ec_&aa=2025&page=corsi`, mai inventati.

La riforma ordinamento 2025/26 spezza i corsi su un codice anno-1 `V<nn>` ("primo anno")
e un codice anno-2+ `A/B<nn>` base, ciascuno con i propri `anno2` curriculari.

## Corsi

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Biologia | `A38` | 2 | 4 | 0 | 🟢 live orari (esami 0) |
| Biotecnologie | `V46/A46` | 1,2,3 | 50 | 0 | 🟢 live orari (esami 0) |
| Farmacia | `V49/B49` | 1,2,3,4,5 | 97 | 0 | 🟢 live orari (esami 0) |
| Ingegneria Aerospaziale | `V15/A15` | 1,2 | 44 | 5 | ✅ live orari+esami |
| Ingegneria Aerospaziale, Meccanica, Energetica | `V14/B14` | 1,2,3 | 176 | 70 | ✅ live orari+esami |
| Ingegneria Biomedica | `V04/B04` | 1,2,3 | 83 | 49 | ✅ live orari+esami |
| Ingegneria Civile | `V99/A99` | 1,2 | 229 | 14 | ✅ live orari+esami |
| Ingegneria Civile - Edile - Ambientale | `V92/A92` | 1,2,3 | 172 | 35 | ✅ live orari+esami |
| Ingegneria Elettronica | `A17` | 1,2 | 56 | 0 | 🟢 live orari (esami 0) |
| Ingegneria Elettronica e Informatica | `V13/A13` | 1,2,3 | 98 | 44 | ✅ live orari+esami |
| Ingegneria Gestionale | `B02/B03` | 1,2,3 | 66 | 42 | ✅ live orari+esami |
| Ingegneria Informatica | `A18` | 1,2 | 37 | 17 | ✅ live orari+esami |
| Ingegneria Meccanica | `A19` | 1,2 | 76 | 10 | ✅ live orari+esami |
| Ingegneria per L'energia e L'ambiente | `V98/A98` | 1,2 | 82 | 7 | ✅ live orari+esami |
| Molecular Biotechnology | `V47/B47` | 1,2 | 36 | 0 | 🟢 live orari (esami 0) |
| Scienze Biologiche | `A36` | 2 | 6 | 0 | 🟢 live orari (esami 0) |
| Scienze degli Alimenti e della Nutrizione Umana | `A94` | 2 | 10 | 0 | 🟢 live orari (esami 0) |

## Manuali (nessun `celle>0` nelle finestre sondate)

In `ateneo-courses.ts`: Scienze Agrarie e Forestali · Scienze Ambientali ·
Scienze e Tecnologie per L'ambiente e il Territorio. La combo le elenca (curricula `GEN`),
ma `grid_call.php` non ha restituito lezioni nelle finestre autunno-2025 / primavera-2026
sondate → manuale, da riverificare a ottobre 2026 col semestre in corso.

> `🟢 live orari (esami 0)` = orario verificato live, ma `test_call.php` non espone appelli
> per quel `corso` (esami su altro sistema d'ateneo); riproponibile a ottobre 2026.
