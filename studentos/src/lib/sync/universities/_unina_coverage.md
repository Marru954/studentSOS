# Università degli Studi di Napoli Federico II — copertura corsi (verificata via combo.php + grid_call)

Totale corsi: **272** · orari live: **167**. Esami: no (in Esse3) → solo orari.

Codici (`scuola`/`corso`/`anno2`) dal portale, mai inventati.

## Ri-verifica anno accademico 2026/27 — 2026-09-25

Sorgente: GET reale `https://easyacademy.unina.it/agendastudenti/combo.php?sw=ec_&aa=2026&page=corsi` + POST reali `grid_call.php` (anno=2026, settimane 28-09, 12-10, 09-11, 07-12-2026 e 01-03-2027: basta una con `celle` non vuote) e `test_call.php` (appelli 01-09-2026..30-09-2027; se vuoto, controllo sul 2025/26 per distinguere "calendario non ancora pubblicato" da "codice inesistente"). Nessun codice inventato: ogni riga sotto è stata restituita dal combo 2026 e confermata da una risposta non vuota.

- Programmi (livePrograms) prima: **114** · dopo: **106** (rimossi interamente: **8**)
- Anni-sorgente orario prima: **225** · dopo: **198** (invariati verificati: 114, ricatturati/aggiornati: 84, rimossi: 27)
- Programmi rimasti live solo in parte (alcuni anni rimossi): **18**
- Le tabelle per scuola più sotto sono lo **storico della verifica 2025/26** e NON sono state rigenerate: fa fede questa sezione.

### Ri-controllo settimanale 28-09..30-11-2026 (criterio live: celle > 0 in almeno una delle 10 settimane)

Un POST a `grid_call.php` (anno=2026) per ciascuna delle 10 settimane (lunedì 28-09, 05-10, 12-10, 19-10, 26-10, 02-11, 09-11, 16-11, 23-11, 30-11), con concorrenza 3 e pausa tra le richieste. Una cella isolata fuori finestra (dicembre/marzo) non basta.

- Sorgenti orario controllate: **196** · restano live: **161** · rimosse: **35** (programmi rimossi per intero: 18)
- La tabella "Corsi live verificati" qui sotto e le sezioni precedenti sono anteriori a questo ri-controllo: per gli anni elencati nella tabella seguente fa fede questa sezione (sono stati rimossi da `livePrograms`).

| Corso | scuola | Anno | corso originale | anno2 originale | Motivo |
|---|---|---|---|---|---|
| Biologia | CollegiodiScienze | 1 | `D52` | `BCC\|1, BDR\|1, BNU\|1, BFO\|1, BMC\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Biologia | CollegiodiScienze | 2 | `D52` | `BCC\|2, BDR\|2, BNU\|2, BFO\|2, BMC\|2` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Biologia Lt | CollegiodiScienze | 1 | `D50` | `GEN\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Biologia Lt | CollegiodiScienze | 2 | `D50` | `GEN\|2` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Biologia Lt | CollegiodiScienze | 3 | `P30` | `GEN\|3` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Biotecnologie Molecolari e Industriali (magistrale) | CollegiodiScienze | 1 | `D76` | `BRR\|1, PRB\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Biotecnologie Molecolari e Industriali (magistrale) | CollegiodiScienze | 2 | `D76` | `BRR\|2, PRB\|2` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Biotecnologie Molecolari e Industriali (magistrale) (DG5) | CollegiodiScienze | 1 | `DG5` | `IDS\|1, MCR\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Chimica | CollegiodiScienze | 1 | `D74` | `GEN\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Chimica | CollegiodiScienze | 2 | `D74` | `GEN\|2` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Chimica | CollegiodiScienze | 3 | `D44` | `GEN\|3` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Corso di Laurea in Biotecnologie Biomolecolari e Industriali | CollegiodiScienze | 3 | `N75` | `GEN\|3` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Digital Society, Social Innovation and Global Citizenship | DipartimentodiScienzeSociali | 1 | `DA2` | `GEN\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Fisica Lt | CollegiodiScienze | 1 | `DC6` | `GEN\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Fisica Lt | CollegiodiScienze | 2 | `DC6` | `GEN\|2` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Fisica Lt | CollegiodiScienze | 3 | `N85` | `GEN\|3` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Industrial Chemistry for Circular and Bio Economy | CollegiodiScienze | 1 | `DG8` | `PAI\|1, PAL\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Marine Biology and Aquaculture | CollegiodiScienze | 2 | `D54` | `AGM\|2, CMB\|2` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Matematica | CollegiodiScienze | 1 | `D70` | `MAP\|1, DID\|1, MGE\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Matematica | CollegiodiScienze | 2 | `DF7` | `GEN\|2` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Matematica Lt | CollegiodiScienze | 1 | `DF7` | `GEN\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Matematica Lt | CollegiodiScienze | 3 | `N87` | `A31\|3, A32\|3` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Ottica e Optometria | CollegiodiScienze | 1 | `DC7` | `GEN\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Ottica e Optometria | CollegiodiScienze | 2 | `DC7` | `GEN\|2` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Ottica e Optometria | CollegiodiScienze | 3 | `M44` | `GEN\|3` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Quantum Science and Engineering | CollegiodiScienze | 1 | `D60` | `GEN\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Scienze Biologiche | CollegiodiScienze | 1 | `D55` | `BIA\|1, BDB\|1, BQS\|1, NEU\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Scienze Biologiche | CollegiodiScienze | 2 | `D55` | `BDN\|2, BIA\|2, BSC\|2, NEU\|2` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Scienze Chimiche | CollegiodiScienze | 1 | `DG7` | `CHS\|1, SCH\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Scienze e Tecnologie della Chimica Industriale | CollegiodiScienze | 1 | `D75` | `FIN\|1, PPT\|1, SCP\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Scienze Naturali | CollegiodiScienze | 1 | `D56` | `CGC\|1, GPN\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Scienze Naturali | CollegiodiScienze | 2 | `D56` | `CGC\|2, GPN\|2` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Scienze per la Natura e per L'ambiente | CollegiodiScienze | 1 | `D51` | `GEA\|1, MDB\|1` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Scienze per la Natura e per L'ambiente | CollegiodiScienze | 2 | `D51` | `GEA\|2, MDB\|2` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |
| Scienze per la Natura e per L'ambiente | CollegiodiScienze | 3 | `P29` | `GEA\|3, MDB\|3` | 0 celle in tutte le 10 settimane 28-09..30-11-2026 (ripristinare quando pubblicano gli orari) |

Campione celle per settimana (28-09 … 30-11):

- Architecture and Heritage (anno 1, `DB2`): 0, 11, 11, 11, 11, 11, 11, 11, 11, 11
- Architettura per Comunità, Territori e Ambiente (anno 2, `DB8`): 8, 8, 8, 8, 8, 8, 0, 8, 8, 8
- Civil and Environmental Engineering (anno 2, `D38`): 11, 11, 11, 11, 11, 11, 9, 11, 11, 11
- Corso di Laurea in Ingegneria Elettrica (anno 3, `N42`): 10, 10, 10, 10, 10, 10, 7, 10, 10, 10
- Design per la Comunita' (anno 2, `DB0`): 10, 10, 10, 10, 10, 10, 0, 10, 10, 10
- Informatica (magistrale) (anno 1, `DE5`): 26, 26, 26, 26, 26, 26, 12, 26, 26, 26

### Corsi live verificati (2026/27)

| Corso | scuola | corso (per anno) | Anni live | celle/anno | appelli/anno | Stato |
|---|---|---|---|---|---|---|
| Architecture and Heritage | CollegiodiArchitettura | 1:`DB2` 2:`DB2` | 1,2 | 11,7 | -,- | solo orari (esami in Esse3) |
| Architettura | CollegiodiArchitettura | 1:`DB7` 2:`DB7` 3:`D06` 4:`D06` 5:`N14` | 1,2,3,4,5 | 29,30,24,41,27 | -,-,-,-,- | solo orari (esami in Esse3) |
| Architettura per Comunità, Territori e Ambiente | CollegiodiArchitettura | 1:`DB8` 2:`DB8` | 1,2 | 7,8 | -,- | solo orari (esami in Esse3) |
| Autonomous Vehicle Engineering | Ingegneria-SanGiovanni | 1:`SG_D18` 2:`SG_D18` | 1,2 | 9,8 | -,- | solo orari (esami in Esse3) |
| Biologia | CollegiodiScienze | 1:`D52` 2:`D52` | 1,2 | 1,1 | -,- | solo orari (esami in Esse3) |
| Biologia Lt | CollegiodiScienze | 1:`D50` 2:`D50` 3:`P30` | 1,2,3 | 1,1,1 | -,-,- | solo orari (esami in Esse3) |
| Biotecnologie Molecolari e Industriali (magistrale) | CollegiodiScienze | 1:`D76` 2:`D76` | 1,2 | 1,1 | -,- | solo orari (esami in Esse3) |
| Biotecnologie Molecolari e Industriali (magistrale) (DG5) | CollegiodiScienze | 1:`DG5` | 1 | 1 | - | solo orari (esami in Esse3) |
| Chimica | CollegiodiScienze | 1:`D74` 2:`D74` 3:`D44` | 1,2,3 | 1,1,1 | -,-,- | solo orari (esami in Esse3) |
| Chimica Industriale | CollegiodiScienze | 1:`DG6` | 1 | 2 | - | solo orari (esami in Esse3) |
| Civil and Environmental Engineering | Ingegneria-Fuorigrotta | 1:`D38` 2:`D38` | 1,2 | 5,11 | -,- | solo orari (esami in Esse3) |
| Comunicazione Pubblica, Sociale e Politica | DipartimentodiScienzeSociali | 1:`D84` 2:`D84` | 1,2 | 12,15 | -,- | solo orari (esami in Esse3) |
| Corso di Laurea in Biotecnologie Biomolecolari e Industriali | CollegiodiScienze | 3:`N75` | 3 | 1 | - | solo orari (esami in Esse3) |
| Corso di Laurea in Chimica Industriale | CollegiodiScienze | 3:`N84` | 3 | 1 | - | solo orari (esami in Esse3) |
| Corso di Laurea in Ingegneria Chimica (triennale) | Ingegneria-Fuorigrotta | 3:`N37` | 3 | 11 | - | solo orari (esami in Esse3) |
| Corso di Laurea in Ingegneria Chimica (triennale) (SG_N37) | Ingegneria-SanGiovanni | 3:`SG_N37` | 3 | 11 | - | solo orari (esami in Esse3) |
| Corso di Laurea in Ingegneria Dell'automazione | Ingegneria-Fuorigrotta | 3:`N39` | 3 | 9 | - | solo orari (esami in Esse3) |
| Corso di Laurea in Ingegneria Elettrica | Ingegneria-Fuorigrotta | 3:`N42` | 3 | 10 | - | solo orari (esami in Esse3) |
| Culture Digitali e della Comunicazione | DipartimentodiScienzeSociali | 1:`D83` 2:`D83` 3:`D27` | 1,2,3 | 16,22,14 | -,-,- | solo orari (esami in Esse3) |
| Data Science | Ingegneria-Fuorigrotta | 1:`D03` 2:`D03` | 1,2 | 10,14 | -,- | solo orari (esami in Esse3) |
| Design for the Built Environment | CollegiodiArchitettura | 1:`DB1` | 1 | 12 | - | solo orari (esami in Esse3) |
| Design per la Comunita' | CollegiodiArchitettura | 1:`DB0` 2:`DB0` 3:`P42` | 1,2,3 | 16,10,12 | -,-,- | solo orari (esami in Esse3) |
| Digital Society, Social Innovation and Global Citizenship | DipartimentodiScienzeSociali | 1:`DA2` | 1 | 1 | - | solo orari (esami in Esse3) |
| Fisica Lt | CollegiodiScienze | 1:`DC6` 2:`DC6` 3:`N85` | 1,2,3 | 1,1,1 | -,-,- | solo orari (esami in Esse3) |
| Industrial Bioengineering | Ingegneria-Fuorigrotta | 1:`DD3` | 1 | 8 | - | solo orari (esami in Esse3) |
| Industrial Chemistry for Circular and Bio Economy | CollegiodiScienze | 1:`DG8` | 1 | 1 | - | solo orari (esami in Esse3) |
| Informatica (magistrale) | Ingegneria-Fuorigrotta | 1:`DE5` 2:`DE5` | 1,2 | 26,12 | -,- | solo orari (esami in Esse3) |
| Informatica (triennale) | Ingegneria-Fuorigrotta | 3:`N86` | 3 | 9 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria Aerospaziale (magistrale) | Ingegneria-Fuorigrotta | 1:`DF5` 2:`DF5` | 1,2 | 36,20 | -,- | solo orari (esami in Esse3) |
| Ingegneria Aerospaziale (triennale) | Ingegneria-SanGiovanni | 1:`SG_DF0` 2:`SG_DF0` 3:`SG_N35` | 1,2,3 | 21,11,8 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria Aerospaziale (triennale) (DF0) | Ingegneria-Fuorigrotta | 1:`DF0` 2:`DF0` 3:`N35` | 1,2,3 | 27,22,11 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria Biomedica (triennale) | Ingegneria-SanGiovanni | 1:`SG_D92` 2:`SG_D92` 3:`SG_P46` | 1,2,3 | 8,10,28 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria Biomedica (magistrale) | Ingegneria-Fuorigrotta | 1:`D92` 2:`D97` | 1,2 | 16,50 | -,- | solo orari (esami in Esse3) |
| Ingegneria Biomedica (triennale) (D97) | Ingegneria-Fuorigrotta | 1:`D97` 2:`D92` 3:`P46` | 1,2,3 | 20,20,29 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria Chimica (magistrale) | Ingegneria-SanGiovanni | 1:`SG_DD1` | 1 | 7 | - | solo orari (esami in Esse3) |
| Ingegneria Chimica (magistrale) (DD1) | Ingegneria-Fuorigrotta | 1:`DD1` | 1 | 14 | - | solo orari (esami in Esse3) |
| Ingegneria Chimica (magistrale) (DD4) | Ingegneria-Fuorigrotta | 1:`DD4` | 1 | 34 | - | solo orari (esami in Esse3) |
| Ingegneria Civile | Ingegneria-SanGiovanni | 1:`SG_D62` 2:`SG_D62` 3:`SG_D12` | 1,2,3 | 9,12,8 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria Civile D12 | Ingegneria-Fuorigrotta | 3:`D12` | 3 | 9 | - | solo orari (esami in Esse3) |
| Ingegneria Civile D62 | Ingegneria-Fuorigrotta | 1:`D62` | 1 | 9 | - | solo orari (esami in Esse3) |
| Ingegneria Civile per L'idraulica e i Trasporti Dd6 | Ingegneria-Fuorigrotta | 1:`DD6` | 1 | 58 | - | solo orari (esami in Esse3) |
| Ingegneria dei Materiali | Ingegneria-Fuorigrotta | 1:`D11` 2:`D11` | 1,2 | 21,22 | -,- | solo orari (esami in Esse3) |
| Ingegneria dei Materiali e Biomateriali (magistrale) | Ingegneria-SanGiovanni | 1:`SG_DD2` | 1 | 7 | - | solo orari (esami in Esse3) |
| Ingegneria dei Materiali e Biomateriali (magistrale) (DD2) | Ingegneria-Fuorigrotta | 1:`DD2` | 1 | 14 | - | solo orari (esami in Esse3) |
| Ingegneria Dell'automazione e Robotica (magistrale) | Ingegneria-Fuorigrotta | 1:`DE6` 2:`DE6` | 1,2 | 9,14 | -,- | solo orari (esami in Esse3) |
| Ingegneria Dell'automazione e Robotica (magistrale) (SG_DE2) | Ingegneria-SanGiovanni | 1:`SG_DE2` | 1 | 16 | - | solo orari (esami in Esse3) |
| Ingegneria Dell'automazione e Robotica (magistrale) (DE2) | Ingegneria-Fuorigrotta | 1:`DE2` | 1 | 24 | - | solo orari (esami in Esse3) |
| Ingegneria delle Telecomunicazioni e dei Media Digitali (magistrale) | Ingegneria-Fuorigrotta | 1:`D65` 2:`DE7` | 1,2 | 8,23 | -,- | solo orari (esami in Esse3) |
| Ingegneria delle Telecomunicazioni e dei Media Digitali (triennale) | Ingegneria-SanGiovanni | 1:`SG_D65` 2:`SG_D65` 3:`P39` | 1,2,3 | 8,8,10 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria delle Telecomunicazioni e dei Media Digitali (magistrale) (DE7) | Ingegneria-Fuorigrotta | 1:`DE7` 2:`DE7` | 1,2 | 9,23 | -,- | solo orari (esami in Esse3) |
| Ingegneria Edile (triennale) | Ingegneria-Fuorigrotta | 3:`N41` | 3 | 11 | - | solo orari (esami in Esse3) |
| Ingegneria Edile (triennale) (SG_N41) | Ingegneria-SanGiovanni | 3:`SG_N41` | 3 | 6 | - | solo orari (esami in Esse3) |
| Ingegneria Edile per la Sostenibilità (magistrale) | Ingegneria-SanGiovanni | 1:`SG_DD5` | 1 | 15 | - | solo orari (esami in Esse3) |
| Ingegneria Edile per la Sostenibilità (magistrale) (DD5) | Ingegneria-Fuorigrotta | 1:`DD5` | 1 | 17 | - | solo orari (esami in Esse3) |
| Ingegneria Edile per la Sostenibilità (magistrale) (DD8) | Ingegneria-Fuorigrotta | 1:`DD8` | 1 | 34 | - | solo orari (esami in Esse3) |
| Ingegneria Edile-architettura De0 | Ingegneria-Fuorigrotta | 1:`DE0` | 1 | 7 | - | solo orari (esami in Esse3) |
| Ingegneria Edile-architettura P71 | Ingegneria-Fuorigrotta | 3:`P71` 4:`P71` | 3,4 | 10,14 | -,- | solo orari (esami in Esse3) |
| Ingegneria Elettrica (magistrale) | Ingegneria-Fuorigrotta | 1:`D15` 2:`D15` | 1,2 | 17,25 | -,- | solo orari (esami in Esse3) |
| Ingegneria Elettrica (magistrale) (SG_DE4) | Ingegneria-SanGiovanni | 1:`SG_DE4` | 1 | 8 | - | solo orari (esami in Esse3) |
| Ingegneria Elettrica (magistrale) (DE4) | Ingegneria-Fuorigrotta | 1:`DE4` | 1 | 10 | - | solo orari (esami in Esse3) |
| Ingegneria Elettronica (triennale) | Ingegneria-SanGiovanni | 1:`SG_D66` 2:`SG_D66` 3:`N43` | 1,2,3 | 8,8,11 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria Elettronica (triennale) (D66) | Ingegneria-Fuorigrotta | 1:`D66` 2:`D66` 3:`SG_N43` | 1,2,3 | 8,8,11 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria Elettronica (magistrale) | Ingegneria-Fuorigrotta | 1:`DE8` 2:`DE8` | 1,2 | 20,38 | -,- | solo orari (esami in Esse3) |
| Ingegneria Gestionale (magistrale) | Ingegneria-Fuorigrotta | 1:`DF6` 2:`DF6` | 1,2 | 16,24 | -,- | solo orari (esami in Esse3) |
| Ingegneria Gestionale (triennale) | Ingegneria-SanGiovanni | 1:`SG_DF1` 2:`SG_DF1` 3:`SG_D16` | 1,2,3 | 14,8,11 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria Gestionale (triennale) (DF1) | Ingegneria-Fuorigrotta | 1:`DF1` 2:`DF1` 3:`D16` | 1,2,3 | 28,16,18 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria Gestionale delle Costruzioni | Ingegneria-SanGiovanni | 1:`SG_D63` 2:`SG_D63` | 1,2 | 8,11 | -,- | solo orari (esami in Esse3) |
| Ingegneria Gestionale delle Costruzioni D13 | Ingegneria-Fuorigrotta | 3:`D13` | 3 | 17 | - | solo orari (esami in Esse3) |
| Ingegneria Gestionale delle Costruzioni D63 | Ingegneria-Fuorigrotta | 1:`D63` | 1 | 8 | - | solo orari (esami in Esse3) |
| Ingegneria Informatica (magistrale) | Ingegneria-Fuorigrotta | 1:`DE9` 2:`DE9` | 1,2 | 20,20 | -,- | solo orari (esami in Esse3) |
| Ingegneria Informatica (triennale) | Ingegneria-SanGiovanni | 1:`SG_DE3` 2:`SG_DE3` 3:`SG_N46` | 1,2,3 | 16,7,9 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria Informatica (triennale) (DE3) | Ingegneria-Fuorigrotta | 1:`DE3` 2:`DE3` 3:`N46` | 1,2,3 | 24,14,24 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria Meccanica (triennale) | Ingegneria-SanGiovanni | 1:`SG_DF2` 2:`SG_DF2` 3:`SG_P72` | 1,2,3 | 21,9,12 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria Meccanica (triennale) (DF2) | Ingegneria-Fuorigrotta | 1:`DF2` 2:`DF2` 3:`P72` | 1,2,3 | 27,18,22 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria Meccanica per L'energia e L'ambiente | Ingegneria-Fuorigrotta | 1:`D20` 2:`D20` | 1,2 | 58,51 | -,- | solo orari (esami in Esse3) |
| Ingegneria Meccanica per la Progettazione e la Produzione | Ingegneria-Fuorigrotta | 1:`D19` 2:`D19` | 1,2 | 82,61 | -,- | solo orari (esami in Esse3) |
| Ingegneria Navale (triennale) | Ingegneria-Fuorigrotta | 1:`DF3` 2:`DF4` 3:`D17` | 1,2,3 | 7,3,10 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria Navale (magistrale) | Ingegneria-SanGiovanni | 1:`SG_DF3` | 1 | 7 | - | solo orari (esami in Esse3) |
| Ingegneria Navale (magistrale) (D21) | Ingegneria-Fuorigrotta | 1:`D21` 2:`D21` | 1,2 | 16,19 | -,- | solo orari (esami in Esse3) |
| Ingegneria per L'ambiente e il Territorio | Ingegneria-SanGiovanni | 1:`SG_D64` 2:`SG_D64` 3:`SG_P70` | 1,2,3 | 8,12,10 | -,-,- | solo orari (esami in Esse3) |
| Ingegneria per L'ambiente e il Territorio D64 | Ingegneria-Fuorigrotta | 1:`D64` | 1 | 8 | - | solo orari (esami in Esse3) |
| Ingegneria per L'ambiente e il Territorio Dd9 | Ingegneria-Fuorigrotta | 1:`DD9` | 1 | 46 | - | solo orari (esami in Esse3) |
| Ingegneria per L'ambiente e il Territorio P70 | Ingegneria-Fuorigrotta | 3:`P70` | 3 | 13 | - | solo orari (esami in Esse3) |
| Ingegneria Strutturale e Geotecnica D86 | Ingegneria-Fuorigrotta | 1:`D86` | 1 | 30 | - | solo orari (esami in Esse3) |
| Innovazione Sociale | DipartimentodiScienzeSociali | 1:`DL5` 2:`DL5` | 1,2 | 10,8 | -,- | solo orari (esami in Esse3) |
| Marine Biology and Aquaculture | CollegiodiScienze | 2:`D54` | 2 | 1 | - | solo orari (esami in Esse3) |
| Matematica | CollegiodiScienze | 1:`D70` 2:`DF7` | 1,2 | 1,1 | -,- | solo orari (esami in Esse3) |
| Matematica Lt | CollegiodiScienze | 1:`DF7` 3:`N87` | 1,3 | 1,1 | -,- | solo orari (esami in Esse3) |
| Meccatronica | Ingegneria-SanGiovanni | 1:`SG_D36` 2:`SG_D36` 3:`SG_D36` | 1,2,3 | 8,6,19 | -,-,- | solo orari (esami in Esse3) |
| Ottica e Optometria | CollegiodiScienze | 1:`DC7` 2:`DC7` 3:`M44` | 1,2,3 | 1,1,1 | -,-,- | solo orari (esami in Esse3) |
| Pianificazione Territoriale, Urbanistica e Paesaggistico-ambientale | CollegiodiArchitettura | 1:`DB3` 2:`DB3` | 1,2 | 10,14 | -,- | solo orari (esami in Esse3) |
| Quantum Science and Engineering | CollegiodiScienze | 1:`D60` | 1 | 1 | - | solo orari (esami in Esse3) |
| Scienza e Ingegneria dei Materiali | Ingegneria-Fuorigrotta | 3:`N50` | 3 | 8 | - | solo orari (esami in Esse3) |
| Scienze Biologiche | CollegiodiScienze | 1:`D55` 2:`D55` | 1,2 | 1,1 | -,- | solo orari (esami in Esse3) |
| Scienze Chimiche | CollegiodiScienze | 1:`DG7` | 1 | 1 | - | solo orari (esami in Esse3) |
| Scienze Dell'architettura | CollegiodiArchitettura | 1:`DB6` 2:`DB6` 3:`D05` | 1,2,3 | 19,16,27 | -,-,- | solo orari (esami in Esse3) |
| Scienze e Tecnologie della Chimica Industriale | CollegiodiScienze | 1:`D75` 2:`D75` | 1,2 | 1,2 | -,- | solo orari (esami in Esse3) |
| Scienze Naturali | CollegiodiScienze | 1:`D56` 2:`D56` | 1,2 | 1,1 | -,- | solo orari (esami in Esse3) |
| Scienze per la Natura e per L'ambiente | CollegiodiScienze | 1:`D51` 2:`D51` 3:`P29` | 1,2,3 | 1,1,1 | -,-,- | solo orari (esami in Esse3) |
| Sociologia | DipartimentodiScienzeSociali | 1:`D98` 2:`D98` 3:`M13` | 1,2,3 | 18,11,21 | -,-,- | solo orari (esami in Esse3) |
| Sociologia Digitale e Analisi del Web | DipartimentodiScienzeSociali | 1:`D85` 2:`D85` | 1,2 | 10,14 | -,- | solo orari (esami in Esse3) |
| Sviluppo Sostenibile e Reti Territoriali | CollegiodiArchitettura | 3:`P40` | 3 | 8 | - | solo orari (esami in Esse3) |
| Tecnologie Digitali per le Costruzioni (triennale) | Ingegneria-Fuorigrotta | 3:`D35` | 3 | 1 | - | solo orari (esami in Esse3) |
| Tecnologie Digitali per le Costruzioni (triennale) (SG_D35) | Ingegneria-SanGiovanni | 1:`SG_D35` 2:`SG_D35` 3:`SG_D35` | 1,2,3 | 6,5,4 | -,-,- | solo orari (esami in Esse3) |
| Transportation Engineering and Mobility Dd7 | Ingegneria-Fuorigrotta | 1:`DD7` | 1 | 9 | - | solo orari (esami in Esse3) |
| Urbanistica Sostenibile | CollegiodiArchitettura | 1:`DA9` | 1 | 7 | - | solo orari (esami in Esse3) |

Nota appelli: numero senza parentesi = appelli nella finestra 2026/27; tra parentesi = solo nella finestra 2025/26 (calendario nuovo non ancora pubblicato).

### Codici ricatturati (84 anni)

| Corso | Anno | corso prima → dopo | anno2 prima → dopo |
|---|---|---|---|
| Architecture and Heritage | 2 | `P53` → `DB2` | `GEN\|2` → `GEN\|2` |
| Architettura | 2 | `D06` → `DB7` | `GEN\|2` → `GEN\|2` |
| Architettura | 4 | `N14` → `D06` | `GEN\|4` → `GEN\|4` |
| Architettura per Comunità, Territori e Ambiente | 2 | `D07` → `DB8` | `GEN\|2` → `GEN\|2` |
| Biologia | 2 | `P58` → `D52` | `BCC\|2, BDR\|2, BNU\|2, BFO\|2, BMC\|2` → `BCC\|2, BDR\|2, BNU\|2, BFO\|2, BMC\|2` |
| Biologia Lt | 1 | `D50` → `D50` | `GEN_MSA1_CFGUZTVW\|1, GEN_MSA2_BDEINPOQX\|1, GEN_MSA3_AHKLMRSJY\|1` → `GEN\|1` |
| Biologia Lt | 2 | `P30` → `D50` | `GEN_MSA1_CFGUZTVW\|2, GEN_MSA2_BDEINPOQX\|2, GEN_MSA3_AHKLMRSJY\|2` → `GEN\|2` |
| Biologia Lt | 3 | `P30` → `P30` | `GEN_Dispari\|3, GEN_Pari\|3` → `GEN\|3` |
| Biotecnologie Molecolari e Industriali (magistrale) | 2 | `N80` → `D76` | `BRR\|2, PRB\|2` → `BRR\|2, PRB\|2` |
| Chimica | 2 | `D44` → `D74` | `GEN\|2` → `GEN\|2` |
| Chimica | 3 | `N83` → `D44` | `GEN\|3` → `GEN\|3` |
| Comunicazione Pubblica, Sociale e Politica | 2 | `D48` → `D84` | `GEN\|2` → `GEN\|2` |
| Culture Digitali e della Comunicazione | 2 | `D27` → `D83` | `GEN_CS\|2, GEN_SG\|2` → `GEN_CS\|2, GEN_SG\|2` |
| Data Science | 2 | `D03` → `D03` | `GEN_DS\|2` → `DAM\|2, FSC\|2, ITE\|2, ISY\|2` |
| Design per la Comunita' | 2 | `P42` → `DB0` | `GEN\|2` → `GEN\|2` |
| Fisica Lt | 1 | `DC6` → `DC6` | `GEN_A-G\|1, GEN_H-Z\|1` → `GEN\|1` |
| Fisica Lt | 2 | `N85` → `DC6` | `GEN_A-G\|2, GEN_H-Z\|2` → `GEN\|2` |
| Fisica Lt | 3 | `N85` → `N85` | `GEN_A-G\|3, GEN_H-Z\|3` → `GEN\|3` |
| Informatica (magistrale) | 2 | `N97` → `DE5` | `GEN\|2` → `GEN\|2` |
| Informatica (triennale) | 3 | `N86` → `N86` (scuola Ingegneria-Fuorigrotta) | `GEN\|3, GEN_FGA-G\|3, GEN_FGH-Z\|3, MSA_H-Z\|3` → `GEN_A-G\|3, GEN_H-Z\|3` |
| Ingegneria Aerospaziale (magistrale) | 2 | `M53` → `DF5` | `GEN\|2` → `GEN\|2` |
| Ingegneria Aerospaziale (triennale) | 1 | `SG_DF0` → `SG_DF0` | `GEN_SG1A-DIL\|1, GEN_SG2DIM-NES\|1, GEN_SG3NET-Z\|1` → `GEN_A-DIL\|1, GEN_DIM-NES\|1, GEN_NET-Z\|1` |
| Ingegneria Aerospaziale (triennale) | 2 | `SG_N35` → `SG_DF0` | `GEN\|2` → `GEN\|2` |
| Ingegneria Aerospaziale (triennale) (DF0) | 1 | `DF0` → `DF0` | `GEN_FG1A-DAO\|1, GEN_FG2DAP-IER\|1, GEN_FG3IES-PIS\|1, GEN_FG4PIT-Z\|1` → `GEN_A-DAO\|1, GEN_DAP-IER\|1, GEN_IES-PIS\|1, GEN_PIT-Z\|1` |
| Ingegneria Aerospaziale (triennale) (DF0) | 2 | `N35` → `DF0` | `GEN_FG1A-I\|2, GEN_FG2J-Z\|2` → `GEN_A-I\|2, GEN_J-Z\|2` |
| Ingegneria Biomedica (triennale) | 2 | `SG_P46` → `SG_D92` | `GEN_SG1A-FIL\|2, GEN_SG2FIM-Z\|2` → `GEN\|2` |
| Ingegneria Biomedica (triennale) | 3 | `SG_P46` → `SG_P46` | `GEN\|3, GEN_SF_L8\|3, GEN_SF_L9\|3` → `GEN\|3, GEN_SG_L8_1\|3, GEN_SG_L8_2\|3, GEN_SG_L9\|3` |
| Ingegneria Biomedica (magistrale) | 1 | `D92` → `D92` | `GEN_FG1 A-DOT\|1, GEN_FG2 DOU-Z\|1` → `GEN_A-DOT\|1, GEN_DOU-Z\|1` |
| Ingegneria Biomedica (magistrale) | 2 | `M54` → `D97` | `GEN\|2, BIOROB_BIONICA\|2, ING_CLINICA\|2, SALUTE_DIG\|2, DISP_MEDICI\|2, ING_NEUROSCIENZE\|2` → `GEN\|2, BIOROB_BIONICA\|2, ING_CLINICA\|2, SALUTE_DIG\|2, DISP_MEDICI\|2, ING_NEUROSCIENZE\|2` |
| Ingegneria Biomedica (triennale) (D97) | 2 | `P46` → `D92` | `GEN\|2, GEN_FG1_A_ESP\|2, GEN_FG2_ESQ_I\|2, GEN_FG3_J_Z\|2` → `GEN_A-E\|2, GEN_F-Z\|2` |
| Ingegneria Biomedica (triennale) (D97) | 3 | `P46` → `P46` | `GEN\|3, GEN_FG1_L8\|3, GEN_FG1_L8 A-I\|3, GEN_FG1_L9\|3, GEN_FG2_L8_J-Z\|3` → `GEN\|3, GEN_FG_L8_1\|3, GEN_FG_L8_2\|3, GEN_FG_L9\|3` |
| Ingegneria Chimica (magistrale) (DD1) | 1 | `DD1` → `DD1` | `GEN_FG1A-I\|1, GEN_FG2J-Z\|1` → `GEN_A-I\|1, GEN_J-Z\|1` |
| Ingegneria Civile | 2 | `SG_D12` → `SG_D62` | `GEN\|2` → `GEN\|2` |
| Ingegneria dei Materiali e Biomateriali (magistrale) (DD2) | 1 | `DD2` → `DD2` | `GEN_FG1A-I\|1, GEN_FG2J-Z\|1` → `GEN_A-I\|1, GEN_J-Z\|1` |
| Ingegneria Dell'automazione e Robotica (magistrale) | 2 | `P38` → `DE6` | `ADCONTR\|2, ADROB\|2, GEN\|2` → `GEN\|2` |
| Ingegneria Dell'automazione e Robotica (magistrale) (SG_DE2) | 1 | `SG_DE2` → `SG_DE2` | `GEN_SG1A-I\|1, GEN_SG2J-Z\|1` → `GEN_A-I\|1, GEN_J-Z\|1` |
| Ingegneria Dell'automazione e Robotica (magistrale) (DE2) | 1 | `DE2` → `DE2` | `GEN_FG1A-DIL\|1, GEN_FG2DIM-NES\|1, GEN_FG3NET-Z\|1` → `GEN_A-DIL\|1, GEN_DIM-NES\|1, GEN_NET-Z\|1` |
| Ingegneria delle Telecomunicazioni e dei Media Digitali (magistrale) | 2 | `SG_P39` → `DE7` | `GEN\|2` → `COM_NET_5G\|2, GEN\|2, MULTIMEDIA\|2, SEF_SEC\|2` |
| Ingegneria delle Telecomunicazioni e dei Media Digitali (triennale) | 2 | `P39` → `SG_D65` | `GEN\|2` → `GEN\|2` |
| Ingegneria delle Telecomunicazioni e dei Media Digitali (magistrale) (DE7) | 2 | `P49` → `DE7` | `COM_NET_5G\|2, GEN\|2, MULTIMEDIA\|2, SEF_SEC\|2` → `COM_NET_5G\|2, GEN\|2, MULTIMEDIA\|2, SEF_SEC\|2` |
| Ingegneria Elettronica (triennale) | 2 | `N43` → `SG_D66` | `GEN\|2` → `GEN\|2` |
| Ingegneria Elettronica (triennale) (D66) | 2 | `SG_N43` → `D66` | `GEN\|2` → `GEN\|2` |
| Ingegneria Elettronica (magistrale) | 2 | `M61` → `DE8` | `GEN\|2, EP\|2, SD\|2, SO-RF\|2` → `GEN\|2, EP\|2, SD\|2, SO-RF\|2` |
| Ingegneria Gestionale (magistrale) | 1 | `DF6` → `DF6` | `GEN_FGA-I\|1, GEN_FGJ-Z\|1` → `GEN_A-I\|1, GEN_J-Z\|1` |
| Ingegneria Gestionale (magistrale) | 2 | `M62` → `DF6` | `GEN\|2` → `GEN\|2` |
| Ingegneria Gestionale (triennale) | 1 | `SG_DF1` → `SG_DF1` | `GEN_SG1A-I\|1, GEN_SG2J-Z\|1` → `GEN_A-I\|1, GEN_J-Z\|1` |
| Ingegneria Gestionale (triennale) | 2 | `SG_D16` → `SG_DF1` | `GEN\|2` → `GEN\|2` |
| Ingegneria Gestionale (triennale) (DF1) | 1 | `DF1` → `DF1` | `GEN_FG1A-DAO\|1, GEN_FG2DAP-IER\|1, GEN_FG3IES-PIS\|1, GEN_FG4PIT-Z\|1` → `GEN_A-DAO\|1, GEN_DAP-IER\|1, GEN_IES-PIS\|1, GEN_PIT-Z\|1` |
| Ingegneria Gestionale (triennale) (DF1) | 2 | `D16` → `DF1` | `GEN_FG1A-I\|2, GEN_FG2J-Z\|2` → `GEN_A-I\|2, GEN_J-Z\|2` |
| Ingegneria Gestionale (triennale) (DF1) | 3 | `D16` → `D16` | `GEN\|3, GEN_FG1A-I\|3, GEN_FG2J-Z\|3` → `GEN\|3, GEN_A-I\|3, GEN_J-Z\|3` |
| Ingegneria Gestionale delle Costruzioni | 2 | `SG_D13` → `SG_D63` | `GEN\|2` → `GEN\|2` |
| Ingegneria Informatica (magistrale) | 2 | `M63` → `DE9` | `GEN\|2` → `GEN\|2` |
| Ingegneria Informatica (triennale) | 1 | `SG_DE3` → `SG_DE3` | `GEN_SG1 A-I\|1, GEN_SG2 J-Z\|1` → `GEN_A-I\|1, GEN_J-Z\|1` |
| Ingegneria Informatica (triennale) | 2 | `SG_N46` → `SG_DE3` | `GEN_SG1 A-FIL\|2, GEN_SG2 FIM-I\|2, GEN_SG3 J-Z\|2` → `GEN\|2` |
| Ingegneria Informatica (triennale) (DE3) | 1 | `DE3` → `DE3` | `GEN_FG1A-DIL\|1, GEN_FG2DIM-NES\|1, GEN_FG3NET-Z\|1` → `GEN_A-DIL\|1, GEN_DIM-NES\|1, GEN_NET-Z\|1` |
| Ingegneria Informatica (triennale) (DE3) | 2 | `N46` → `DE3` | `GEN_FG1A-BUL\|2, GEN_FG2BUM-DOT\|2, GEN_FG3DOU-MAM\|2, GEN_FG4MAN-RIC\|2, GEN_FG5RID-Z\|2, 2SEM_FG1_A-DIP\|2, 2SEM_FG2_DIQ-I\|2, 2SEM_FG4_NIT-Z\|2, 2SEM_FG3_J-NIS\|2` → `GEN_A-I\|2, GEN_J-Z\|2` |
| Ingegneria Informatica (triennale) (DE3) | 3 | `N46` → `N46` | `GEN_FG1A-I\|3, GEN_FG2J-Z\|3` → `GEN_A-I\|3, GEN_J-Z\|3` |
| Ingegneria Meccanica (triennale) | 1 | `SG_DF2` → `SG_DF2` | `GEN_SG1A-DIL\|1, GEN_SG2DIM-NES\|1, GEN_SG3NET-Z\|1` → `GEN_A-DIL\|1, GEN_DIM-NES\|1, GEN_NET-Z\|1` |
| Ingegneria Meccanica (triennale) | 2 | `SG_P72` → `SG_DF2` | `GEN\|2` → `GEN\|2` |
| Ingegneria Meccanica (triennale) (DF2) | 1 | `DF2` → `DF2` | `GEN_FG1A-DAO\|1, GEN_FG2DAP-IER\|1, GEN_FG3IES-PIS\|1, GEN_FG4PIT-Z\|1` → `GEN_A-DAO\|1, GEN_DAP-IER\|1, GEN_IES-PIS\|1, GEN_PIT-Z\|1` |
| Ingegneria Meccanica (triennale) (DF2) | 2 | `P72` → `DF2` | `GEN_FG1A-I\|2, GEN_FG2J-Z\|2` → `GEN_A-I\|2, GEN_J-Z\|2` |
| Ingegneria Meccanica (triennale) (DF2) | 3 | `P72` → `P72` | `GEN_FG1A-I\|3, GEN_FG2J-Z\|3` → `GEN_A-I\|3, GEN_J-Z\|3` |
| Ingegneria Meccanica per L'energia e L'ambiente | 1 | `D20` → `D20` | `GEN_FGA-I\|1, GEN_FGJ-Z\|1` → `GEN_A-I\|1, GEN_J-Z\|1` |
| Ingegneria Navale (triennale) | 2 | `D17` → `DF4` | `GEN\|2` → `GEN\|2` |
| Ingegneria per L'ambiente e il Territorio | 2 | `SG_P70` → `SG_D64` | `GEN\|2` → `GEN\|2` |
| Innovazione Sociale | 2 | `P45` → `DL5` | `GEN\|2` → `GEN\|2` |
| Marine Biology and Aquaculture | 2 | `P59` → `D54` | `AGM\|2, CMB\|2` → `AGM\|2, CMB\|2` |
| Matematica | 2 | `P62` → `DF7` | `MAP\|2, DID\|2, MGE\|2` → `GEN\|2` |
| Matematica Lt | 1 | `DF7` → `DF7` | `GEN_A-I\|1, GEN_J-Z\|1` → `GEN\|1` |
| Ottica e Optometria | 2 | `M44` → `DC7` | `GEN\|2` → `GEN\|2` |
| Pianificazione Territoriale, Urbanistica e Paesaggistico-ambientale | 2 | `N20` → `DB3` | `GEN\|2` → `PNA\|2, PUA\|2` |
| Quantum Science and Engineering | 1 | `P65` → `D60` | `GEN\|1` → `GEN\|1` |
| Scienze Biologiche | 1 | `D55` → `D55` | `BDN\|1, BIA\|1` → `BIA\|1, BDB\|1, BQS\|1, NEU\|1` |
| Scienze Biologiche | 2 | `N99` → `D55` | `BDN\|2, BIA\|2, BSC\|2, NEU\|2` → `BDN\|2, BIA\|2, BSC\|2, NEU\|2` |
| Scienze Dell'architettura | 2 | `D05` → `DB6` | `GEN\|2` → `GEN\|2` |
| Scienze e Tecnologie della Chimica Industriale | 2 | `M04` → `D75` | `FIN\|2, PPT\|2, SCP\|2` → `FIN\|2, PPT\|2, SCP\|2` |
| Scienze Naturali | 2 | `M05` → `D56` | `CGC\|2, GPN\|2` → `CGC\|2, GPN\|2` |
| Scienze per la Natura e per L'ambiente | 1 | `D51` → `D51` | `A-L\|1, M-Z\|1` → `GEA\|1, MDB\|1` |
| Scienze per la Natura e per L'ambiente | 2 | `P29` → `D51` | `GEA\|2, MDB\|2` → `GEA\|2, MDB\|2` |
| Scienze per la Natura e per L'ambiente | 3 | `P29` → `P29` | `GEA\|3, CSN\|3` → `GEA\|3, MDB\|3` |
| Sociologia | 2 | `M13` → `D98` | `GEN\|2` → `GEN\|2` |
| Sociologia Digitale e Analisi del Web | 2 | `D49` → `D85` | `GEN\|2` → `GEN\|2` |

### Anni rimossi da livePrograms (27; 8 programmi interi)

Restano disponibili in modalità manuale. Codici originali (scuola + corso + anno2) conservati per un eventuale ripristino quando gli orari 2026/27 verranno pubblicati.

| Corso | scuola | Anno | corso originale | anno2 originale | Motivo |
|---|---|---|---|---|---|
| Informatica (triennale) | CollegiodiScienze | 1 | `DE1` | `GEN|1` | 0 celle in tutte le settimane 28-09..30-11-2026 (10 POST); 1 sola cella il 07-12-2026, 0 il 01 e 08-03-2027 → orari non ancora pubblicati |
| Informatica (triennale) | CollegiodiScienze | 2 | `DE1` | `GEN|2` | idem anno 1 |
| Bioingegneria Industriale (intero) | Ingegneria-Fuorigrotta | 2 | `P16` | `GEN\|2` | corso assente dal combo 2026 |
| Corso di Laurea in Biotecnologie Biomolecolari e Industriali | CollegiodiScienze | 2 | `N75` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Corso di Laurea in Chimica Industriale | CollegiodiScienze | 2 | `N84` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Corso di Laurea in Ingegneria Chimica (triennale) | Ingegneria-Fuorigrotta | 2 | `N37` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Corso di Laurea in Ingegneria Chimica (triennale) (SG_N37) | Ingegneria-SanGiovanni | 2 | `SG_N37` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Corso di Laurea in Ingegneria Dell'automazione | Ingegneria-Fuorigrotta | 2 | `N39` | `GEN_FG1A-BUL\|2, GEN_FG2BUM-DOT\|2, GEN_FG3DOU-MAM\|2, GEN_FG4MAN-RIC\|2, GEN_FG5RID-Z\|2, 2SEM_FG1 - A-DIP\|2, 2SEM_FG2 - DIQ-I\|2, 2SEM_FG3 - J-NIS\|2, 2SEM_FG4 - NIT-Z\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Corso di Laurea in Ingegneria Elettrica | Ingegneria-Fuorigrotta | 2 | `N42` | `ENR\|2, EVS\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Corso di Laurea Magistrale in Ingegneria Edile-architettura (intero) | Ingegneria-Fuorigrotta | 5 | `N52` | `GEN\|5` | corso assente dal combo 2026 |
| Design per L'ambiente Costruito (intero) | CollegiodiArchitettura | 2 | `P10` | `CDD\|2, CED\|2` | corso assente dal combo 2026 |
| Ingegneria Chimica (magistrale) | Ingegneria-SanGiovanni | 2 | `M55` | `PRO\|2, CPE\|2, CSE\|2` | orari non pubblicati con il codice originale; unico candidato (stessa etichetta) è in un'altra scuola/campus, non attribuibile con certezza |
| Ingegneria Civile D12 | Ingegneria-Fuorigrotta | 2 | `D12` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Ingegneria Civile per L'idraulica e i Trasporti D14 (intero) | Ingegneria-Fuorigrotta | 2 | `D14` | `GEN\|2` | corso assente dal combo 2026 |
| Ingegneria Edile (magistrale) (intero) | Ingegneria-Fuorigrotta | 2 | `N51` | `GEN\|2` | corso assente dal combo 2026 |
| Ingegneria Edile (triennale) | Ingegneria-Fuorigrotta | 2 | `N41` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Ingegneria Edile (triennale) (SG_N41) | Ingegneria-SanGiovanni | 2 | `SG_N41` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Ingegneria Edile-architettura P71 | Ingegneria-Fuorigrotta | 2 | `P71` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Ingegneria Gestionale delle Costruzioni D13 | Ingegneria-Fuorigrotta | 2 | `D13` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Ingegneria per L'ambiente e il Territorio M67 (intero) | Ingegneria-Fuorigrotta | 2 | `M67` | `DIG\|2, ENA\|2, AMB\|2` | corso assente dal combo 2026 |
| Ingegneria per L'ambiente e il Territorio P70 | Ingegneria-Fuorigrotta | 2 | `P70` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Ingegneria Strutturale e Geotecnica D28 (intero) | Ingegneria-Fuorigrotta | 2 | `D28` | `GEN\|2` | corso assente dal combo 2026 |
| Matematica Lt | CollegiodiScienze | 2 | `N87` | `GEN_A-I\|2, GEN_J-Z\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Quantum Science and Engineering | CollegiodiScienze | 2 | `P65` | `GEN\|2` | corso rinumerato ma nessun candidato verifica |
| Scienza e Ingegneria dei Materiali | Ingegneria-Fuorigrotta | 2 | `N50` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Sviluppo Sostenibile e Reti Territoriali | CollegiodiArchitettura | 2 | `P40` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Tecnologie Digitali per le Costruzioni (triennale) | Ingegneria-Fuorigrotta | 1 | `D35` | `GEN\|1` | orari non pubblicati con il codice originale; unico candidato (stessa etichetta) è in un'altra scuola/campus, non attribuibile con certezza |
| Tecnologie Digitali per le Costruzioni (triennale) | Ingegneria-Fuorigrotta | 2 | `D35` | `GEN\|2` | orari non pubblicati con il codice originale; unico candidato (stessa etichetta) è in un'altra scuola/campus, non attribuibile con certezza |
| Transportation Engineering and Mobility D42 (intero) | Ingegneria-Fuorigrotta | 2 | `D42` | `GEN\|2` | corso assente dal combo 2026 |

## (senza scuola)

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Archeologia del Mediterraneo | `DL6` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Archeologia e Storia Dell'arte | `N70` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Archeologia, Storia delle Arti e Scienze del Patrimonio Culturale | `P14` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Archeologia, Storia delle Arti e Scienze del Patrimonio Culturale | `D99` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Biologia | `P30_CS` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Biologia | `D50_CS` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Coordinamento dei Servizi Educativi per la Prima Infanzia e per il Disagio Sociale | `P56` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Coordinamento dei Servizi Educativi per la Prima Infanzia e per il Disagio Sociale | `DL7` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Discipline della Musica e dello Spettacolo. Storia e Teoria | `P15` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Discipline della Musica e dello Spettacolo. Storia e Teoria | `D95` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Economia Aziendale | `N27` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Economia Aziendale | `N22` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Economia Aziendale | `DB4` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Economia Aziendale | `DB9` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Economia delle Imprese Finanziarie | `N23` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Economia delle Imprese Finanziarie | `DH3` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Economia e Commercio | `N24` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Economia e Commercio | `D46` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Economia e Commercio | `DH4` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Economia e Commercio | `D78` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Economia e Finanza | `DH5` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Economics and Finance | `P09` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Filologia Moderna | `D30` | 1,2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Filologia, Letterature e Civilta' del Mondo Antico | `N56` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Filologia, Letterature e Civilta' del Mondo Antico | `D93` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Filosofia | `D32` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Filosofia | `D29` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Filosofia | `D91` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Filosofia | `D96` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Finanza | `D45` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Finanza | `D77` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Geoscienze per L'ambiente, le Risorse e i Rischi Naturali | `P73` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Geoscienze per L'ambiente, le Risorse e i Rischi Naturali | `DH0` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Gestione delle Politiche e dei Servizi Sociali | `P48` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Gestione delle Politiche e dei Servizi Sociali | `DL4` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Giurisprudenza | `991` | 2,3,4,5 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Giurisprudenza | `DC9` | 1,2,4,5 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Hospitality Management | `P31` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Hospitality Management | `DB5` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Innovation and International Management | `P32` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Innovation and International Management | `DC0` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| International Relations | `D26` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| International Relations | `DL0` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Lettere Classiche | `N59` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Lettere Classiche | `D87` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Lettere Moderne | `N60` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Lettere Moderne | `D88` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Lingue e Letterature per il Plurilinguismo Europeo | `P60` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Lingue e Letterature per il Plurilinguismo Europeo | `DA0` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Lingue, Culture e Letterature Moderne Europee | `N62` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Lingue, Culture e Letterature Moderne Europee | `D89` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Management del Patrimonio Culturale | `P18` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Management del Patrimonio Culturale | `DL8` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Patrimonio Culturale, Storia delle Arti e Museologia | `DA3` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Psicologia Clinica e degli Interventi Nei Contesti Sociali e dello Sviluppo | `D31` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Psicologia Clinica e degli Interventi Nei Contesti Sociali e dello Sviluppo | `D94` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Relazioni Internazionali ed Analisi di Scenario | `M97` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Relazioni Internazionali, Studi Sull'integrazione Europea e per la Sostenibilità | `DL1` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze Criminologiche, Investigative e di Contrasto Ai Crimini Informatici | `D04` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze Criminologiche, Investigative e di Contrasto Ai Crimini Informatici | `DL2` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze dei Servizi Giuridici | `P47` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze dei Servizi Giuridici | `DC8` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze del Servizio Sociale | `DH9` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze del Turismo Ad Indirizzo Manageriale | `N25` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze del Turismo Ad Indirizzo Manageriale | `DH2` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze Dell'amministrazione e Dell'organizzazione | `M96` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze Dell'amministrazione e Dell'organizzazione | `DH7` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze della Pubblica Amministrazione e del Lavoro | `P74` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze della Pubblica Amministrazione e del Lavoro | `DL3` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze e Tecniche Psicologiche | `D90` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze e Tecniche Psicologiche | `D33` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze Geologiche | `N90` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze Geologiche | `DG9` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze Politiche | `M06` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze Politiche | `DH8` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze Statistiche per le Decisioni | `M10` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze Statistiche per le Decisioni | `D82` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze Storiche | `N68` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze Storiche | `DL9` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Servizio Sociale | `N67` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Statistica e Tecnologie per L'analisi dei Dati | `D47` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Statistica e Tecnologie per L'analisi dei Dati | `D80` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Statistica per L'impresa e la Societa' | `P28` | 3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Storia | `N69` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Storia | `D00` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Volcanology | `DH1` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |

## CollegiodiArchitettura

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Architecture and Heritage | `P53` | 2 | 8 | 0 | 🟢 live solo orari |
| Architecture and Heritage | `DB2` | 1 | 11 | 0 | 🟢 live solo orari |
| Architettura | `D06` | 2,3 | 53 | 0 | 🟢 live solo orari |
| Architettura | `N14` | 4,5 | 50 | 0 | 🟢 live solo orari |
| Architettura | `DB7` | 1 | 29 | 0 | 🟢 live solo orari |
| Architettura per Comunità, Territori e Ambiente | `D07` | 2 | 8 | 0 | 🟢 live solo orari |
| Architettura per Comunità, Territori e Ambiente | `DB8` | 1 | 7 | 0 | 🟢 live solo orari |
| Design for the Built Environment | `DB1` | 1 | 11 | 0 | 🟢 live solo orari |
| Design per L'ambiente Costruito | `P10` | 2 | 10 | 0 | 🟢 live solo orari |
| Design per la Comunita' | `P42` | 2,3 | 26 | 0 | 🟢 live solo orari |
| Design per la Comunita' | `DB0` | 1 | 14 | 0 | 🟢 live solo orari |
| Pianificazione Territoriale, Urbanistica e Paesaggistico-ambientale | `N20` | 2 | 8 | 0 | 🟢 live solo orari |
| Pianificazione Territoriale, Urbanistica e Paesaggistico-ambientale | `DB3` | 1 | 9 | 0 | 🟢 live solo orari |
| Scienze Dell'architettura | `D05` | 2,3 | 43 | 0 | 🟢 live solo orari |
| Scienze Dell'architettura | `DB6` | 1 | 18 | 0 | 🟢 live solo orari |
| Sviluppo Sostenibile e Reti Territoriali | `P40` | 2,3 | 18 | 0 | 🟢 live solo orari |
| Urbanistica Sostenibile | `DA9` | 1 | 8 | 0 | 🟢 live solo orari |

## CollegiodiScienze

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Biologia | `P58` | 2 | 22 | 0 | 🟢 live solo orari |
| Biologia | `D52` | 1 | 36 | 0 | 🟢 live solo orari |
| Biologia Lt | `P30` | 2,3 | 47 | 0 | 🟢 live solo orari |
| Biologia Lt | `D50` | 1 | 27 | 0 | 🟢 live solo orari |
| Biology for One-health | `DA1` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Biology of Extreme Environments | `P54` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Biology of Extreme Environments | `D53` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Biotecnologie Molecolari e Industriali | `N80` | 2 | 2 | 0 | 🟢 live solo orari |
| Biotecnologie Molecolari e Industriali | `D76` | 1 | 26 | 0 | 🟢 live solo orari |
| Biotecnologie Molecolari e Industriali | `DG5` | 1 | 9 | 0 | 🟢 live solo orari |
| Chimica | `D44` | 2 | 11 | 0 | 🟢 live solo orari |
| Chimica | `N83` | 3 | 10 | 0 | 🟢 live solo orari |
| Chimica | `D74` | 1 | 10 | 0 | 🟢 live solo orari |
| Chimica Industriale | `DG6` | 1 | 9 | 0 | 🟢 live solo orari |
| Corso di Laurea in Biotecnologie Biomolecolari e Industriali | `N75` | 2,3 | 19 | 0 | 🟢 live solo orari |
| Corso di Laurea in Chimica Industriale | `N84` | 2,3 | 21 | 0 | 🟢 live solo orari |
| Fisica | `D41` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Fisica | `D59` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Fisica Lt | `N85` | 2,3 | 35 | 0 | 🟢 live solo orari |
| Fisica Lt | `DC6` | 1 | 20 | 0 | 🟢 live solo orari |
| Industrial Chemistry for Circular and Bio Economy | `DG8` | 1 | 7 | 0 | 🟢 live solo orari |
| Informatica | `DE1` | 1 | 27 | 0 | 🟢 live solo orari |
| Marine Biology and Aquaculture | `P59` | 2 | 8 | 0 | 🟢 live solo orari |
| Marine Biology and Aquaculture | `D54` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Matematica | `P62` | 2 | 3 | 0 | 🟢 live solo orari |
| Matematica | `D70` | 1 | 6 | 0 | 🟢 live solo orari |
| Matematica Lt | `N87` | 2,3 | 45 | 0 | 🟢 live solo orari |
| Matematica Lt | `DF7` | 1 | 22 | 0 | 🟢 live solo orari |
| Mathematical Engineering | `D22` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Mathematical Engineering | `D71` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Ottica e Optometria | `M44` | 2,3 | 15 | 0 | 🟢 live solo orari |
| Ottica e Optometria | `DC7` | 1 | 7 | 0 | 🟢 live solo orari |
| Quantum Science and Engineering | `P65` | 1,2 | 1 | 0 | 🟢 live solo orari |
| Quantum Science and Engineering | `D60` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze Biologiche | `D55` | 1 | 9 | 0 | 🟢 live solo orari |
| Scienze Biologiche | `N99` | 2 | 18 | 0 | 🟢 live solo orari |
| Scienze Chimiche | `M03` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze Chimiche | `DG7` | 1 | 25 | 0 | 🟢 live solo orari |
| Scienze e Tecnologie della Chimica Industriale | `M04` | 2 | 2 | 0 | 🟢 live solo orari |
| Scienze e Tecnologie della Chimica Industriale | `D75` | 1 | 9 | 0 | 🟢 live solo orari |
| Scienze Naturali | `D56` | 1 | 5 | 0 | 🟢 live solo orari |
| Scienze Naturali | `M05` | 2 | 6 | 0 | 🟢 live solo orari |
| Scienze per la Natura e per L'ambiente | `D51` | 1 | 15 | 0 | 🟢 live solo orari |
| Scienze per la Natura e per L'ambiente | `P29` | 2,3 | 35 | 0 | 🟢 live solo orari |

## DipartimentodiScienzeSociali

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Comunicazione Pubblica, Sociale e Politica | `D84` | 1 | 15 | 0 | 🟢 live solo orari |
| Comunicazione Pubblica, Sociale e Politica | `D48` | 2 | 16 | 0 | 🟢 live solo orari |
| Culture Digitali e della Comunicazione | `D83` | 1 | 16 | 0 | 🟢 live solo orari |
| Culture Digitali e della Comunicazione | `D27` | 2,3 | 34 | 0 | 🟢 live solo orari |
| Digital Society, Social Innovation and Global Citizenship | `DA2` | 1 | 6 | 0 | 🟢 live solo orari |
| Innovazione Sociale | `DL5` | 1 | 11 | 0 | 🟢 live solo orari |
| Innovazione Sociale | `P45` | 2 | 8 | 0 | 🟢 live solo orari |
| Sociologia | `D98` | 1 | 18 | 0 | 🟢 live solo orari |
| Sociologia | `M13` | 2,3 | 32 | 0 | 🟢 live solo orari |
| Sociologia Digitale e Analisi del Web | `D85` | 1 | 8 | 0 | 🟢 live solo orari |
| Sociologia Digitale e Analisi del Web | `D49` | 2 | 14 | 0 | 🟢 live solo orari |

## Ingegneria-Fuorigrotta

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Bioingegneria Industriale | `P16` | 2 | 8 | 0 | 🟢 live solo orari |
| Civil and Environmental Engineering | `D38` | 1,2 | 17 | 0 | 🟢 live solo orari |
| Corso di Laurea in Ingegneria Chimica | `N37` | 2,3 | 19 | 0 | 🟢 live solo orari |
| Corso di Laurea in Ingegneria Dell'automazione | `N39` | 2,3 | 54 | 0 | 🟢 live solo orari |
| Corso di Laurea in Ingegneria Elettrica | `N42` | 2,3 | 22 | 0 | 🟢 live solo orari |
| Corso di Laurea Magistrale in Ingegneria Edile-architettura | `N52` | 5 | 17 | 0 | 🟢 live solo orari |
| Data Science | `D03` | 1,2 | 23 | 0 | 🟢 live solo orari |
| Gestione dei Sistemi Aerospaziali per la Difesa | `P19` | 1,2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Industrial Bioengineering | `DD3` | 1 | 8 | 0 | 🟢 live solo orari |
| Informatica | `DE5` | 1 | 26 | 0 | 🟢 live solo orari |
| Informatica | `N97` | 2 | 8 | 0 | 🟢 live solo orari |
| Informatica | `N86` | 2,3 | 38 | 0 | 🟢 live solo orari |
| Ingegneria Aerospaziale | `DF5` | 1 | 36 | 0 | 🟢 live solo orari |
| Ingegneria Aerospaziale | `M53` | 2 | 18 | 0 | 🟢 live solo orari |
| Ingegneria Aerospaziale | `N35` | 2,3 | 34 | 0 | 🟢 live solo orari |
| Ingegneria Aerospaziale | `DF0` | 1 | 28 | 0 | 🟢 live solo orari |
| Ingegneria Biomedica | `D92` | 1 | 14 | 0 | 🟢 live solo orari |
| Ingegneria Biomedica | `D97` | 1 | 18 | 0 | 🟢 live solo orari |
| Ingegneria Biomedica | `M54` | 2 | 49 | 0 | 🟢 live solo orari |
| Ingegneria Biomedica | `P46` | 2,3 | 17 | 0 | 🟢 live solo orari |
| Ingegneria Chimica | `DD1` | 1 | 14 | 0 | 🟢 live solo orari |
| Ingegneria Chimica | `DD4` | 1 | 31 | 0 | 🟢 live solo orari |
| Ingegneria Chimica | `M55` | 2 | 38 | 0 | 🟢 live solo orari |
| Ingegneria Civile D12 | `D12` | 2,3 | 24 | 0 | 🟢 live solo orari |
| Ingegneria Civile D62 | `D62` | 1 | 9 | 0 | 🟢 live solo orari |
| Ingegneria Civile per L'idraulica e i Trasporti D14 | `D14` | 2 | 46 | 0 | 🟢 live solo orari |
| Ingegneria Civile per L'idraulica e i Trasporti Dd6 | `DD6` | 1 | 58 | 0 | 🟢 live solo orari |
| Ingegneria dei Materiali | `D11` | 1,2 | 33 | 0 | 🟢 live solo orari |
| Ingegneria dei Materiali e Biomateriali | `DD2` | 1 | 14 | 0 | 🟢 live solo orari |
| Ingegneria Dell'automazione e Robotica | `DE6` | 1 | 9 | 0 | 🟢 live solo orari |
| Ingegneria Dell'automazione e Robotica | `DE2` | 1 | 24 | 0 | 🟢 live solo orari |
| Ingegneria Dell'automazione e Robotica | `P38` | 2 | 14 | 0 | 🟢 live solo orari |
| Ingegneria delle Telecomunicazioni e dei Media Digitali | `D65` | 1 | 8 | 0 | 🟢 live solo orari |
| Ingegneria delle Telecomunicazioni e dei Media Digitali | `P39` | 2,3 | 20 | 0 | 🟢 live solo orari |
| Ingegneria delle Telecomunicazioni e dei Media Digitali | `DE7` | 1 | 12 | 0 | 🟢 live solo orari |
| Ingegneria delle Telecomunicazioni e dei Media Digitali | `P49` | 2 | 23 | 0 | 🟢 live solo orari |
| Ingegneria Edile | `N51` | 2 | 34 | 0 | 🟢 live solo orari |
| Ingegneria Edile | `N41` | 2,3 | 19 | 0 | 🟢 live solo orari |
| Ingegneria Edile per la Sostenibilità | `DD5` | 1 | 10 | 0 | 🟢 live solo orari |
| Ingegneria Edile per la Sostenibilità | `DD8` | 1 | 28 | 0 | 🟢 live solo orari |
| Ingegneria Edile-architettura De0 | `DE0` | 1 | 8 | 0 | 🟢 live solo orari |
| Ingegneria Edile-architettura P71 | `P71` | 2,3,4 | 34 | 0 | 🟢 live solo orari |
| Ingegneria Elettrica | `D15` | 1,2 | 43 | 0 | 🟢 live solo orari |
| Ingegneria Elettrica | `DE4` | 1 | 8 | 0 | 🟢 live solo orari |
| Ingegneria Elettronica | `D66` | 1 | 8 | 0 | 🟢 live solo orari |
| Ingegneria Elettronica | `N43` | 2,3 | 20 | 0 | 🟢 live solo orari |
| Ingegneria Elettronica | `DE8` | 1 | 17 | 0 | 🟢 live solo orari |
| Ingegneria Elettronica | `M61` | 2 | 35 | 0 | 🟢 live solo orari |
| Ingegneria Gestionale | `M62` | 2 | 24 | 0 | 🟢 live solo orari |
| Ingegneria Gestionale | `DF6` | 1 | 14 | 0 | 🟢 live solo orari |
| Ingegneria Gestionale | `DF1` | 1 | 28 | 0 | 🟢 live solo orari |
| Ingegneria Gestionale | `D16` | 2,3 | 40 | 0 | 🟢 live solo orari |
| Ingegneria Gestionale delle Costruzioni D13 | `D13` | 2,3 | 22 | 0 | 🟢 live solo orari |
| Ingegneria Gestionale delle Costruzioni D63 | `D63` | 1 | 8 | 0 | 🟢 live solo orari |
| Ingegneria Informatica | `DE9` | 1 | 20 | 0 | 🟢 live solo orari |
| Ingegneria Informatica | `M63` | 2 | 20 | 0 | 🟢 live solo orari |
| Ingegneria Informatica | `DE3` | 1 | 27 | 0 | 🟢 live solo orari |
| Ingegneria Informatica | `N46` | 2,3 | 68 | 0 | 🟢 live solo orari |
| Ingegneria Meccanica | `DF2` | 1 | 28 | 0 | 🟢 live solo orari |
| Ingegneria Meccanica | `P72` | 2,3 | 40 | 0 | 🟢 live solo orari |
| Ingegneria Meccanica per L'energia e L'ambiente | `D20` | 1,2 | 81 | 0 | 🟢 live solo orari |
| Ingegneria Meccanica per la Progettazione e la Produzione | `D19` | 1,2 | 141 | 0 | 🟢 live solo orari |
| Ingegneria Navale | `DF3` | 1 | 7 | 0 | 🟢 live solo orari |
| Ingegneria Navale | `DF4` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Ingegneria Navale | `D43` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Ingegneria Navale | `D21` | 1,2 | 36 | 0 | 🟢 live solo orari |
| Ingegneria Navale | `D17` | 2,3 | 18 | 0 | 🟢 live solo orari |
| Ingegneria Navale Interateneo Livorno | `P23` | 3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Ingegneria per L'ambiente e il Territorio D64 | `D64` | 1 | 8 | 0 | 🟢 live solo orari |
| Ingegneria per L'ambiente e il Territorio Dd9 | `DD9` | 1 | 42 | 0 | 🟢 live solo orari |
| Ingegneria per L'ambiente e il Territorio M67 | `M67` | 2 | 31 | 0 | 🟢 live solo orari |
| Ingegneria per L'ambiente e il Territorio P70 | `P70` | 2,3 | 22 | 0 | 🟢 live solo orari |
| Ingegneria Strutturale e Geotecnica D28 | `D28` | 2 | 38 | 0 | 🟢 live solo orari |
| Ingegneria Strutturale e Geotecnica D86 | `D86` | 1 | 29 | 0 | 🟢 live solo orari |
| Meccatronica | `D36` | 1,2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienza e Ingegneria dei Materiali | `N50` | 2,3 | 20 | 0 | 🟢 live solo orari |
| Scienze dei Sistemi Aerospaziali per la Difesa | `P61` | 1,2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Tecnologie Digitali per le Costruzioni | `D35` | 1,2,3 | 1 | 0 | 🟢 live solo orari |
| Transportation Engineering and Mobility D42 | `D42` | 2 | 23 | 0 | 🟢 live solo orari |
| Transportation Engineering and Mobility Dd7 | `DD7` | 1 | 7 | 0 | 🟢 live solo orari |

## Ingegneria-SanGiovanni

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Autonomous Vehicle Engineering | `SG_D18` | 1,2 | 17 | 0 | 🟢 live solo orari |
| Biologia | `P30_SG` | 2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Biologia | `D50_SG` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Corso di Laurea in Ingegneria Chimica | `SG_N37` | 2,3 | 20 | 0 | 🟢 live solo orari |
| Ingegneria Aerospaziale | `SG_N35` | 2,3 | 18 | 0 | 🟢 live solo orari |
| Ingegneria Aerospaziale | `SG_DF0` | 1 | 21 | 0 | 🟢 live solo orari |
| Ingegneria Biomedica | `SG_D92` | 1 | 8 | 0 | 🟢 live solo orari |
| Ingegneria Biomedica | `SG_P46` | 2,3 | 30 | 0 | 🟢 live solo orari |
| Ingegneria Chimica | `SG_DD1` | 1 | 7 | 0 | 🟢 live solo orari |
| Ingegneria Civile | `SG_D62` | 1 | 9 | 0 | 🟢 live solo orari |
| Ingegneria Civile | `SG_D12` | 2,3 | 19 | 0 | 🟢 live solo orari |
| Ingegneria dei Materiali e Biomateriali | `SG_DD2` | 1 | 7 | 0 | 🟢 live solo orari |
| Ingegneria Dell'automazione e Robotica | `SG_DE2` | 1 | 16 | 0 | 🟢 live solo orari |
| Ingegneria delle Telecomunicazioni e dei Media Digitali | `SG_D65` | 1 | 8 | 0 | 🟢 live solo orari |
| Ingegneria delle Telecomunicazioni e dei Media Digitali | `SG_P39` | 2 | 9 | 0 | 🟢 live solo orari |
| Ingegneria Edile | `SG_N41` | 2,3 | 20 | 0 | 🟢 live solo orari |
| Ingegneria Edile per la Sostenibilità | `SG_DD5` | 1 | 10 | 0 | 🟢 live solo orari |
| Ingegneria Elettrica | `SG_DE4` | 1 | 9 | 0 | 🟢 live solo orari |
| Ingegneria Elettronica | `SG_D66` | 1 | 8 | 0 | 🟢 live solo orari |
| Ingegneria Elettronica | `SG_N43` | 2,3 | 20 | 0 | 🟢 live solo orari |
| Ingegneria Gestionale | `SG_DF1` | 1 | 14 | 0 | 🟢 live solo orari |
| Ingegneria Gestionale | `SG_D16` | 2,3 | 22 | 0 | 🟢 live solo orari |
| Ingegneria Gestionale delle Costruzioni | `SG_D63` | 1 | 8 | 0 | 🟢 live solo orari |
| Ingegneria Gestionale delle Costruzioni | `SG_D13` | 2 | 6 | 0 | 🟢 live solo orari |
| Ingegneria Informatica | `SG_DE3` | 1 | 14 | 0 | 🟢 live solo orari |
| Ingegneria Informatica | `SG_N46` | 2,3 | 9 | 0 | 🟢 live solo orari |
| Ingegneria Meccanica | `SG_P72` | 2,3 | 21 | 0 | 🟢 live solo orari |
| Ingegneria Meccanica | `SG_DF2` | 1 | 21 | 0 | 🟢 live solo orari |
| Ingegneria Navale | `SG_DF3` | 1 | 7 | 0 | 🟢 live solo orari |
| Ingegneria per L'ambiente e il Territorio | `SG_D64` | 1 | 8 | 0 | 🟢 live solo orari |
| Ingegneria per L'ambiente e il Territorio | `SG_P70` | 2,3 | 20 | 0 | 🟢 live solo orari |
| Ingegneria per L'ambiente e il Territorio | `SG_DD9` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Meccatronica | `SG_D36` | 1,2,3 | 33 | 0 | 🟢 live solo orari |
| Tecnologie Digitali per le Costruzioni | `SG_D35` | 1,2,3 | 14 | 0 | 🟢 live solo orari |
