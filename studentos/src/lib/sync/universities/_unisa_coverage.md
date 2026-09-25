# Università degli Studi di Salerno — copertura corsi (verificata via combo.php + grid/test_call)

Totale corsi: **192** · orari live: **190** · esami live: **90**. Esami: sì.

Codici (`scuola`/`corso`/`anno2`) dal portale, mai inventati.

## Ri-verifica anno accademico 2026/27 — 2026-09-25

Sorgente: GET reale `https://easycourse.unisa.it/AgendaStudenti/combo.php?sw=ec_&aa=2026&page=corsi` + POST reali `grid_call.php` (anno=2026, 10 settimane 28-09..30-11-2026, una richiesta per settimana, concorrenza 3 con pausa: live solo con `celle` > 0 in almeno una) e `test_call.php` (appelli 01-09-2026..30-09-2027; se vuoto, controllo sul 2025/26 per distinguere "calendario non ancora pubblicato" da "codice inesistente"). Nessun codice inventato: ogni riga sotto è stata restituita dal combo 2026 e confermata da una risposta non vuota.

- Programmi (livePrograms) prima: **111** · dopo: **77** (rimossi interamente: **34**)
- Anni-sorgente orario prima: **303** · dopo: **184** (invariati verificati: 57, ricatturati/aggiornati: 127, rimossi: 119)
- Programmi rimasti live solo in parte (alcuni anni rimossi): **30**
- Le tabelle per scuola più sotto sono lo **storico della verifica 2025/26** e NON sono state rigenerate: fa fede questa sezione.

### Corsi passati a solo-orari (exams:false) — 50

Regola rigida: `exams:false` se `test_call.php` non restituisce appelli nella finestra 2026/27 (01-09-2026..30-09-2027). Da riattivare (ultimo argomento `false` di `degreeSources`) quando i calendari esami vengono pubblicati.

- Archeologia e Culture Antiche
- Consulenza e Management Aziendale
- Corporate Communication, Marketing Innovation e Media Digitali
- Data Science e Gestione Dell'innovazione
- Digital Marketing
- Discipline delle Arti Visive, della Musica e dello Spettacolo
- Economia
- Economia e Management
- Filologia Moderna
- Filologia, Letterature e Storia Dell'antichità
- Filosofia (magistrale)
- Filosofia (triennale)
- Fisica (magistrale)
- Fisica (triennale)
- Gestione e Valorizzazione degli Archivi e delle Biblioteche
- Gestione e Valorizzazione delle Risorse Agrarie e delle Aree Protette
- Giurista D'impresa e delle Nuove Tecnologie
- Informatica (magistrale)
- Informatica (triennale)
- Informatica - Nf225
- Lettere
- Lingue e Culture Straniere
- Lingue e Letterature Moderne
- Linguistica e Didattica Dell'italiano nel Contesto Internazionale
- Management dei Sistemi Turistici per lo Sviluppo Sostenibile
- Management delle Attivita' Sportive e Motorie per il Benessere Sociale
- Matematica (magistrale)
- Matematica (triennale)
- Nanotechnology and Physics for Sustainability
- Organizzazione, Valutazione e Supervisione dei Servizi Sociali
- Politiche Territoriali e Cooperazione Internazionale
- Psicologia Dell'intervento Nei Contesti Clinici,sportivi e Formativi
- Scienze dei Beni Culturali
- Scienze del Servizio Sociale
- Scienze Dell'educazione (triennale)
- Scienze Dell'educazione (magistrale)
- Scienze Dell'educazione Permanente e della Formazione Continua
- Scienze della Comunicazione
- Scienze della Formazione Primaria
- Scienze della Valutazione Motorio-sportiva e Tecniche di Analisi e Progettazione dello Sport per Disabili
- Scienze delle Attivita' Motorie, Sportive e Dell'educazione Psicomotoria (triennale)
- Scienze delle Attivita' Motorie, Sportive e Dell'educazione Psicomotoria (magistrale)
- Scienze dello Spettacolo e della Produzione Multimediale
- Scienze e Nanotecnologie per la Sostenibilità
- Scienze Pedagogiche
- Scienze Politiche e delle Relazioni Internazionali
- Sicurezza Informatica e Tecnologie Cloud
- Sociologia
- Sociologia del Cambiamento Ambientale e Digitale
- Storia e Critica D'arte

### Sorgenti esami a rischio bug adapter (23 programmi)

Programmi con `exams:true` ma con anni senza appelli 2026/27: quelle sorgenti rispondono `Insegnamenti:[]` → errore zod nell'adapter (bug noto, file protetto) se la finestra di sync non contiene appelli.

- Electrical Engineering for Digital Energy (anni 2)
- Farmaceutica e Nutraceutica Animale (anni 3)
- Giurisprudenza (anni 1,4,5)
- Information Engineering for Digital Medicine (anni 2)
- Ingegneria Alimentare (anni 2)
- Ingegneria Chimica (magistrale) (anni 2)
- Ingegneria Chimica (triennale) (anni 2)
- Ingegneria Civile (triennale) (anni 2)
- Ingegneria Civile (magistrale) (anni 2)
- Ingegneria Civile per L'ambiente ed il Territorio (anni 2)
- Ingegneria Dell'informazione per la Medicina Digitale (anni 2)
- Ingegneria Elettronica (triennale) (anni 2)
- Ingegneria Elettronica (magistrale) (anni 2)
- Ingegneria Gestionale (magistrale) (anni 2)
- Ingegneria Gestionale (triennale) (anni 2)
- Ingegneria Informatica (magistrale) (anni 2)
- Ingegneria Informatica (triennale) (anni 2)
- Ingegneria Meccanica (triennale) (anni 2)
- Ingegneria Meccanica (magistrale) (anni 2)
- Ingegneria per L'ambiente ed il Territorio (anni 2)
- Innovazioni per le Produzioni Agrarie Mediterranee (anni 2)
- Smart Industry Engineering (anni 2)
- Tecniche Erboristiche (anni 1,2)

Ri-controllo finale: 184 sorgenti orario × 10 settimane, tutte con celle > 0 in almeno una. Campione celle per settimana (28-09 … 30-11):

- Archeologia e Culture Antiche (anno 1, `SP223`): 5, 5, 5, 3, 5, 5, 4, 3, 3, 0
- Corporate Communication, Marketing Innovation e Media Digitali (anno 1, `SC231`): 14, 14, 14, 14, 14, 14, 14, 14, 14, 14
- Economia (anno 1, `SE222`): 29, 29, 29, 29, 29, 29, 29, 29, 29, 29
- Farmaceutica e Nutraceutica Animale (anno 2, `FR123`): 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
- Filologia, Letterature e Storia Dell'antichità (anno 1, `TU222`): 15, 18, 18, 18, 18, 18, 17, 17, 11, 9
- Fisica (magistrale) (anno 2, `FS226`): 23, 23, 23, 23, 23, 23, 23, 23, 23, 23

### Corsi live verificati (2026/27)

| Corso | scuola | corso (per anno) | Anni live | celle/anno | appelli/anno | Stato |
|---|---|---|---|---|---|---|
| Archeologia e Culture Antiche | 300398 | 1:`SP223` 2:`SP223` | 1,2 | 5,5 | 0,0 | 🟢 solo orari (nessun appello) |
| Chimica e Tecnologia Farmaceutiche | 300390 | 1:`FR604` 3:`07604` 4:`07604` 5:`07604` | 1,3,4,5 | 12,11,15,13 | 2,3,3,2 | ✅ orari+esami |
| Consulenza e Management Aziendale | 300639 | 1:`SA221` 2:`SA221` | 1,2 | 16,12 | 0,0 | 🟢 solo orari (nessun appello) |
| Corporate Communication, Marketing Innovation e Media Digitali | 300401 | 1:`SC231` | 1 | 14 | 0 | 🟢 solo orari (nessun appello) |
| Data Science e Gestione Dell'innovazione | 300639 | 1:`SA228` 2:`SA228` | 1,2 | 12,10 | 0,0 | 🟢 solo orari (nessun appello) |
| Digital Marketing | 300401 | 1:`SC232` 2:`SC232` | 1,2 | 23,11 | 0,0 | 🟢 solo orari (nessun appello) |
| Discipline delle Arti Visive, della Musica e dello Spettacolo | 300398 | 1:`SP124` 2:`SP124` 3:`43124` | 1,2,3 | 9,7,12 | 0,0,0 | 🟢 solo orari (nessun appello) |
| Economia | 300399 | 1:`SE222` 2:`SE222` | 1,2 | 29,22 | 0,0 | 🟢 solo orari (nessun appello) |
| Economia e Management | 300639 | 1:`SA127` 2:`SA127` 3:`02127` | 1,2,3 | 19,22,23 | 0,0,0 | 🟢 solo orari (nessun appello) |
| Electrical Engineering for Digital Energy | 300638 | 1:`IE233` 2:`IE233` | 1,2 | 8,9 | 23,0 | ✅ orari+esami |
| Farmaceutica e Nutraceutica Animale | 300390 | 1:`FR123` 2:`FR123` 3:`07123` | 1,2,3 | 9,7,14 | 2,1,0 | ✅ orari+esami |
| Farmacia | 300390 | 1:`FR603` 3:`07603` 4:`07603` 5:`07603` | 1,3,4,5 | 11,10,18,14 | 4,2,2,1 | ✅ orari+esami |
| Filologia Moderna | 300404 | 1:`TU221` 2:`TU221` | 1,2 | 21,13 | 0,0 | 🟢 solo orari (nessun appello) |
| Filologia, Letterature e Storia Dell'antichità | 300404 | 1:`TU222` 2:`TU222` | 1,2 | 15,14 | 0,0 | 🟢 solo orari (nessun appello) |
| Filosofia (magistrale) | 300398 | 1:`SP226` 2:`SP226` | 1,2 | 12,3 | 0,0 | 🟢 solo orari (nessun appello) |
| Filosofia (triennale) | 300398 | 1:`SP125` 2:`SP125` 3:`03125` | 1,2,3 | 14,27,15 | 0,0,0 | 🟢 solo orari (nessun appello) |
| Fisica (magistrale) | 300391 | 1:`FS126` 2:`FS226` | 1,2 | 14,23 | 0,0 | 🟢 solo orari (nessun appello) |
| Fisica (triennale) | 300391 | 1:`FS226` 2:`FS126` 3:`05126` | 1,2,3 | 18,13,13 | 0,0,0 | 🟢 solo orari (nessun appello) |
| Gestione e Valorizzazione degli Archivi e delle Biblioteche | 300398 | 1:`SP220` 2:`SP220` | 1,2 | 4,6 | 0,0 | 🟢 solo orari (nessun appello) |
| Gestione e Valorizzazione delle Risorse Agrarie e delle Aree Protette | 300390 | 1:`FR122` 2:`FR122` 3:`07122` | 1,2,3 | 9,11,14 | 0,0,0 | 🟢 solo orari (nessun appello) |
| Giurisprudenza | 300400 | 1:`SG601` 2:`SG601` 3:`SG601` 4:`SG601` 5:`SG601` | 1,2,3,4,5 | 43,26,28,22,15 | 0,1,1,0,0 | ✅ orari+esami |
| Giurista D'impresa e delle Nuove Tecnologie | 300400 | 1:`SG121` 2:`SG121` 3:`01121` | 1,2,3 | 12,8,13 | 0,0,0 | 🟢 solo orari (nessun appello) |
| Informatica (magistrale) | 300392 | 1:`NF225` 2:`NF225` | 1,2 | 42,32 | 0,0 | 🟢 solo orari (nessun appello) |
| Informatica (triennale) | 300392 | 1:`NF121` 2:`NF121` 3:`05121` | 1,2,3 | 40,27,31 | 0,0,0 | 🟢 solo orari (nessun appello) |
| Informatica - Nf225 | 300392 | 1:`NF225` | 1 | 42 | 0 | 🟢 solo orari (nessun appello) |
| Information Engineering for Digital Medicine | 300638 | 1:`IE232` 2:`IE232` | 1,2 | 11,15 | 20,0 | ✅ orari+esami |
| Ingegneria Alimentare | 300395 | 1:`II228` 2:`II228` | 1,2 | 11,10 | 18,0 | ✅ orari+esami |
| Ingegneria Chimica (magistrale) | 300395 | 1:`II122` 2:`II222` | 1,2 | 8,9 | 22,0 | ✅ orari+esami |
| Ingegneria Chimica (triennale) | 300395 | 1:`II222` 2:`II122` 3:`06122` | 1,2,3 | 9,10,12 | 26,0,30 | ✅ orari+esami |
| Ingegneria Civile (triennale) | 300393 | 1:`IC121` 2:`IC121` 3:`06121` | 1,2,3 | 10,13,18 | 16,0,20 | ✅ orari+esami |
| Ingegneria Civile (magistrale) | 300393 | 1:`IC221` 2:`IC221` | 1,2 | 20,24 | 30,0 | ✅ orari+esami |
| Ingegneria Civile per L'ambiente ed il Territorio | 300393 | 1:`IC125` 2:`IC125` 3:`06125` | 1,2,3 | 10,9,17 | 22,0,24 | ✅ orari+esami |
| Ingegneria Dell'informazione per la Medicina Digitale | 300638 | 1:`IE128` 2:`IE128` 3:`06128` | 1,2,3 | 12,10,13 | 22,0,18 | ✅ orari+esami |
| Ingegneria Edile-architettura | 300393 | 1:`IC601` 3:`06601` 4:`06601` 5:`06601` | 1,3,4,5 | 9,9,8,11 | 24,14,12,16 | ✅ orari+esami |
| Ingegneria Elettronica (triennale) | 300395 | 1:`II124` 2:`II124` 3:`06124` | 1,2,3 | 12,10,13 | 30,0,22 | ✅ orari+esami |
| Ingegneria Elettronica (magistrale) | 300395 | 1:`II224` 2:`II224` | 1,2 | 14,14 | 28,0 | ✅ orari+esami |
| Ingegneria Gestionale (magistrale) | 300395 | 1:`II226` 2:`II226` | 1,2 | 7,20 | 18,0 | ✅ orari+esami |
| Ingegneria Gestionale (triennale) | 300395 | 1:`II126` 2:`II126` 3:`06126` | 1,2,3 | 10,12,17 | 28,0,30 | ✅ orari+esami |
| Ingegneria Informatica (magistrale) | 300638 | 1:`IE127` 2:`IE227` | 1,2 | 20,58 | 26,0 | ✅ orari+esami |
| Ingegneria Informatica (triennale) | 300638 | 1:`IE227` 2:`IE127` 3:`06127` | 1,2,3 | 22,22,20 | 18,0,32 | ✅ orari+esami |
| Ingegneria Meccanica (triennale) | 300395 | 1:`II223` 2:`II123` 3:`06123` | 1,2,3 | 10,12,13 | 18,0,28 | ✅ orari+esami |
| Ingegneria Meccanica (magistrale) | 300395 | 1:`II123` 2:`II223` | 1,2 | 9,29 | 28,0 | ✅ orari+esami |
| Ingegneria per L'ambiente ed il Territorio | 300393 | 1:`IC225` 2:`IC225` | 1,2 | 16,18 | 24,0 | ✅ orari+esami |
| Innovazioni per le Produzioni Agrarie Mediterranee | 300390 | 1:`FR222` 2:`FR222` | 1,2 | 17,12 | 1,0 | ✅ orari+esami |
| Lettere | 300404 | 1:`TU126` 2:`TU126` 3:`03126` | 1,2,3 | 19,28,26 | 0,0,0 | 🟢 solo orari (nessun appello) |
| Lingue e Culture Straniere | 300404 | 1:`TU122` 2:`TU122` 3:`43122` | 1,2,3 | 26,19,16 | 0,0,0 | 🟢 solo orari (nessun appello) |
| Lingue e Letterature Moderne | 300404 | 1:`TU241` 2:`TU241` | 1,2 | 14,24 | 0,0 | 🟢 solo orari (nessun appello) |
| Linguistica e Didattica Dell'italiano nel Contesto Internazionale | 300404 | 1:`TU240` | 1 | 2 | 0 | 🟢 solo orari (nessun appello) |
| Management dei Sistemi Turistici per lo Sviluppo Sostenibile | 300401 | 1:`SC228` 2:`SC228` | 1,2 | 11,5 | 0,0 | 🟢 solo orari (nessun appello) |
| Management delle Attivita' Sportive e Motorie per il Benessere Sociale | 300663 | 1:`TP227` 2:`TP227` | 1,2 | 11,4 | 0,0 | 🟢 solo orari (nessun appello) |
| Matematica (magistrale) | 300396 | 1:`MT123` 2:`MT222` | 1,2 | 26,18 | 0,0 | 🟢 solo orari (nessun appello) |
| Matematica (triennale) | 300396 | 1:`MT222` 2:`MT123` 3:`05123` | 1,2,3 | 18,17,20 | 0,0,0 | 🟢 solo orari (nessun appello) |
| Nanotechnology and Physics for Sustainability | 300391 | 1:`FS227` | 1 | 4 | 0 | 🟢 solo orari (nessun appello) |
| Organizzazione, Valutazione e Supervisione dei Servizi Sociali | 300663 | 1:`TP230` | 1 | 9 | 0 | 🟢 solo orari (nessun appello) |
| Politiche Territoriali e Cooperazione Internazionale | 300401 | 1:`SC226` 2:`SC226` | 1,2 | 20,10 | 0,0 | 🟢 solo orari (nessun appello) |
| Psicologia Dell'intervento Nei Contesti Clinici,sportivi e Formativi | 300402 | 1:`SU225` | 1 | 3 | 0 | 🟢 solo orari (nessun appello) |
| Scienze dei Beni Culturali | 300398 | 1:`SP128` 2:`SP128` 3:`03128` | 1,2,3 | 14,27,33 | 0,0,0 | 🟢 solo orari (nessun appello) |
| Scienze del Servizio Sociale | 300663 | 1:`TP129` 2:`TP129` 3:`03129` | 1,2,3 | 14,13,7 | 0,0,0 | 🟢 solo orari (nessun appello) |
| Scienze Dell'educazione (triennale) | 300402 | 2:`SU124` 3:`44124` | 2,3 | 15,21 | 0,0 | 🟢 solo orari (nessun appello) |
| Scienze Dell'educazione (magistrale) | 300402 | 1:`SU124` | 1 | 21 | 0 | 🟢 solo orari (nessun appello) |
| Scienze Dell'educazione Permanente e della Formazione Continua | 300402 | 1:`SU224` 2:`SU224` | 1,2 | 14,8 | 0,0 | 🟢 solo orari (nessun appello) |
| Scienze della Comunicazione | 300401 | 1:`SC122` 2:`SC122` 3:`03122` | 1,2,3 | 19,12,16 | 0,0,0 | 🟢 solo orari (nessun appello) |
| Scienze della Formazione Primaria | 300402 | 1:`44610` 2:`44610` 3:`44610` 4:`44610` 5:`44610` | 1,2,3,4,5 | 14,14,12,8,7 | 0,0,0,0,0 | 🟢 solo orari (nessun appello) |
| Scienze della Valutazione Motorio-sportiva e Tecniche di Analisi e Progettazione dello Sport per Disabili | 300402 | 1:`SU222` 2:`SU222` | 1,2 | 11,7 | 0,0 | 🟢 solo orari (nessun appello) |
| Scienze delle Attivita' Motorie, Sportive e Dell'educazione Psicomotoria (triennale) | 300402 | 2:`SU125` 3:`44125` | 2,3 | 13,11 | 0,0 | 🟢 solo orari (nessun appello) |
| Scienze delle Attivita' Motorie, Sportive e Dell'educazione Psicomotoria (magistrale) | 300402 | 1:`SU125` | 1 | 12 | 0 | 🟢 solo orari (nessun appello) |
| Scienze dello Spettacolo e della Produzione Multimediale | 300398 | 1:`SP222` 2:`SP222` | 1,2 | 5,10 | 0,0 | 🟢 solo orari (nessun appello) |
| Scienze e Nanotecnologie per la Sostenibilità | 300391 | 1:`FS129` 2:`FS129` 3:`05129` | 1,2,3 | 8,11,12 | 0,0,0 | 🟢 solo orari (nessun appello) |
| Scienze Pedagogiche | 300402 | 1:`SU221` 2:`SU221` | 1,2 | 12,10 | 0,0 | 🟢 solo orari (nessun appello) |
| Scienze Politiche e delle Relazioni Internazionali | 300401 | 1:`SC121` 2:`SC121` 3:`12121` | 1,2,3 | 18,14,37 | 0,0,0 | 🟢 solo orari (nessun appello) |
| Sicurezza Informatica e Tecnologie Cloud | 300392 | 1:`NF227` 2:`NF227` | 1,2 | 6,7 | 0,0 | 🟢 solo orari (nessun appello) |
| Smart Industry Engineering | 300395 | 1:`II230` 2:`II230` | 1,2 | 9,10 | 14,0 | ✅ orari+esami |
| Sociologia | 300663 | 1:`TP123` 2:`TP123` 3:`03123` | 1,2,3 | 11,12,13 | 0,0,0 | 🟢 solo orari (nessun appello) |
| Sociologia del Cambiamento Ambientale e Digitale | 300663 | 1:`TP229` | 1 | 16 | 0 | 🟢 solo orari (nessun appello) |
| Storia e Critica D'arte | (nessuna) | 1:`SP224` 2:`SP224` | 1,2 | 10,10 | 0,0 | 🟢 solo orari (nessun appello) |
| Tecniche Erboristiche | 300390 | 1:`FR121` 2:`FR121` 3:`07121` | 1,2,3 | 10,15,11 | 0,0,1 | ✅ orari+esami |
| Tecniche per L'edilizia e il Territorio | 300393 | 1:`06129` 2:`06129` 3:`06129` | 1,2,3 | 10,10,2 | 24,20,4 | ✅ orari+esami |

Nota appelli: numero senza parentesi = appelli nella finestra 2026/27; tra parentesi = solo nella finestra 2025/26 (calendario nuovo non ancora pubblicato).

### Codici ricatturati (127 anni)

| Corso | Anno | corso prima → dopo | anno2 prima → dopo |
|---|---|---|---|
| Archeologia e Culture Antiche | 1 | `SP223` → `SP223` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Archeologia e Culture Antiche | 2 | `03223` → `SP223` | `PDS0-2022\|2` → `PDS0-2025\|2` |
| Chimica e Tecnologia Farmaceutiche | 1 | `FR604` → `FR604` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Consulenza e Management Aziendale | 1 | `SA221` → `SA221` | `PDS0-2025\|1, SA221P0003\|1, SA221P0006\|1, SA221P0001\|1, SA221P0004\|1` → `PDS0-2026\|1, SA221P0003\|1, SA221P0002\|1, SA221P0006\|1, SA221P0001\|1` |
| Consulenza e Management Aziendale | 2 | `02221` → `SA221` | `02221P0003\|2, 02221P0006\|2, 02221P0001\|2, 02221P0004\|2` → `SA221P0003\|2, SA221P0006\|2, SA221P0001\|2, SA221P0004\|2` |
| Corporate Communication, Marketing Innovation e Media Digitali | 1 | `SC231` → `SC231` | `PDS0-2025\|1, SC231P0003\|1, SC231P0004\|1` → `PDS0-2026\|1, SC231P0003\|1, SC231P0004\|1` |
| Data Science e Gestione Dell'innovazione | 2 | `02228` → `SA228` | `PDS0-2022\|2, 02228P0002\|2, 02228P0003\|2` → `PDS0-2025\|2, SA228P0002\|2, SA228P0003\|2` |
| Digital Marketing | 1 | `SC232` → `SC232` | `PDS0-2024\|1, SC232P0001\|1, SC232P0002\|1` → `PDS0-2026\|1, SC232P0001\|1, SC232P0002\|1` |
| Digital Marketing | 2 | `03232` → `SC232` | `PDS0-2024\|2, 03232P0001\|2, 03232P0002\|2` → `PDS0-2024\|2, SC232P0001\|2, SC232P0002\|2` |
| Discipline delle Arti Visive, della Musica e dello Spettacolo | 1 | `SP124` → `SP124` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Discipline delle Arti Visive, della Musica e dello Spettacolo | 2 | `43124` → `SP124` | `PDS0-2020\|2` → `PDS0-2025\|2` |
| Economia | 1 | `SE222` → `SE222` | `SE222P0003\|1, SE222P0001\|1, SE222P0002\|1, SE222P0004\|1` → `SE222P0003\|1, SE222P0001\|1, SE222P0005\|1, SE222P0006\|1, PDS0-2026\|1` |
| Economia | 2 | `02222` → `SE222` | `02222P0003\|2, 02222P0001\|2, 02222P0002\|2, 02222P0004\|2, 02222P0000\|2` → `SE222P0003\|2, SE222P0001\|2, SE222P0002\|2, SE222P0004\|2` |
| Economia e Management | 1 | `SA127` → `SA127` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Economia e Management | 2 | `02127` → `SA127` | `02127P0002\|2, PDS0-2023\|2, 02127P0009\|2, 02127P0005\|2, 02127P0010\|2` → `SA127P0002\|2, PDS0-2025\|2, SA127P0009\|2, SA127P0005\|2, SA127P0010\|2` |
| Electrical Engineering for Digital Energy | 1 | `IE233` → `IE233` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Electrical Engineering for Digital Energy | 2 | `06233` → `IE233` | `PDS0-2023\|2` → `PDS0-2025\|2` |
| Farmaceutica e Nutraceutica Animale | 1 | `FR123` → `FR123` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Farmaceutica e Nutraceutica Animale | 2 | `07123` → `FR123` | `PDS0-2022\|2` → `PDS0-2025\|2` |
| Farmacia | 1 | `FR603` → `FR603` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Filologia Moderna | 2 | `03221` → `TU221` | `PDS0-2019\|2, 03221P0001\|2, 03221P0002\|2` → `TU221P0001\|2, TU221P0002\|2` |
| Filologia, Letterature e Storia Dell'antichità | 1 | `TU222` → `TU222` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Filologia, Letterature e Storia Dell'antichità | 2 | `03222` → `TU222` | `PDS0-2023\|2` → `PDS0-2025\|2` |
| Filosofia (magistrale) | 1 | `SP226` → `SP226` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Filosofia (magistrale) | 2 | `03226` → `SP226` | `PDS0-2021\|2` → `PDS0-2025\|2` |
| Filosofia (triennale) | 1 | `SP125` → `SP125` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Filosofia (triennale) | 2 | `03125` → `SP125` | `PDS0-2021\|2` → `PDS0-2025\|2` |
| Fisica (magistrale) | 1 | `FS126` → `FS126` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Fisica (magistrale) | 2 | `05226` → `FS226` | `PDS0-2021\|2` → `PDS0-2025\|2` |
| Fisica (triennale) | 1 | `FS226` → `FS226` | `PDS0-2025\|1` → `PDS0-2026\|1, PDS0-2026_\|1` |
| Fisica (triennale) | 2 | `05126` → `FS126` | `PDS0-2017\|2` → `PDS0-2025\|2` |
| Gestione e Valorizzazione degli Archivi e delle Biblioteche | 1 | `SP220` → `SP220` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Gestione e Valorizzazione degli Archivi e delle Biblioteche | 2 | `03220` → `SP220` | `PDS0-2020\|2` → `PDS0-2025\|2` |
| Gestione e Valorizzazione delle Risorse Agrarie e delle Aree Protette | 1 | `FR122` → `FR122` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Gestione e Valorizzazione delle Risorse Agrarie e delle Aree Protette | 2 | `07122` → `FR122` | `PDS0-2016\|2` → `PDS0-2025\|2` |
| Giurista D'impresa e delle Nuove Tecnologie | 1 | `SG121` → `SG121` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Giurista D'impresa e delle Nuove Tecnologie | 2 | `01121` → `SG121` | `PDS0-2020\|2` → `PDS0-2025\|2` |
| Informatica (magistrale) | 1 | `88601` → `NF225` | `PDS0-2023\|1` → `NF225P0007\|1, NF225P0010\|1, NF225P0009\|1, NF225P0006\|1, NF225P0011\|1` |
| Informatica (magistrale) | 2 | `88601` → `NF225` | `88601-01\|2, 88601-02\|2` → `NF225P0007\|2, NF225P0010\|2, NF225P0009\|2, NF225P0006\|2, NF225P0011\|2` |
| Informatica (triennale) | 1 | `NF121` → `NF121` | `PDS0-2025-A-C\|1, PDS0-2025-D-G\|1, PDS0-2025-H-PET\|1, PDS0-2025-PEU-Z\|1` → `PDS0-2026-A-C\|1, PDS0-2026-D-G\|1, PDS0-2026-H-PET\|1, PDS0-2026-PEU-Z\|1` |
| Informatica (triennale) | 2 | `05121` → `NF121` | `PDS0-2017- 0\|2, PDS0-2017- 1\|2, PDS0-2017- 2\|2` → `PDS0-2025-Resto 0\|2, PDS0-2025-Resto 1\|2, PDS0-2025-Resto 2\|2` |
| Informatica (triennale) | 3 | `05121` → `05121` | `PDS0-2017- 0\|3, PDS0-2017- 1\|3, PDS0-2017- 2\|3` → `PDS0-2017-Resto 0\|3, PDS0-2017- Resto 1\|3, PDS0-2017- Resto 2\|3` |
| Information Engineering for Digital Medicine | 1 | `IE232` → `IE232` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Information Engineering for Digital Medicine | 2 | `06232` → `IE232` | `PDS0-2022\|2` → `PDS0-2025\|2` |
| Ingegneria Alimentare | 1 | `II228` → `II228` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Ingegneria Alimentare | 2 | `06228` → `II228` | `PDS0-2024\|2` → `PDS0-2025\|2` |
| Ingegneria Chimica (magistrale) | 1 | `II122` → `II122` | `PDS0-2025\|1` → `II122P0002\|1, II122P0001\|1` |
| Ingegneria Chimica (magistrale) | 2 | `06222` → `II222` | `PDS0-2024\|2, 06222P0001\|2, 06222P0002\|2` → `PDS0-2025\|2, II222P0001\|2, II222P0002\|2` |
| Ingegneria Chimica (triennale) | 1 | `II222` → `II222` | `PDS0-2025\|1, II222P0001\|1, II222P0002\|1` → `II222P0001\|1, II222P0002\|1` |
| Ingegneria Chimica (triennale) | 2 | `06122` → `II122` | `PDS0-2016\|2, 06122P0002\|2, 06122P0001\|2` → `PDS0-2025\|2, II122P0002\|2, II122P0001\|2` |
| Ingegneria Chimica (triennale) | 3 | `06122` → `06122` | `PDS0-2016\|3, 06122P0002\|3, 06122P0001\|3` → `PDS0-2024\|3, 06122P0002\|3, 06122P0001\|3` |
| Ingegneria Civile (triennale) | 1 | `IC121` → `IC121` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Ingegneria Civile (triennale) | 2 | `06121` → `IC121` | `PDS0-2022\|2` → `PDS0-2025\|2` |
| Ingegneria Civile (magistrale) | 2 | `06221` → `IC221` | `PDS0-2022\|2, 06221P0005\|2, 06221P0006\|2, 06221P0004\|2` → `PDS0-2025\|2, IC221P0005\|2, IC221P0006\|2, IC221P0004\|2` |
| Ingegneria Civile per L'ambiente ed il Territorio | 1 | `IC125` → `IC125` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Ingegneria Civile per L'ambiente ed il Territorio | 2 | `06125` → `IC125` | `PDS0-2022\|2` → `PDS0-2025\|2` |
| Ingegneria Dell'informazione per la Medicina Digitale | 1 | `IE128` → `IE128` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Ingegneria Dell'informazione per la Medicina Digitale | 2 | `06128` → `IE128` | `PDS0-2022\|2` → `PDS0-2025\|2` |
| Ingegneria Edile-architettura | 1 | `IC601` → `IC601` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Ingegneria Elettronica (triennale) | 1 | `II124` → `II124` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Ingegneria Elettronica (triennale) | 2 | `06124` → `II124` | `PDS0-2018\|2` → `PDS0-2025\|2` |
| Ingegneria Elettronica (magistrale) | 2 | `06224` → `II224` | `06224P0002\|2, 06224P0001\|2` → `PDS0-2025\|2, II224P0002\|2, II224P0001\|2` |
| Ingegneria Gestionale (magistrale) | 1 | `II226` → `II226` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Ingegneria Gestionale (magistrale) | 2 | `06226` → `II226` | `PDS0-2018\|2` → `PDS0-2025\|2` |
| Ingegneria Gestionale (triennale) | 1 | `II126` → `II126` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Ingegneria Gestionale (triennale) | 2 | `06126` → `II126` | `PDS0-2018\|2` → `PDS0-2025\|2` |
| Ingegneria Informatica (magistrale) | 1 | `IE127` → `IE127` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Ingegneria Informatica (magistrale) | 2 | `06227` → `IE227` | `06227P0016\|2, PDS0-2022\|2, 06227P0019\|2, 06227P0015\|2, 06227P0017\|2` → `IE227P0016\|2, PDS0-2025\|2, IE227P0019\|2, IE227P0015\|2, IE227P0017\|2` |
| Ingegneria Informatica (triennale) | 1 | `IE227` → `IE227` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Ingegneria Informatica (triennale) | 2 | `06127` → `IE127` | `PDS0-2022\|2` → `PDS0-2025\|2` |
| Ingegneria Meccanica (triennale) | 1 | `II223` → `II223` | `PDS0-2025\|1` → `II223P0002\|1, II223P0004\|1, II223P0003\|1, II223P0001\|1` |
| Ingegneria Meccanica (triennale) | 2 | `06123` → `II123` | `PDS0-2018\|2` → `PDS0-2025\|2` |
| Ingegneria Meccanica (magistrale) | 1 | `II123` → `II123` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Ingegneria Meccanica (magistrale) | 2 | `06223` → `II223` | `PDS0-2018\|2, 06223P0002\|2, 06223P0004\|2, 06223P0003\|2, 06223P0001\|2` → `PDS0-2025\|2, II223P0002\|2, II223P0004\|2, II223P0003\|2, II223P0001\|2` |
| Ingegneria per L'ambiente ed il Territorio | 2 | `06225` → `IC225` | `PDS0-2022\|2, 06225P0004\|2, 06225P0003\|2` → `PDS0-2025\|2, IC225P0004\|2, IC225P0003\|2` |
| Innovazioni per le Produzioni Agrarie Mediterranee | 1 | `FR222` → `FR222` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Innovazioni per le Produzioni Agrarie Mediterranee | 2 | `07222` → `FR222` | `PDS0-2019\|2` → `PDS0-2025\|2` |
| Lettere | 2 | `03126` → `TU126` | `03126P001\|2, 03126P002\|2` → `TU126P0001\|2, TU126P0002\|2` |
| Lettere | 3 | `03126` → `03126` | `PDS0-2023\|3, 03126P001\|3, 03126P002\|3` → `03126P001\|3, 03126P002\|3` |
| Lingue e Culture Straniere | 2 | `43122` → `TU122` | `PDS0-2016\|2` → `TU122P0001\|2, TU122P0002\|2` |
| Lingue e Letterature Moderne | 2 | `43221` → `TU241` | `PDS0-2018\|2, 43221P0004\|2, 43221P0005\|2, 43221P0003\|2` → `TU241P0001\|2, TU241P0004\|2, TU241P0005\|2, TU241P0003\|2` |
| Linguistica e Didattica Dell'italiano nel Contesto Internazionale | 1 | `TU240` → `TU240` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Management dei Sistemi Turistici per lo Sviluppo Sostenibile | 1 | `SC228` → `SC228` | `PDS0-2025\|1` → `PDS0-2025\|1, PDS0-2026\|1` |
| Management dei Sistemi Turistici per lo Sviluppo Sostenibile | 2 | `12228` → `SC228` | `PDS0-2022\|2` → `PDS0-2025\|2` |
| Management delle Attivita' Sportive e Motorie per il Benessere Sociale | 1 | `TP227` → `TP227` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Management delle Attivita' Sportive e Motorie per il Benessere Sociale | 2 | `12227` → `TP227` | `PDS0-2021\|2` → `PDS0-2025\|2` |
| Matematica (magistrale) | 2 | `05222` → `MT222` | `05222P0002\|2, 05222P0001\|2` → `MT222P0002\|2, MT222P0001\|2` |
| Matematica (triennale) | 2 | `05123` → `MT123` | `PDS0-2018\|2` → `PDS0-2025\|2` |
| Nanotechnology and Physics for Sustainability | 1 | `FS227` → `FS227` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Organizzazione, Valutazione e Supervisione dei Servizi Sociali | 1 | `TP230` → `TP230` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Politiche Territoriali e Cooperazione Internazionale | 2 | `12226` → `SC226` | `PDS0-2019\|2, 12226P0001\|2, 12226P0002\|2` → `PDS0-2025\|2, SC226P0001\|2, SC226P0002\|2` |
| Psicologia Dell'intervento Nei Contesti Clinici,sportivi e Formativi | 1 | `SU225` → `SU225` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Scienze dei Beni Culturali | 2 | `03128` → `SP128` | `03128P0001\|2, 03128P0002\|2, 03128P0004\|2` → `SP128P0001\|2, SP128P0002\|2, SP128P0004\|2` |
| Scienze del Servizio Sociale | 1 | `TP129` → `TP129` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Scienze del Servizio Sociale | 2 | `03129` → `TP129` | `PDS0-2022\|2` → `PDS0-2025\|2` |
| Scienze Dell'educazione (triennale) | 2 | `44124` → `SU124` | `44124P0004\|2, 44124P0003\|2` → `SU124P0004\|2, SU124P0003\|2` |
| Scienze Dell'educazione Permanente e della Formazione Continua | 1 | `SU224` → `SU224` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Scienze Dell'educazione Permanente e della Formazione Continua | 2 | `44224` → `SU224` | `PDS0-2019\|2` → `PDS0-2025\|2` |
| Scienze della Comunicazione | 1 | `SC122` → `SC122` | `PDS0-2025\|1, SC122P0011\|1, SC122P0009\|1, SC122P0001\|1` → `PDS0-2026\|1, SC122P0011\|1, SC122P0009\|1, SC122P0001\|1` |
| Scienze della Comunicazione | 2 | `03122` → `SC122` | `PDS0-2019\|2, 03122P0007\|2, 03122P0011\|2, 03122P0008\|2, 03122P0009\|2, 03122P0010\|2` → `PDS0-2025\|2, SC122P0011\|2, SC122P0009\|2, SC122P0001\|2` |
| Scienze della Comunicazione | 3 | `03122` → `03122` | `PDS0-2019\|3, 03122P0007\|3, 03122P0011\|3, 03122P0008\|3, 03122P0009\|3, 03122P0010\|3` → `PDS0-2019\|3, 03122P0011\|3, 03122P0009\|3, 03122P0010\|3` |
| Scienze della Formazione Primaria | 1 | `44610` → `44610` | `PDS0-2016\|1` → `PDS0-2026\|1` |
| Scienze della Valutazione Motorio-sportiva e Tecniche di Analisi e Progettazione dello Sport per Disabili | 1 | `SU222` → `SU222` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Scienze della Valutazione Motorio-sportiva e Tecniche di Analisi e Progettazione dello Sport per Disabili | 2 | `44222` → `SU222` | `PDS0-2018\|2` → `PDS0-2025\|2` |
| Scienze delle Attivita' Motorie, Sportive e Dell'educazione Psicomotoria (triennale) | 2 | `44125` → `SU125` | `PDS0-2017\|2` → `PDS0-2025\|2` |
| Scienze delle Attivita' Motorie, Sportive e Dell'educazione Psicomotoria (magistrale) | 1 | `SU125` → `SU125` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Scienze dello Spettacolo e della Produzione Multimediale | 2 | `43222` → `SP222` | `PDS0-2020\|2` → `SP222P0001\|2, SP222P0002\|2` |
| Scienze e Nanotecnologie per la Sostenibilità | 1 | `FS129` → `FS129` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Scienze e Nanotecnologie per la Sostenibilità | 2 | `05129` → `FS129` | `PDS0-2022\|2` → `PDS0-2025\|2` |
| Scienze Pedagogiche | 1 | `SU221` → `SU221` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Scienze Pedagogiche | 2 | `44221` → `SU221` | `PDS0-2019\|2` → `PDS0-2025\|2` |
| Scienze Politiche e delle Relazioni Internazionali | 1 | `SC121` → `SC121` | `PDS0-2025\|1, SC121P0007\|1, SC121P0005\|1, SC121P0001\|1` → `PDS0-2026\|1, SC121P0007\|1, SC121P0005\|1, SC121P0001\|1` |
| Scienze Politiche e delle Relazioni Internazionali | 2 | `12121` → `SC121` | `PDS0-2019\|2, 12121P002\|2, 12121P007\|2, 12121P005\|2, 12121P006\|2, 12121P001\|2` → `PDS0-2025\|2` |
| Scienze Politiche e delle Relazioni Internazionali | 3 | `12121` → `12121` | `PDS0-2019\|3, 12121P002\|3, 12121P007\|3, 12121P005\|3, 12121P006\|3, 12121P001\|3` → `PDS0-2019\|3, 12121P007\|3, 12121P005\|3, 12121P001\|3` |
| Sicurezza Informatica e Tecnologie Cloud | 1 | `NF227` → `NF227` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Sicurezza Informatica e Tecnologie Cloud | 2 | `05227` → `NF227` | `PDS0-2023\|2` → `PDS0-2025\|2` |
| Smart Industry Engineering | 1 | `II230` → `II230` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Smart Industry Engineering | 2 | `06230` → `II230` | `PDS0-2021\|2` → `PDS0-2025\|2` |
| Sociologia | 1 | `TP123` → `TP123` | `PDS0-2025\|1, TP123P0004\|1, TP123P0003\|1` → `PDS0-2026\|1` |
| Sociologia | 2 | `03123` → `TP123` | `PDS0-2019\|2, 03123P0002\|2, 03123P0004\|2, 03123P0001\|2, 03123P0003\|2` → `PDS0-2025\|2` |
| Sociologia | 3 | `03123` → `03123` | `PDS0-2019\|3, 03123P0002\|3, 03123P0004\|3, 03123P0001\|3, 03123P0003\|3` → `PDS0-2019\|3, 03123P0004\|3, 03123P0003\|3` |
| Sociologia del Cambiamento Ambientale e Digitale | 1 | `TP229` → `TP229` | `TP229P0006\|1, PDS0-2025\|1, TP229P0005\|1` → `TP229P0006\|1, PDS0-2026\|1, TP229P0005\|1` |
| Storia e Critica D'arte | 1 | `SP224` → `SP224` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Storia e Critica D'arte | 2 | `03224` → `SP224` | `PDS0-2016\|2` → `PDS0-2025\|2` |
| Tecniche Erboristiche | 1 | `FR121` → `FR121` | `PDS0-2025\|1` → `PDS0-2026\|1` |
| Tecniche Erboristiche | 2 | `07121` → `FR121` | `PDS0-2020\|2` → `PDS0-2025\|2` |
| Tecniche per L'edilizia e il Territorio | 1 | `06129` → `06129` | `PDS0-2023\|1` → `PDS0-2026\|1` |

### Anni rimossi da livePrograms (119; 34 programmi interi)

Restano disponibili in modalità manuale. Codici originali (scuola + corso + anno2) conservati per un eventuale ripristino quando gli orari 2026/27 verranno pubblicati.

| Corso | scuola | Anno | corso originale | anno2 originale | Motivo |
|---|---|---|---|---|---|
| Biologia (intero) | 300389 | 1 | `CB221` | `CB221P0001\|1, CB221P0002\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Biologia (intero) | 300389 | 2 | `05221` | `05221P0001\|2, 05221P0002\|2` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Chimica (magistrale) (intero) | 300389 | -1 | `CB124` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Chimica (magistrale) (intero) | 300389 | 1 | `CB124` | `PDS0-2025\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Chimica (magistrale) (intero) | 300389 | 2 | `05223` | `05223P0001\|2, 05223P0002\|2` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Chimica (triennale) (intero) | 300389 | 1 | `CB223` | `CB223P0001\|1, CB223P0002\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Chimica (triennale) (intero) | 300389 | 2 | `05124` | `PDS0-2023\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Chimica (triennale) (intero) | 300389 | 3 | `05124` | `PDS0-2023\|3` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Chimica e Tecnologia Farmaceutiche | 300390 | 2 | `07604` | `PDS0-2023\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Corporate Communication e Media (intero) | 300401 | 2 | `03231` | `PDS0-2017\|2, 03231P0002\|2, 03231P0001\|2` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Corso di Formazione per Infermieri di Famiglia O di Comunita' (intero) | (nessuna) | 1 | `10P08` | `PDS0-2025\|1` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Discipline delle Arti Visive, della Musica e dello Spettacolo | 300398 | -1 | `SP124` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Economia Aziendale (intero) | 300399 | 1 | `SE121` | `PDS0-2025\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Economia Aziendale (intero) | 300399 | 2 | `02121` | `PDS0-2016\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Economia Aziendale (intero) | 300399 | 3 | `02121` | `02121P0002\|3, 02121P0003\|3, 02121P0004\|3` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Economia e Commercio (intero) | 300399 | 1 | `SE124` | `SE124P0004\|1, SE124P0003\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Economia e Commercio (intero) | 300399 | 2 | `02124` | `02124P0004\|2, 02124P0003\|2, 02124Libera\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Economia e Commercio (intero) | 300399 | 3 | `02124` | `02124P0004\|3, 02124P0003\|3` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Economia e Management | 300639 | -1 | `SA127` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Economia Governo e Amministrazione (intero) | 300399 | 1 | `SE231` | `SE231P0001\|1, SE231P0002\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Economia Governo e Amministrazione (intero) | 300399 | 2 | `02231` | `02231P0001\|2, 02231P0002\|2` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Farmacia | 300390 | 2 | `07603` | `PDS0-2023\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Filologia Moderna | 300404 | -1 | `03221` | `03221P0001\|-1, 03221P0002\|-1` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Filosofia (magistrale) | 300398 | -1 | `03226` | `PDS0-2021\|-1` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Filosofia (triennale) | 300398 | -1 | `SP125` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Fisica (magistrale) | 300391 | -1 | `FS126` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Fisioterapia (abilitante alla Prof. Sanit. di Fisioterapista) (intero) | 300397 | -1 | `10122` | `PDS0-2013\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Fisioterapia (abilitante alla Prof. Sanit. di Fisioterapista) (intero) | 300397 | 1 | `10122` | `PDS0-2013\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Fisioterapia (abilitante alla Prof. Sanit. di Fisioterapista) (intero) | 300397 | 2 | `10122` | `PDS0-2013\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Fisioterapia (abilitante alla Prof. Sanit. di Fisioterapista) (intero) | 300397 | 3 | `10122` | `PDS0-2013\|3` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Gestione e Valorizzazione degli Archivi e delle Biblioteche | 300398 | -1 | `03220` | `PDS0-2020\|-1` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Global Studies and Eu (intero) | 300639 | 1 | `SA225` | `SA225P0003\|1, SA225P0004\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Global Studies and Eu (intero) | 300639 | 2 | `12225` | `PDS0-2018\|2, 12225P0003\|2, 12225P0004\|2` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Infermieristica (abilitante alla Prof. Sanit. di Infermiere) (intero) | 300397 | -1 | `10121` | `PDS0-2013\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Infermieristica (abilitante alla Prof. Sanit. di Infermiere) (intero) | 300397 | 1 | `10121` | `PDS0-2013\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Infermieristica (abilitante alla Prof. Sanit. di Infermiere) (intero) | 300397 | 2 | `10121` | `PDS0-2013\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Infermieristica (abilitante alla Prof. Sanit. di Infermiere) (intero) | 300397 | 3 | `10121` | `PDS0-2013\|3` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Infermieristica (abilitante alla Prof. Sanit. di Infermiere) - Replica - A.o.u. S.giovanni di Dio e Ruggi D'aragona - Salerno (intero) | 300397 | -1 | `10127` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Infermieristica (abilitante alla Prof. Sanit. di Infermiere) - Replica - A.o.u. S.giovanni di Dio e Ruggi D'aragona - Salerno (intero) | 300397 | 1 | `10127` | `PDS0-2025\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Informatica - 05225 (intero) | 300392 | 2 | `05225` | `05225P0007\|2, 05225P0010\|2, 05225P0009\|2, 05225P0006\|2, 05225P0011\|2` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Ingegneria Civile (triennale) | 300393 | -1 | `IC121` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Ingegneria Civile per L'ambiente ed il Territorio | 300393 | -1 | `IC125` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Ingegneria Edile-architettura | 300393 | -1 | `IC601` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Ingegneria Edile-architettura | 300393 | 2 | `06601` | `PDS0-2017\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Ingegneria Informatica (magistrale) | 300638 | -1 | `IE127` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Lingue e Culture Straniere | 300404 | -1 | `43122` | `PDS0-2016\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Lingue e Letterature Moderne | 300404 | -1 | `43221` | `PDS0-2018\|-1, 43221P0004\|-1, 43221P0005\|-1, 43221P0003\|-1` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Matematica (magistrale) | 300396 | -1 | `MT123` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Medicina e Chirurgia (intero) | 300397 | 1 | `ME601` | `PDS0-2025\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Medicina e Chirurgia (intero) | 300397 | 2 | `10601` | `PDS0-2016\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Medicina e Chirurgia (intero) | 300397 | 3 | `10601` | `PDS0-2016\|3` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Medicina e Chirurgia (intero) | 300397 | 4 | `10601` | `PDS0-2016\|4` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Medicina e Chirurgia (intero) | 300397 | 5 | `10601` | `PDS0-2016\|5` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Medicina e Chirurgia (intero) | 300397 | 6 | `10601` | `PDS0-2016\|6` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Odontoiatria e Protesi Dentaria (intero) | 300397 | 1 | `ME602` | `PDS0-2025\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Odontoiatria e Protesi Dentaria (intero) | 300397 | 2 | `10602` | `PDS0-2023\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Odontoiatria e Protesi Dentaria (intero) | 300397 | 3 | `10602` | `PDS0-2023\|3` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Odontoiatria e Protesi Dentaria (intero) | 300397 | 4 | `10602` | `PDS0-2023\|4` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Odontoiatria e Protesi Dentaria (intero) | 300397 | 5 | `10602` | `PDS0-2023\|5` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Odontoiatria e Protesi Dentaria (intero) | 300397 | 6 | `10602` | `PDS0-2023\|6` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Ostetricia (abilitante alla Prof. Sanit. di Ostetrica/o) (intero) | 300397 | -1 | `10124` | `PDS0-2013\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Ostetricia (abilitante alla Prof. Sanit. di Ostetrica/o) (intero) | 300397 | 1 | `10124` | `PDS0-2013\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Ostetricia (abilitante alla Prof. Sanit. di Ostetrica/o) (intero) | 300397 | 2 | `10124` | `PDS0-2013\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Ostetricia (abilitante alla Prof. Sanit. di Ostetrica/o) (intero) | 300397 | 3 | `10124` | `PDS0-2013\|3` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Percorso 60 Cfu (intero) | (nessuna) | 1 | `60CFU` | `60\|1` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Percorso di Specializzazione per le Attivita' di Sostegno nella Scuola Primaria (intero) | (nessuna) | 1 | `SOS_PR` | `PDS0-2016\|1` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Percorso di Specializzazione per le Attivita' di Sostegno nella Scuola Secondaria di Secondo Grado (intero) | (nessuna) | 1 | `SOS_SUP` | `PDS0-2016\|1` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Percorso di Specializzazione per le Attivita' di Sostegno nella Scuola Dell'infanzia (intero) | (nessuna) | 1 | `SOS_INF` | `PDS0-2016\|1` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Percorso di Specializzazione per le Attivita' di Sostegno nella Scuola Secondaria di Primo Grado (intero) | (nessuna) | 1 | `SOS_MED` | `PDS0-2016\|1` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Psicologia di Comunita' per i Contesti Formativi, per il Benessere e per lo Sport (intero) | 300402 | 2 | `44225` | `PDS0-2023\|2` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Scienze Ambientali (magistrale) (intero) | 300389 | -1 | `CB127` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Ambientali (magistrale) (intero) | 300389 | 1 | `CB127` | `PDS0-2025\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Ambientali (magistrale) (intero) | 300389 | 2 | `05224` | `PDS0-2022\|2` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Scienze Ambientali (triennale) (intero) | 300389 | 1 | `CB224` | `PDS0-2025\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Ambientali (triennale) (intero) | 300389 | 2 | `05127` | `PDS0-2022\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Ambientali (triennale) (intero) | 300389 | 3 | `05127` | `PDS0-2022\|3` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Biologiche (intero) | 300389 | -1 | `CB128` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Biologiche (intero) | 300389 | 1 | `CB128` | `PDS0-2025\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Biologiche (intero) | 300389 | 2 | `05128` | `PDS0-2016\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Biologiche (intero) | 300389 | 3 | `05128` | `PDS0-2016\|3` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze dei Beni Culturali | 300398 | -1 | `SP128` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze del Servizio Sociale | 300663 | -1 | `TP129` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze del Turismo (intero) | 300399 | 1 | `SE129` | `PDS0-2025\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze del Turismo (intero) | 300399 | 2 | `02129` | `PDS0-2022\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze del Turismo (intero) | 300399 | 3 | `02129` | `PDS0-2022\|3` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Dell'amministrazione e Dell'organizzazione (intero) | 300399 | 1 | `SE122` | `PDS0-2025\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Dell'amministrazione e Dell'organizzazione (intero) | 300399 | 2 | `12122` | `PDS0-2018\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Dell'amministrazione e Dell'organizzazione (intero) | 300399 | 3 | `12122` | `PDS0-2018\|3, 12122Libera\|3` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Dell'educazione (triennale) | 300402 | -1 | `44124` | `44124P0003\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Dell'educazione (magistrale) | 300402 | -1 | `SU124` | `SU124P0004\|-1, SU124P0003\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze della Comunicazione | 300401 | -1 | `SC122` | `PDS0-2025\|-1, SC122P0011\|-1, SC122P0009\|-1, SC122P0001\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze della Formazione Primaria | 300402 | -1 | `44610` | `PDS0-2016\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze della Valutazione Motorio-sportiva e Tecniche di Analisi e Progettazione dello Sport per Disabili | 300402 | -1 | `44222` | `PDS0-2018\|-1` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Scienze delle Attivita' Motorie, Sportive e Dell'educazione Psicomotoria (triennale) | 300402 | -1 | `44125` | `PDS0-2017\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze delle Attivita' Motorie, Sportive e Dell'educazione Psicomotoria (magistrale) | 300402 | -1 | `SU125` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze e Nanotecnologie per la Sostenibilità | 300391 | -1 | `FS129` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Infermieristiche e Ostetriche (intero) | 300397 | 1 | `10221` | `PDS0-2022\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Infermieristiche e Ostetriche (intero) | 300397 | 2 | `10221` | `PDS0-2022\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Pedagogiche | 300402 | -1 | `44221` | `PDS0-2019\|-1` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Scienze Politiche e delle Relazioni Internazionali | 300401 | -1 | `SC121` | `PDS0-2025\|-1, SC121P0007\|-1, SC121P0005\|-1, SC121P0001\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Statistiche per la Finanza (intero) | 300399 | 1 | `SE224` | `SE224P0002\|1, SE224P0001\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Scienze Statistiche per la Finanza (intero) | 300399 | 2 | `02224` | `02224P0002\|2, 02224P0001\|2` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Sociologia | 300663 | -1 | `TP123` | `PDS0-2025\|-1, TP123P0004\|-1, TP123P0003\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Sociologia e Politiche per il Territorio (intero) | 300663 | 2 | `03229` | `03229P0006\|2, PDS0-2011\|2, 03229P0005\|2, 03229P0004\|2, 03229P0001\|2, 03229P0002\|2, 03229P0003\|2` | corso assente dal combo 2026 (e nessun candidato per etichetta verifica) |
| Statistica per i Big Data (intero) | 300399 | 1 | `SE128` | `PDS0-2025\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Statistica per i Big Data (intero) | 300399 | 2 | `02128` | `PDS0-2018\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Statistica per i Big Data (intero) | 300399 | 3 | `02128` | `PDS0-2018\|3` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Studi Diplomatici, Internazionali e sulla Sicurezza Globale (intero) | 300639 | -1 | `SA125` | `PDS0-2025\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Studi Diplomatici, Internazionali e sulla Sicurezza Globale (intero) | 300639 | 1 | `SA125` | `SA125P0002\|1, SA125P0001\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Studi Diplomatici, Internazionali e sulla Sicurezza Globale (intero) | 300639 | 2 | `12125` | `PDS0-2019\|2, 12125P0002\|2, 12125P0001\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Studi Diplomatici, Internazionali e sulla Sicurezza Globale (intero) | 300639 | 3 | `12125` | `PDS0-2019\|3, 12125P0002\|3, 12125P0001\|3` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Tecniche di Laboratorio Biomedico (abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico) (intero) | 300397 | -1 | `10126` | `PDS0-2024\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Tecniche di Laboratorio Biomedico (abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico) (intero) | 300397 | 1 | `10126` | `PDS0-2024\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Tecniche di Laboratorio Biomedico (abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico) (intero) | 300397 | 2 | `10126` | `PDS0-2024\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Tecniche di Radiologia Medica, per Immagini e Radioterapia (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica) (intero) | 300397 | -1 | `10125` | `PDS0-2017\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Tecniche di Radiologia Medica, per Immagini e Radioterapia (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica) (intero) | 300397 | 1 | `10125` | `PDS0-2017\|1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Tecniche di Radiologia Medica, per Immagini e Radioterapia (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica) (intero) | 300397 | 2 | `10125` | `PDS0-2017\|2` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Tecniche di Radiologia Medica, per Immagini e Radioterapia (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica) (intero) | 300397 | 3 | `10125` | `PDS0-2017\|3` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |
| Tecniche per L'edilizia e il Territorio | 300393 | -1 | `06129` | `PDS0-2023\|-1` | corso in combo 2026 ma 0 celle in tutte le 10 settimane 28-09..30-11-2026 |

## (senza scuola)

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Corso di Formazione per Infermieri di Famiglia O di Comunita' | `10P08` | 1 | 2 | 0 | 🟢 live orari (esami 0) |
| Ingegneria Meccanica | `06123` | 2,3 | 23 | 189 | ✅ live orari+esami |
| Percorso 60 Cfu | `60CFU` | 1 | 10 | 0 | 🟢 live orari (esami 0) |
| Percorso di Specializzazione per le Attivita' di Sostegno nella Scuola Primaria | `SOS_PR` | 1 | 10 | 0 | 🟢 live orari (esami 0) |
| Percorso di Specializzazione per le Attivita' di Sostegno nella Scuola Secondaria di Secondo Grado | `SOS_SUP` | 1 | 32 | 0 | 🟢 live orari (esami 0) |
| Percorso di Specializzazione per le Attivita' di Sostegno nella Scuola Dell'infanzia | `SOS_INF` | 1 | 5 | 0 | 🟢 live orari (esami 0) |
| Percorso di Specializzazione per le Attivita' di Sostegno nella Scuola Secondaria di Primo Grado | `SOS_MED` | 1 | 13 | 0 | 🟢 live orari (esami 0) |
| Pro3 | `2025-PRO3` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Storia e Critica D'arte | `SP224` | 1 | 13 | 0 | 🟢 live orari (esami 0) |

## 300389

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Biologia | `05221` | 2 | 13 | 54 | ✅ live orari+esami |
| Biologia | `CB221` | 1 | 10 | 35 | ✅ live orari+esami |
| Chimica | `05223` | 2 | 11 | 25 | ✅ live orari+esami |
| Chimica | `05124` | 2,3 | 23 | 120 | ✅ live orari+esami |
| Chimica | `CB124` | -1,1 | 12 | 52 | ✅ live orari+esami |
| Chimica | `CB223` | 1 | 17 | 29 | ✅ live orari+esami |
| Scienze Ambientali | `05224` | 2 | 9 | 21 | ✅ live orari+esami |
| Scienze Ambientali | `05127` | 2,3 | 18 | 88 | ✅ live orari+esami |
| Scienze Ambientali | `CB224` | 1 | 9 | 17 | ✅ live orari+esami |
| Scienze Ambientali | `CB127` | -1,1 | 12 | 52 | ✅ live orari+esami |
| Scienze Biologiche | `05128` | 2,3 | 18 | 82 | ✅ live orari+esami |
| Scienze Biologiche | `CB128` | -1,1 | 21 | 46 | ✅ live orari+esami |

## 300390

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Chimica e Tecnologia Farmaceutiche | `07604` | 2,3,4,5 | 54 | 144 | ✅ live orari+esami |
| Chimica e Tecnologia Farmaceutiche | `FR604` | 1 | 12 | 27 | ✅ live orari+esami |
| Farmaceutica e Nutraceutica Animale | `07123` | 2,3 | 25 | 64 | ✅ live orari+esami |
| Farmaceutica e Nutraceutica Animale | `FR123` | 1 | 9 | 23 | ✅ live orari+esami |
| Farmacia | `07603` | 2,3,4,5 | 55 | 156 | ✅ live orari+esami |
| Farmacia | `FR603` | 1 | 11 | 29 | ✅ live orari+esami |
| Gestione e Valorizzazione delle Risorse Agrarie e delle Aree Protette | `07122` | 2,3 | 26 | 76 | ✅ live orari+esami |
| Gestione e Valorizzazione delle Risorse Agrarie e delle Aree Protette | `FR122` | 1 | 9 | 26 | ✅ live orari+esami |
| Innovazioni per le Produzioni Agrarie Mediterranee | `07222` | 2 | 11 | 32 | ✅ live orari+esami |
| Innovazioni per le Produzioni Agrarie Mediterranee | `FR222` | 1 | 16 | 42 | ✅ live orari+esami |
| Tecniche Erboristiche | `07121` | 2,3 | 27 | 54 | ✅ live orari+esami |
| Tecniche Erboristiche | `FR121` | 1 | 10 | 31 | ✅ live orari+esami |

## 300391

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Fisica | `05226` | 2 | 21 | 40 | ✅ live orari+esami |
| Fisica | `05126` | 2,3 | 25 | 102 | ✅ live orari+esami |
| Fisica | `FS226` | 1 | 18 | 46 | ✅ live orari+esami |
| Fisica | `FS126` | -1,1 | 14 | 52 | ✅ live orari+esami |
| Nanotechnology and Physics for Sustainability | `FS227` | 1 | 6 | 0 | 🟢 live orari (esami 0) |
| Scienze e Nanotecnologie per la Sostenibilità | `05129` | 2,3 | 21 | 52 | ✅ live orari+esami |
| Scienze e Nanotecnologie per la Sostenibilità | `FS129` | -1,1 | 11 | 42 | ✅ live orari+esami |

## 300392

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Informatica | `88601` | 1,2 | 2 | 0 | 🟢 live orari (esami 0) |
| Informatica | `05121` | 2,3 | 66 | 286 | ✅ live orari+esami |
| Informatica - 05225 | `05225` | 2 | 29 | 220 | ✅ live orari+esami |
| Informatica - Nf225 | `NF225` | 1 | 43 | 124 | ✅ live orari+esami |
| Informatica | `NF121` | 1 | 44 | 86 | ✅ live orari+esami |
| Sicurezza Informatica e Tecnologie Cloud | `05227` | 2 | 8 | 45 | ✅ live orari+esami |
| Sicurezza Informatica e Tecnologie Cloud | `NF227` | 1 | 6 | 27 | ✅ live orari+esami |

## 300393

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Ingegneria Civile | `06121` | 2,3 | 27 | 128 | ✅ live orari+esami |
| Ingegneria Civile | `06221` | 2 | 24 | 132 | ✅ live orari+esami |
| Ingegneria Civile | `IC121` | -1,1 | 10 | 39 | ✅ live orari+esami |
| Ingegneria Civile | `IC221` | 1 | 20 | 57 | ✅ live orari+esami |
| Ingegneria Civile per L'ambiente ed il Territorio | `06125` | 2,3 | 27 | 125 | ✅ live orari+esami |
| Ingegneria Civile per L'ambiente ed il Territorio | `IC125` | -1,1 | 10 | 47 | ✅ live orari+esami |
| Ingegneria Edile-architettura | `06601` | 2,3,4,5 | 40 | 209 | ✅ live orari+esami |
| Ingegneria Edile-architettura | `IC601` | -1,1 | 9 | 52 | ✅ live orari+esami |
| Ingegneria per L'ambiente ed il Territorio | `06225` | 2 | 17 | 69 | ✅ live orari+esami |
| Ingegneria per L'ambiente ed il Territorio | `IC225` | 1 | 18 | 52 | ✅ live orari+esami |
| Tecniche per L'edilizia e il Territorio | `06129` | -1,1,2,3 | 24 | 119 | ✅ live orari+esami |

## 300395

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Ingegneria Alimentare | `06228` | 2 | 10 | 44 | ✅ live orari+esami |
| Ingegneria Alimentare | `II228` | 1 | 11 | 38 | ✅ live orari+esami |
| Ingegneria Chimica | `06222` | 2 | 8 | 73 | ✅ live orari+esami |
| Ingegneria Chimica | `06122` | 2,3 | 22 | 186 | ✅ live orari+esami |
| Ingegneria Chimica | `II122` | 1 | 8 | 45 | ✅ live orari+esami |
| Ingegneria Chimica | `II222` | 1 | 9 | 47 | ✅ live orari+esami |
| Ingegneria Elettronica | `06124` | 2,3 | 22 | 170 | ✅ live orari+esami |
| Ingegneria Elettronica | `06224` | 2 | 15 | 74 | ✅ live orari+esami |
| Ingegneria Elettronica | `II124` | 1 | 10 | 61 | ✅ live orari+esami |
| Ingegneria Elettronica | `II224` | 1 | 14 | 55 | ✅ live orari+esami |
| Ingegneria Gestionale | `06226` | 2 | 20 | 95 | ✅ live orari+esami |
| Ingegneria Gestionale | `06126` | 2,3 | 27 | 183 | ✅ live orari+esami |
| Ingegneria Gestionale | `II226` | 1 | 7 | 38 | ✅ live orari+esami |
| Ingegneria Gestionale | `II126` | 1 | 8 | 54 | ✅ live orari+esami |
| Ingegneria Meccanica | `06223` | 2 | 32 | 149 | ✅ live orari+esami |
| Ingegneria Meccanica | `II223` | 1 | 9 | 36 | ✅ live orari+esami |
| Ingegneria Meccanica | `II123` | 1 | 9 | 55 | ✅ live orari+esami |
| Smart Industry Engineering | `06230` | 2 | 10 | 65 | ✅ live orari+esami |
| Smart Industry Engineering | `II230` | 1 | 9 | 35 | ✅ live orari+esami |

## 300396

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Matematica | `05222` | 2 | 20 | 0 | 🟢 live orari (esami 0) |
| Matematica | `05123` | 2,3 | 35 | 1 | ✅ live orari+esami |
| Matematica | `MT222` | 1 | 14 | 0 | 🟢 live orari (esami 0) |
| Matematica | `MT123` | -1,1 | 16 | 0 | 🟢 live orari (esami 0) |

## 300397

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Fisioterapia (abilitante alla Prof. Sanit. di Fisioterapista) | `10122` | -1,1,2,3 | 21 | 0 | 🟢 live orari (esami 0) |
| Infermieristica (abilitante alla Prof. Sanit. di Infermiere) | `10121` | -1,1,2,3 | 33 | 0 | 🟢 live orari (esami 0) |
| Infermieristica (abilitante alla Prof. Sanit. di Infermiere) - Replica - A.o.u. S.giovanni di Dio e Ruggi D'aragona - Salerno | `10127` | -1,1 | 7 | 0 | 🟢 live orari (esami 0) |
| Medicina e Chirurgia | `ME601` | 1 | 12 | 0 | 🟢 live orari (esami 0) |
| Medicina e Chirurgia | `10601` | 2,3,4,5,6 | 50 | 0 | 🟢 live orari (esami 0) |
| Odontoiatria e Protesi Dentaria | `ME602` | 1 | 15 | 0 | 🟢 live orari (esami 0) |
| Odontoiatria e Protesi Dentaria | `10602` | 2,3,4,5,6 | 41 | 0 | 🟢 live orari (esami 0) |
| Ostetricia (abilitante alla Prof. Sanit. di Ostetrica/o) | `10124` | -1,1,2,3 | 26 | 0 | 🟢 live orari (esami 0) |
| Scienze Infermieristiche e Ostetriche | `10221` | 1,2 | 7 | 0 | 🟢 live orari (esami 0) |
| Tecniche di Laboratorio Biomedico (abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico) | `10126` | -1,1,2 | 18 | 1 | ✅ live orari+esami |
| Tecniche di Radiologia Medica, per Immagini e Radioterapia (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica) | `10125` | -1,1,2,3 | 19 | 0 | 🟢 live orari (esami 0) |

## 300398

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Archeologia e Culture Antiche | `03223` | 2 | 4 | 0 | 🟢 live orari (esami 0) |
| Archeologia e Culture Antiche | `SP223` | 1 | 2 | 0 | 🟢 live orari (esami 0) |
| Discipline delle Arti Visive, della Musica e dello Spettacolo | `43124` | 2,3 | 14 | 0 | 🟢 live orari (esami 0) |
| Discipline delle Arti Visive, della Musica e dello Spettacolo | `SP124` | -1,1 | 6 | 0 | 🟢 live orari (esami 0) |
| Filosofia | `03226` | -1,2 | 12 | 0 | 🟢 live orari (esami 0) |
| Filosofia | `03125` | 2,3 | 27 | 0 | 🟢 live orari (esami 0) |
| Filosofia | `SP226` | 1 | 16 | 0 | 🟢 live orari (esami 0) |
| Filosofia | `SP125` | -1,1 | 11 | 0 | 🟢 live orari (esami 0) |
| Gestione e Valorizzazione degli Archivi e delle Biblioteche | `03220` | -1,2 | 11 | 0 | 🟢 live orari (esami 0) |
| Gestione e Valorizzazione degli Archivi e delle Biblioteche | `SP220` | 1 | 6 | 0 | 🟢 live orari (esami 0) |
| Scienze dei Beni Culturali | `03128` | 2,3 | 38 | 0 | 🟢 live orari (esami 0) |
| Scienze dei Beni Culturali | `SP128` | -1,1 | 10 | 0 | 🟢 live orari (esami 0) |
| Scienze dello Spettacolo e della Produzione Multimediale | `43222` | 2 | 9 | 0 | 🟢 live orari (esami 0) |
| Scienze dello Spettacolo e della Produzione Multimediale | `SP222` | 1 | 2 | 0 | 🟢 live orari (esami 0) |
| Storia e Critica D'arte | `03224` | 2 | 13 | 0 | 🟢 live orari (esami 0) |

## 300399

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Economia | `SE222` | 1 | 24 | 0 | 🟢 live orari (esami 0) |
| Economia | `02222` | 2 | 14 | 0 | 🟢 live orari (esami 0) |
| Economia Aziendale | `02121` | 2,3 | 35 | 0 | 🟢 live orari (esami 0) |
| Economia Aziendale | `SE121` | 1 | 12 | 0 | 🟢 live orari (esami 0) |
| Economia e Commercio | `02124` | 2,3 | 20 | 0 | 🟢 live orari (esami 0) |
| Economia e Commercio | `SE124` | 1 | 11 | 0 | 🟢 live orari (esami 0) |
| Economia Governo e Amministrazione | `02231` | 2 | 6 | 0 | 🟢 live orari (esami 0) |
| Economia Governo e Amministrazione | `SE231` | 1 | 11 | 0 | 🟢 live orari (esami 0) |
| Scienze del Turismo | `02129` | 2,3 | 10 | 0 | 🟢 live orari (esami 0) |
| Scienze del Turismo | `SE129` | 1 | 5 | 0 | 🟢 live orari (esami 0) |
| Scienze Dell'amministrazione e Dell'organizzazione | `12122` | 2,3 | 21 | 0 | 🟢 live orari (esami 0) |
| Scienze Dell'amministrazione e Dell'organizzazione | `SE122` | 1 | 7 | 0 | 🟢 live orari (esami 0) |
| Scienze Statistiche per la Finanza | `02224` | 2 | 8 | 0 | 🟢 live orari (esami 0) |
| Scienze Statistiche per la Finanza | `SE224` | 1 | 3 | 0 | 🟢 live orari (esami 0) |
| Statistica per i Big Data | `02128` | 2,3 | 4 | 0 | 🟢 live orari (esami 0) |
| Statistica per i Big Data | `SE128` | 1 | 7 | 0 | 🟢 live orari (esami 0) |

## 300400

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Giurisprudenza | `SG601` | 1,2,3,4,5 | 130 | 23 | ✅ live orari+esami |
| Giurista D'impresa e delle Nuove Tecnologie | `01121` | 2,3 | 17 | 9 | ✅ live orari+esami |
| Giurista D'impresa e delle Nuove Tecnologie | `SG121` | 1 | 12 | 0 | 🟢 live orari (esami 0) |

## 300401

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Corporate Communication e Media | `03231` | 2 | 21 | 0 | 🟢 live orari (esami 0) |
| Corporate Communication, Marketing Innovation e Media Digitali | `SC231` | 1 | 18 | 0 | 🟢 live orari (esami 0) |
| Digital Marketing | `03232` | 2 | 7 | 0 | 🟢 live orari (esami 0) |
| Digital Marketing | `SC232` | 1 | 15 | 0 | 🟢 live orari (esami 0) |
| Management dei Sistemi Turistici per lo Sviluppo Sostenibile | `12228` | 2 | 5 | 0 | 🟢 live orari (esami 0) |
| Management dei Sistemi Turistici per lo Sviluppo Sostenibile | `SC228` | 1 | 11 | 0 | 🟢 live orari (esami 0) |
| Politiche Territoriali e Cooperazione Internazionale | `12226` | 2 | 10 | 0 | 🟢 live orari (esami 0) |
| Politiche Territoriali e Cooperazione Internazionale | `SC226` | 1 | 16 | 0 | 🟢 live orari (esami 0) |
| Scienze della Comunicazione | `03122` | 2,3 | 32 | 0 | 🟢 live orari (esami 0) |
| Scienze della Comunicazione | `SC122` | -1,1 | 18 | 0 | 🟢 live orari (esami 0) |
| Scienze Politiche e delle Relazioni Internazionali | `12121` | 2,3 | 40 | 0 | 🟢 live orari (esami 0) |
| Scienze Politiche e delle Relazioni Internazionali | `SC121` | -1,1 | 18 | 0 | 🟢 live orari (esami 0) |

## 300402

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Psicologia Dell'intervento Nei Contesti Clinici,sportivi e Formativi | `SU225` | 1 | 4 | 0 | 🟢 live orari (esami 0) |
| Psicologia di Comunita' per i Contesti Formativi, per il Benessere e per lo Sport | `44225` | 2 | 10 | 0 | 🟢 live orari (esami 0) |
| Scienze Dell'educazione | `44124` | -1,2,3 | 34 | 0 | 🟢 live orari (esami 0) |
| Scienze Dell'educazione | `SU124` | -1,1 | 19 | 0 | 🟢 live orari (esami 0) |
| Scienze Dell'educazione Permanente e della Formazione Continua | `44224` | 2 | 8 | 0 | 🟢 live orari (esami 0) |
| Scienze Dell'educazione Permanente e della Formazione Continua | `SU224` | 1 | 12 | 0 | 🟢 live orari (esami 0) |
| Scienze della Formazione Primaria | `44610` | -1,1,2,3,4,5 | 53 | 0 | 🟢 live orari (esami 0) |
| Scienze della Valutazione Motorio-sportiva e Tecniche di Analisi e Progettazione dello Sport per Disabili | `44222` | -1,2 | 8 | 0 | 🟢 live orari (esami 0) |
| Scienze della Valutazione Motorio-sportiva e Tecniche di Analisi e Progettazione dello Sport per Disabili | `SU222` | 1 | 10 | 0 | 🟢 live orari (esami 0) |
| Scienze delle Attivita' Motorie, Sportive e Dell'educazione Psicomotoria | `44125` | -1,2,3 | 29 | 0 | 🟢 live orari (esami 0) |
| Scienze delle Attivita' Motorie, Sportive e Dell'educazione Psicomotoria | `SU125` | -1,1 | 13 | 0 | 🟢 live orari (esami 0) |
| Scienze Pedagogiche | `44221` | -1,2 | 8 | 0 | 🟢 live orari (esami 0) |
| Scienze Pedagogiche | `SU221` | 1 | 12 | 0 | 🟢 live orari (esami 0) |

## 300404

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Filologia Moderna | `03221` | -1,2 | 15 | 0 | 🟢 live orari (esami 0) |
| Filologia Moderna | `TU221` | 1 | 33 | 0 | 🟢 live orari (esami 0) |
| Filologia, Letterature e Storia Dell'antichità | `03222` | 2 | 18 | 0 | 🟢 live orari (esami 0) |
| Filologia, Letterature e Storia Dell'antichità | `TU222` | 1 | 14 | 0 | 🟢 live orari (esami 0) |
| Lettere | `03126` | 2,3 | 60 | 0 | 🟢 live orari (esami 0) |
| Lettere | `TU126` | 1 | 27 | 0 | 🟢 live orari (esami 0) |
| Lingue e Culture Straniere | `43122` | -1,2,3 | 97 | 0 | 🟢 live orari (esami 0) |
| Lingue e Culture Straniere | `TU122` | 1 | 58 | 0 | 🟢 live orari (esami 0) |
| Lingue e Letterature Moderne | `43221` | -1,2 | 53 | 0 | 🟢 live orari (esami 0) |
| Lingue e Letterature Moderne | `TU241` | 1 | 44 | 0 | 🟢 live orari (esami 0) |
| Linguistica e Didattica Dell'italiano nel Contesto Internazionale | `03240` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Linguistica e Didattica Dell'italiano nel Contesto Internazionale | `TU240` | 1 | 6 | 0 | 🟢 live orari (esami 0) |

## 300638

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Electrical Engineering for Digital Energy | `06233` | 2 | 8 | 39 | ✅ live orari+esami |
| Electrical Engineering for Digital Energy | `IE233` | 1 | 8 | 46 | ✅ live orari+esami |
| Information Engineering for Digital Medicine | `06232` | 2 | 12 | 44 | ✅ live orari+esami |
| Information Engineering for Digital Medicine | `IE232` | 1 | 10 | 50 | ✅ live orari+esami |
| Ingegneria Dell'informazione per la Medicina Digitale | `06128` | 2,3 | 21 | 125 | ✅ live orari+esami |
| Ingegneria Dell'informazione per la Medicina Digitale | `IE128` | 1 | 12 | 52 | ✅ live orari+esami |
| Ingegneria Informatica | `06227` | 2 | 48 | 228 | ✅ live orari+esami |
| Ingegneria Informatica | `06127` | 2,3 | 40 | 190 | ✅ live orari+esami |
| Ingegneria Informatica | `IE227` | 1 | 18 | 61 | ✅ live orari+esami |
| Ingegneria Informatica | `IE127` | -1,1 | 16 | 64 | ✅ live orari+esami |

## 300639

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Consulenza e Management Aziendale | `02221` | 2 | 19 | 0 | 🟢 live orari (esami 0) |
| Consulenza e Management Aziendale | `SA221` | 1 | 19 | 0 | 🟢 live orari (esami 0) |
| Data Science e Gestione Dell'innovazione | `02228` | 2 | 5 | 0 | 🟢 live orari (esami 0) |
| Data Science e Gestione Dell'innovazione | `SA228` | 1 | 10 | 0 | 🟢 live orari (esami 0) |
| Economia e Management | `02127` | 2,3 | 39 | 0 | 🟢 live orari (esami 0) |
| Economia e Management | `SA127` | -1,1 | 24 | 0 | 🟢 live orari (esami 0) |
| Global Studies and Eu | `12225` | 2 | 17 | 0 | 🟢 live orari (esami 0) |
| Global Studies and Eu | `SA225` | 1 | 18 | 0 | 🟢 live orari (esami 0) |
| Studi Diplomatici, Internazionali e sulla Sicurezza Globale | `12125` | 2,3 | 35 | 0 | 🟢 live orari (esami 0) |
| Studi Diplomatici, Internazionali e sulla Sicurezza Globale | `SA125` | -1,1 | 17 | 0 | 🟢 live orari (esami 0) |

## 300663

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Management delle Attivita' Sportive e Motorie per il Benessere Sociale | `12227` | 2 | 6 | 8 | ✅ live orari+esami |
| Management delle Attivita' Sportive e Motorie per il Benessere Sociale | `TP227` | 1 | 14 | 12 | ✅ live orari+esami |
| Organizzazione, Valutazione e Supervisione dei Servizi Sociali | `TP230` | 1 | 10 | 5 | ✅ live orari+esami |
| Scienze del Servizio Sociale | `03129` | 2,3 | 19 | 16 | ✅ live orari+esami |
| Scienze del Servizio Sociale | `TP129` | -1,1 | 19 | 18 | ✅ live orari+esami |
| Sociologia | `03123` | 2,3 | 25 | 12 | ✅ live orari+esami |
| Sociologia | `TP123` | -1,1 | 16 | 9 | ✅ live orari+esami |
| Sociologia del Cambiamento Ambientale e Digitale | `TP229` | 1 | 16 | 6 | ✅ live orari+esami |
| Sociologia e Politiche per il Territorio | `03229` | 2 | 11 | 7 | ✅ live orari+esami |
