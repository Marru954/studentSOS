# Tor Vergata — copertura corsi (verificata via combo.php + grid/test_call)

Generato ri-verificando ogni corso contro gli endpoint reali. Totale corsi (escl. Semestre Filtro): **90** · orari live: **71** · esami live: **73**.

Legenda: ✅ orari+esami · 🟢 solo orari · ⚪ manuale (con motivo). I codici (`scuola`/`corso`/`anno2`) vengono dal portale, mai inventati.

## Ri-verifica anno accademico 2026/27 — 2026-09-25

Sorgente: GET reale `https://easyutv.uniroma2.it/agendaweb/combo.php?sw=ec_&aa=2026&page=corsi` + POST reali `grid_call.php` (anno=2026, settimane 28-09, 12-10, 09-11, 07-12-2026 e 01-03-2027: basta una con `celle` non vuote) e `test_call.php` (appelli 01-09-2026..30-09-2027; se vuoto, controllo sul 2025/26 per distinguere "calendario non ancora pubblicato" da "codice inesistente"). Nessun codice inventato: ogni riga sotto è stata restituita dal combo 2026 e confermata da una risposta non vuota.

- Programmi (livePrograms) prima: **70** · dopo: **44** (rimossi interamente: **26**)
- Anni-sorgente orario prima: **168** · dopo: **111** (invariati verificati: 102, ricatturati/aggiornati: 9, rimossi: 57)
- Programmi rimasti live solo in parte (alcuni anni rimossi): **0**
- Le tabelle per scuola più sotto sono lo **storico della verifica 2025/26** e NON sono state rigenerate: fa fede questa sezione.

### Corsi live verificati (2026/27)

| Corso | scuola | corso (per anno) | Anni live | celle/anno | appelli/anno | Stato |
|---|---|---|---|---|---|---|
| Informatica (triennale) | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`H02` 2:`H02` 3:`H02` | 1,2,3 | 12,6,7 | 5,3,(27) | ✅ orari+esami |
| Astrophysics and Space Science | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`AA3` 2:`AA3` | 1,2 | 7,9 | 1,2 | ✅ orari+esami |
| Bioinformatica | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`J61` 2:`J61` | 1,2 | 21,6 | 2,3 | ✅ orari+esami |
| Biologia Cellulare, Molecolare e Ricerca Biomedica | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`AB7` | 1 | 11 | 1 | ✅ orari+esami |
| Biotechnology for Industry and Health | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`AB6` | 1 | 12 | 2 | ✅ orari+esami |
| Biotecnologie | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`H04` 2:`H04` 3:`H04` | 1,2,3 | 17,10,10 | 1,1,(37) | ✅ orari+esami |
| Biotecnologie Agrarie | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`AB3` | 1 | 1 | (3) | 🕓 orari+esami (appelli 2026/27 non ancora pubblicati; verificati sul 2025/26) |
| Chemical Nano-Engineering | FacoltadiIngegneria | 1:`W46` 2:`W46` | 1,2 | 1,17 | 0,(6) | 🕓 orari+esami (appelli 2026/27 non ancora pubblicati; verificati sul 2025/26) |
| Chimica (magistrale) | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`J63` 2:`J63` | 1,2 | 26,9 | 5,1 | ✅ orari+esami |
| Chimica (triennale) | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`H05` 2:`H05` 3:`H05` | 1,2,3 | 20,11,8 | 1,5,2 | ✅ orari+esami |
| Chimica Applicata | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`H06` 2:`H06` 3:`H06` | 1,2,3 | 20,8,9 | 2,4,(31) | ✅ orari+esami |
| Engineering Sciences | FacoltadiIngegneria | 1:`K73` 2:`K73` 3:`K73` | 1,2,3 | 10,9,12 | (56),(45),1 | ✅ orari+esami |
| Fisica (magistrale) | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`J64` 2:`J64` | 1,2 | 82,29 | 3,3 | ✅ orari+esami |
| Fisica (triennale) | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`H08` 2:`H08` 3:`H08` | 1,2,3 | 21,11,13 | 3,4,2 | ✅ orari+esami |
| ICT and Internet Engineering - Ingegneria di Internet e delle Tecnologie per l'Informazione e la Comunicazione | FacoltadiIngegneria | 1:`Q66` 2:`Q66` | 1,2 | 16,27 | (62),(52) | 🕓 orari+esami (appelli 2026/27 non ancora pubblicati; verificati sul 2025/26) |
| Informatica (magistrale) | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`J65` 2:`J65` | 1,2 | 3,3 | 2,1 | ✅ orari+esami |
| Ingegneria Civile | FacoltadiIngegneria | 1:`H30` 2:`H30` | 1,2 | 22,28 | (16),(29) | 🕓 orari+esami (appelli 2026/27 non ancora pubblicati; verificati sul 2025/26) |
| Ingegneria Civile e Ambientale | FacoltadiIngegneria | 1:`K72` 2:`K72` 3:`K72` | 1,2,3 | 42,14,9 | 25,(65),(65) | ✅ orari+esami |
| Ingegneria dell'Automazione | FacoltadiIngegneria | 1:`H31` 2:`H31` | 1,2 | 29,26 | (56),(78) | 🕓 orari+esami (appelli 2026/27 non ancora pubblicati; verificati sul 2025/26) |
| Ingegneria dell'Edilizia | FacoltadiIngegneria | 1:`H20` 2:`H20` 3:`H20` | 1,2,3 | 8,21,15 | 12,6,(32) | ✅ orari+esami |
| Ingegneria di Internet | FacoltadiIngegneria | 1:`P65` 2:`P65` 3:`P65` | 1,2,3 | 31,11,13 | 24,(34),(39) | ✅ orari+esami |
| Ingegneria e Tecniche del Costruire | FacoltadiIngegneria | 1:`H32` 2:`H32` | 1,2 | 17,12 | (23),(18) | 🕓 orari+esami (appelli 2026/27 non ancora pubblicati; verificati sul 2025/26) |
| Ingegneria Edile-architettura | FacoltadiIngegneria | 1:`J53` 2:`J53` 3:`J53` 4:`J53` 5:`J53` | 1,2,3,4,5 | 9,6,9,7,13 | 12,(42),(18),(25),(13) | ✅ orari+esami |
| Ingegneria Elettronica (magistrale) | FacoltadiIngegneria | 1:`H33` 2:`H33` | 1,2 | 14,31 | (23),(22) | 🕓 orari+esami (appelli 2026/27 non ancora pubblicati; verificati sul 2025/26) |
| Ingegneria Elettronica (triennale) | FacoltadiIngegneria | 1:`H21` 2:`H21` 3:`H21` | 1,2,3 | 39,10,11 | 25,(35),(45) | ✅ orari+esami |
| Ingegneria Energetica | FacoltadiIngegneria | 1:`H34` 2:`H34` | 1,2 | 15,15 | (21),(25) | 🕓 orari+esami (appelli 2026/27 non ancora pubblicati; verificati sul 2025/26) |
| Ingegneria Gestionale (in Modalità Prevalentemente a Distanza) | FacoltadiIngegneria | 1:`V89` 2:`V89` 3:`V89` | 1,2,3 | 8,5,23 | 12,(57),(42) | ✅ orari+esami |
| Ingegneria Gestionale (magistrale) | FacoltadiIngegneria | 1:`AC1` 2:`AC1` | 1,2 | 49,56 | (71),2 | ✅ orari+esami |
| Ingegneria Gestionale (triennale) | FacoltadiIngegneria | 1:`U09` 2:`U09` 3:`U09` | 1,2,3 | 36,19,52 | 38,(93),(118) | ✅ orari+esami |
| Ingegneria Informatica (magistrale) | FacoltadiIngegneria | 1:`H36` 2:`H36` | 1,2 | 13,30 | (67),(86) | 🕓 orari+esami (appelli 2026/27 non ancora pubblicati; verificati sul 2025/26) |
| Ingegneria Informatica (triennale) | FacoltadiIngegneria | 1:`U08` 2:`U08` 3:`U08` | 1,2,3 | 16,11,20 | 14,(59),(74) | ✅ orari+esami |
| Ingegneria Meccanica (magistrale) | FacoltadiIngegneria | 1:`H37` 2:`H37` | 1,2 | 36,31 | (46),1 | ✅ orari+esami |
| Ingegneria Meccanica (triennale) | FacoltadiIngegneria | 1:`H25` 2:`H25` 3:`H25` | 1,2,3 | 32,17,20 | 18,(68),(79) | ✅ orari+esami |
| Ingegneria Medica (magistrale) | FacoltadiIngegneria | 1:`H38` 2:`H38` | 1,2 | 13,28 | (39),(37) | 🕓 orari+esami (appelli 2026/27 non ancora pubblicati; verificati sul 2025/26) |
| Ingegneria Medica (triennale) | FacoltadiIngegneria | 1:`H26` 2:`H26` 3:`H26` | 1,2,3 | 42,10,13 | 25,1,(75) | ✅ orari+esami |
| Ingegneria per l'Ambiente e il Territorio | FacoltadiIngegneria | 1:`H29` 2:`H29` | 1,2 | 10,17 | (13),(7) | 🕓 orari+esami (appelli 2026/27 non ancora pubblicati; verificati sul 2025/26) |
| Ingegneria per l'Energia e l'Ambiente | FacoltadiIngegneria | 1:`X63` 2:`X63` 3:`X63` | 1,2,3 | 40,16,16 | 24,(55),(54) | ✅ orari+esami |
| Matematica | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`H11` 2:`H11` 3:`H11` | 1,2,3 | 13,13,22 | 1,1,2 | ✅ orari+esami |
| Mechatronics Engineering | FacoltadiIngegneria | 1:`T20` 2:`T20` | 1,2 | 25,11 | 1,(53) | ✅ orari+esami |
| Metodi e Modelli per Data Science | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`AA2` 2:`AA2` 3:`AA2` | 1,2,3 | 5,17,2 | (71),(34),(11) | 🕓 orari+esami (appelli 2026/27 non ancora pubblicati; verificati sul 2025/26) |
| Pharmacy | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`AA4` 2:`AA4` 3:`AA4` 4:`AA4` 5:`AA4` | 1,2,3,4,5 | 5,8,3,9,6 | 10,7,4,7,2 | ✅ orari+esami |
| Scienza dei Materiali | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`AB1` 2:`AB1` 3:`AB1` | 1,2,3 | 13,10,13 | (15),0,(1) | 🕓 orari+esami (appelli 2026/27 non ancora pubblicati; verificati sul 2025/26) |
| Scienza e Tecnologia dei Materiali | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`AA1` 2:`AA1` | 1,2 | 10,8 | 2,1 | ✅ orari+esami |
| Scienze Biologiche | FacoltadiScienzeMatematiche-FisicheeNaturali | 1:`H03` 2:`H03` 3:`H03` | 1,2,3 | 29,16,7 | 2,(64),2 | ✅ orari+esami |

Nota appelli: numero senza parentesi = appelli nella finestra 2026/27; tra parentesi = solo nella finestra 2025/26 (calendario nuovo non ancora pubblicato).

### Codici ricatturati (9 anni)

| Corso | Anno | corso prima → dopo | anno2 prima → dopo |
|---|---|---|---|
| Chimica (triennale) | 1 | `H05` → `H05` | `comune\|1` → `comune\|1, comune_canaleA-L\|1, comune_canaleM-Z\|1` |
| Fisica (magistrale) | 1 | `J64` → `J64` | `astrophysicsandspacescience\|1, fisicadellaatmosferaedelclimaemeteorologia\|1, fisicaelettronicaecibernetica\|1, fisicafisicadeibiosistemi\|1, fisicafisicateorica\|1, fisicastrutturadellamateria\|1, physicsofcomplexsystemsandbigdata\|1, physicsoffundamentalinteractionsandexperimentaltechniques\|1` → `astrophysicsandspacescience\|1, fisicabiofisicaefisicamedica\|1, fisicadellaatmosferaedelclimaemeteorologia\|1, fisicaelettronicaecibernetica\|1, fisicafisicateorica\|1, fisicastrutturadellamateria\|1, physicsofcomplexsystemsandbigdata\|1, physicsoffundamentalinteractionsandexperimentaltechniques\|1` |
| Ingegneria Elettronica (magistrale) | 1 | `H33` → `H33` | `indirizzoaelettronicaperlenergia\|1, indirizzobelettronicaperlindustria\|1, indirizzocelettronicaperlasaluteelambiente\|1, indirizzodelettronicaperlospazioelasicurezza\|1, indirizzoeelettronicaperletelecomunicazionielamultimedialita\|1` → `percorsoaelettronicaperlenergia\|1, percorsobelettronicaperlindustria\|1, percorsocelettronicaperlamedicina\|1, percorsodelettronicaperlospazioelasicurezza\|1, percorsoeelettronicaperildigitalchipdesign\|1, percorsofelettronicaperlfintelligenzaartificiale\|1` |
| Ingegneria Gestionale (magistrale) | 1 | `AC1` → `AC1` | `dataanalytics\|1, direzionedimpresa\|1, gestionedellaproduzionealimentare\|1, ingegneriadelleimpresedigitali\|1, ingegneriagestionaledelletelecomunicazioni\|1, sistemidiproduzione\|1, sistemilogisticieditrasporto\|1, technologyandnewfrontiermanagement\|1` → `dataanalytics\|1, direzionedimpresa\|1, ingegneriadelleimpresedigitali\|1, ingegneriagestionaledelletelecomunicazioni\|1, sistemidiproduzione\|1, sistemilogisticieditrasporto\|1, technologyandnewfrontiermanagement\|1` |
| Ingegneria Informatica (magistrale) | 1 | `H36` → `H36` | `computerandinformationengineeringindirizzocybersecurity\|1, computerandinformationengineeringindirizzogenerale\|1, computerandinformationengineeringindirizzosystemsandsoftwareengineering\|1, datascienceandengineering\|1` → `artificialintelligenceanddataengineering\|1, computerandinformationengineeringindirizzocybersecurity\|1, computerandinformationengineeringindirizzogenerale\|1, computerandinformationengineeringindirizzosystemsandsoftwareengineering\|1` |
| Ingegneria Meccanica (magistrale) | 2 | `H37` → `H37` | `ingegneriadiprocesso\|2, ingegneriadiprodotto\|2` → `ingegneriadeiprocessisostenibili\|2, ingegneriadiprodotto\|2` |
| Mechatronics Engineering | 2 | `T20` → `T20` | `computionalmethods\|2, electromechanics\|2, electronics\|2, mechatronicsystemsandictinterconnectedelectricvehiclesengineering\|2, mechatronicsystemsandictlearningandcommunication\|2, thermo-mechanics\|2` → `computionalmethods\|2, electromechanics\|2, electronicsanddigitaltransition\|2, mechanicsanddigitaltransition\|2, mechatronicsystemsandictinterconnectedelectricvehiclesengineering\|2, mechatronicsystemsandictlearningandcommunication\|2` |
| Scienza dei Materiali | 2 | `H10` → `AB1` | `comune\|2` → `comune\|2` |
| Scienza dei Materiali | 3 | `H10` → `AB1` | `comune\|3` → `comune\|3` |

### Anni rimossi da livePrograms (57; 26 programmi interi)

Restano disponibili in modalità manuale. Codici originali (scuola + corso + anno2) conservati per un eventuale ripristino quando gli orari 2026/27 verranno pubblicati.

| Corso | scuola | Anno | corso originale | anno2 originale | Motivo |
|---|---|---|---|---|---|
| Archeologia, Filologia, Letterature e Storia dell'Antichità (intero) | FacoltadiLettereeFilosofia | 1 | `K80/LM-2 - M93/LM-15` | `lm-15\|1, lm-2\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Archeologia, Filologia, Letterature e Storia dell'Antichità (intero) | FacoltadiLettereeFilosofia | 2 | `K80/LM-2 - M93/LM-15` | `lm-15\|2, lm-2\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Art History in Rome, From Late Antiquity to the Present (intero) | FacoltadiLettereeFilosofia | 1 | `T22` | `comune\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Art History in Rome, From Late Antiquity to the Present (intero) | FacoltadiLettereeFilosofia | 2 | `T22` | `comune\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Beni Culturali (archeologici, Artistici, Musicali e dello Spettacolo) (intero) | FacoltadiLettereeFilosofia | 1 | `L85` | `archeologia\|1, benistorico-artistici\|1, generico\|1, musica\|1, spettacolo\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Beni Culturali (archeologici, Artistici, Musicali e dello Spettacolo) (intero) | FacoltadiLettereeFilosofia | 2 | `L85` | `archeologia\|2, benistorico-artistici\|2, generico\|2, musica\|2, spettacolo\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Beni Culturali (archeologici, Artistici, Musicali e dello Spettacolo) (intero) | FacoltadiLettereeFilosofia | 3 | `L85` | `archeologia\|3, benistorico-artistici\|3, generico\|3, musica\|3, spettacolo\|3` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Biotechnology - Biotecnologie (intero) | FacoltadiScienzeMatematiche-FisicheeNaturali | 2 | `Q67` | `appliedbiotechnology\|2, clinicalresearch\|2` | corso assente dal combo 2026 |
| Comunicazione e Intelligenza Artificiale (intero) | FacoltadiLettereeFilosofia | 1 | `AB5` | `editoriagiornalismocomunicazione\|1, linguaggicomunicazioneintelligenzaartificiale\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Conservazione e Restauro dei Beni Culturali (abilitante Ai Sensi del D.Lgs N.42/2004) (intero) | FacoltadiLettereeFilosofia | 1 | `M91` | `comune\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Conservazione e Restauro dei Beni Culturali (abilitante Ai Sensi del D.Lgs N.42/2004) (intero) | FacoltadiLettereeFilosofia | 2 | `M91` | `comune\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Conservazione e Restauro dei Beni Culturali (abilitante Ai Sensi del D.Lgs N.42/2004) (intero) | FacoltadiLettereeFilosofia | 3 | `M91` | `comune\|3` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Conservazione e Restauro dei Beni Culturali (abilitante Ai Sensi del D.Lgs N.42/2004) (intero) | FacoltadiLettereeFilosofia | 4 | `M91` | `comune\|4` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Conservazione e Restauro dei Beni Culturali (abilitante Ai Sensi del D.Lgs N.42/2004) (intero) | FacoltadiLettereeFilosofia | 5 | `M91` | `comune\|5` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Digital Humanities: Comunicazione, Lingue, Patrimonio Culturale (intero) | FacoltadiLettereeFilosofia | 1 | `AA9` | `orientamentounico\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Digital Humanities: Comunicazione, Lingue, Patrimonio Culturale (intero) | FacoltadiLettereeFilosofia | 2 | `AA9` | `comunicazionedigitale\|2, linguenelleradigitale\|2, patrimoniocuturaledigitale\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Filologia Moderna (intero) | FacoltadiLettereeFilosofia | 1 | `AB4` | `italianistica\|1, linguistica\|1, scienzedeltesto\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Filosofia (magistrale) (intero) | FacoltadiLettereeFilosofia | 1 | `H59` | `filosofia\|1, filosofiapoliticaeconomia\|1, formedellarazionalitapercorsostudentihalle\|1, formedellarazionalitapercorsostudentitv\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Filosofia (magistrale) (intero) | FacoltadiLettereeFilosofia | 2 | `H59` | `filosofia\|2, filosofiapoliticaeconomia\|2, formedellarazionalitapercorsostudentihalle\|2, formedellarazionalitapercorsostudentitv\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Filosofia (triennale) (intero) | FacoltadiLettereeFilosofia | 1 | `H42` | `comune\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Filosofia (triennale) (intero) | FacoltadiLettereeFilosofia | 2 | `H42` | `comune\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Filosofia (triennale) (intero) | FacoltadiLettereeFilosofia | 3 | `H42` | `comune\|3` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Letteratura Italiana, Filologia Moderna e Linguistica (intero) | FacoltadiLettereeFilosofia | 2 | `H53/LM-14 - M94/LM-39` | `filologico\|2, letterario\|2, linguistico-glottodidatticoglottodidattico\|2, linguistico-glottodidatticolinguistico\|2` | corso assente dal combo 2026 |
| Lingua e Cultura Italiana a Stranieri per l'Accoglienza e l'Internazionalizzazione (intero) | FacoltadiLettereeFilosofia | 1 | `V86` | `comune\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Lingua e Cultura Italiana a Stranieri per l'Accoglienza e l'Internazionalizzazione (intero) | FacoltadiLettereeFilosofia | 2 | `V86` | `comune\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Lingue e Letterature Europee e Americane (intero) | FacoltadiLettereeFilosofia | 1 | `H56` | `comune\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Lingue e Letterature Europee e Americane (intero) | FacoltadiLettereeFilosofia | 2 | `H56` | `comune\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Lingue e Letterature Moderne (intero) | FacoltadiLettereeFilosofia | 1 | `H44` | `comune\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Lingue e Letterature Moderne (intero) | FacoltadiLettereeFilosofia | 2 | `H44` | `comune\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Lingue e Letterature Moderne (intero) | FacoltadiLettereeFilosofia | 3 | `H44` | `comune\|3` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Lingue nella Società dell'Informazione (intero) | FacoltadiLettereeFilosofia | 1 | `H45` | `comune\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Lingue nella Società dell'Informazione (intero) | FacoltadiLettereeFilosofia | 2 | `H45` | `comune\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Lingue nella Società dell'Informazione (intero) | FacoltadiLettereeFilosofia | 3 | `H45` | `comune\|3` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Musica e Spettacolo (intero) | FacoltadiLettereeFilosofia | 1 | `H57/LM-45 - M95/LM-65` | `musicologia\|1, spettacolo\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Musica e Spettacolo (intero) | FacoltadiLettereeFilosofia | 2 | `H57/LM-45 - M95/LM-65` | `musicologia\|2, spettacolo\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Psicologia e Salute Mentale nel Ciclo di Vita (intero) | FacoltadiMedicina | 1 | `AB2` | `differenzeevariabilitaindividualinelledimensionicognitive-relazionali-socialiedigenere\|1, processipsicologicidisviluppo\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Psicologia Generale, dello Sviluppo, del Genere e del Comportamento Sociale (intero) | (nessuna) | 1 | `Y44` | `comune\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Psicologia Generale, dello Sviluppo, del Genere e del Comportamento Sociale (intero) | (nessuna) | 2 | `Y44` | `comune\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Psicologia Generale, dello Sviluppo, del Genere e del Comportamento Sociale (intero) | (nessuna) | 3 | `Y44` | `comune\|3` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Scienze del Turismo (intero) | FacoltadiLettereeFilosofia | 1 | `AB8` | `aturismoculturale\|1, bgestionedelturismoedellospitalita\|1, cinnovationtourismformadeinitaly\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Scienze del Turismo (intero) | FacoltadiLettereeFilosofia | 2 | `AB8` | `aturismoculturale\|2, bgestionedelturismoedellospitalita\|2, csporteturismo\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Scienze del Turismo (intero) | FacoltadiLettereeFilosofia | 3 | `AB8` | `aturismoculturale\|3, bgestionedelturismoedellospitalita\|3, csporteturismo\|3` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Scienze dell'Educazione e della Formazione (intero) | FacoltadiLettereeFilosofia | 1 | `U06` | `comune\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Scienze dell'Educazione e della Formazione (intero) | FacoltadiLettereeFilosofia | 2 | `U06` | `comune\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Scienze dell'Educazione e della Formazione (intero) | FacoltadiLettereeFilosofia | 3 | `U06` | `comune\|3` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Scienze dell'Informazione, della Comunicazione e dell'Editoria (intero) | FacoltadiLettereeFilosofia | 2 | `L87` | `comune\|2` | corso assente dal combo 2026 |
| Scienze della Comunicazione (intero) | FacoltadiLettereeFilosofia | 1 | `H48` | `comune\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Scienze della Comunicazione (intero) | FacoltadiLettereeFilosofia | 2 | `H48` | `comune\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Scienze della Comunicazione (intero) | FacoltadiLettereeFilosofia | 3 | `H48` | `comune\|3` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Scienze della Storia e del Documento (intero) | FacoltadiLettereeFilosofia | 1 | `U12` | `europeanhistory\|1, medioevoeuropeo\|1, publichistorydivulgazioneedidatticadellastoria\|1, storiaecultureglobali\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Scienze della Storia e del Documento (intero) | FacoltadiLettereeFilosofia | 2 | `U12` | `europeanhistory\|2, medioevoeuropeo\|2, publichistorydivulgazioneedidatticadellastoria\|2, storiaecultureglobali\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Scienze Pedagogiche (intero) | FacoltadiLettereeFilosofia | 1 | `U07` | `comune\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Scienze Pedagogiche (intero) | FacoltadiLettereeFilosofia | 2 | `U07` | `comune\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Storia dell'Arte (intero) | FacoltadiLettereeFilosofia | 1 | `H62` | `comune\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Storia dell'Arte (intero) | FacoltadiLettereeFilosofia | 2 | `H62` | `comune\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Tourism Strategy, Cultural Heritage and Made in Italy (intero) | FacoltadiLettereeFilosofia | 1 | `AB9` | `e-tourism-heritageandmadeinitaly\|1, progettazioneegestionedelturismo\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Tourism Strategy, Cultural Heritage and Made in Italy (intero) | FacoltadiLettereeFilosofia | 2 | `AB9` | `curriculumunico\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |

## (senza scuola)

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Psicologia Generale, dello Sviluppo, del Genere e del Comportamento Sociale | `Y44` | 1,2,3 | 27 | 98 | ✅ live orari+esami |

## Corsidisostegno

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Specializzazione per Sostegno Infanzia | `N30` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Specializzazione per Sostegno Primaria | `N40` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Specializzazione per Sostegno Secondaria Primo Grado | `N46` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Specializzazione per Sostegno Secondaria Secondo Grado | `N59` | 1 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |

## FacoltadiEconomia

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Business Administration and Economics | `T16/L-18 - T17/L-33` | 1,2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Business Administration-Gestione D'impresa | `H73` | 1,2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Economia dei Mercati e degli Intermediari Finanziari | `M20` | 1,2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Economia e Finanza | `T18` | 1,2,3 | 0 | 2 | ⚪ manuale (solo esami via Esse3; orari celle=0) |
| Economia e Management | `M18` | 1,2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Economia e Management | `M21` | 1,2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Economics - Economia | `H71` | 1,2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| European Economy and Business Law | `H75` | 1,2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Finance and Banking - Finanza e Banca | `L80` | 1,2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Global Governance | `O37` | 1,2,3 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |

## FacoltadiGiurisprudenza

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Diritto, Innovazione Tecnologica e Sostenibilità | `AA8` | 1,2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Giurisprudenza | `C23 - J78/Militari` | 1,2,3,4,5 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze dell'Amministrazione e delle Relazioni Internazionali | `T21` | 1,2,3 | 0 | 6 | ⚪ manuale (solo esami via Esse3; orari celle=0) |

## FacoltadiIngegneria

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Chemical Nano-Engineering | `W46` | 1,2 | 15 | 5 | ✅ live orari+esami |
| Engineering Sciences | `K73` | 1,2,3 | 36 | 118 | ✅ live orari+esami |
| ICT and Internet Engineering - Ingegneria di Internet e delle Tecnologie per l'Informazione e la Comunicazione | `Q66` | 1,2 | 42 | 57 | ✅ live orari+esami |
| Ingegneria Civile | `H30` | 1,2 | 39 | 31 | ✅ live orari+esami |
| Ingegneria Civile e Ambientale | `K72` | 1,2,3 | 73 | 173 | ✅ live orari+esami |
| Ingegneria dell'Automazione | `H31` | 1,2 | 50 | 67 | ✅ live orari+esami |
| Ingegneria dell'Edilizia | `H20` | 1,2,3 | 47 | 113 | ✅ live orari+esami |
| Ingegneria di Internet | `P65` | 1,2,3 | 59 | 122 | ✅ live orari+esami |
| Ingegneria e Tecniche del Costruire | `H32` | 1,2 | 34 | 22 | ✅ live orari+esami |
| Ingegneria Edile-architettura | `J53` | 1,2,3,4,5 | 54 | 97 | ✅ live orari+esami |
| Ingegneria Elettronica | `H21` | 1,2,3 | 63 | 130 | ✅ live orari+esami |
| Ingegneria Elettronica | `H33` | 1,2 | 50 | 30 | ✅ live orari+esami |
| Ingegneria Energetica | `H34` | 1,2 | 27 | 21 | ✅ live orari+esami |
| Ingegneria Gestionale | `AC1` | 1,2 | 124 | 138 | ✅ live orari+esami |
| Ingegneria Gestionale | `U09` | 1,2,3 | 104 | 233 | ✅ live orari+esami |
| Ingegneria Gestionale (in Modalità Prevalentemente a Distanza) | `V89` | 1,2,3 | 35 | 75 | ✅ live orari+esami |
| Ingegneria Informatica | `U08` | 1,2,3 | 51 | 133 | ✅ live orari+esami |
| Ingegneria Informatica | `H36` | 1,2 | 47 | 97 | ✅ live orari+esami |
| Ingegneria Meccanica | `H25` | 1,2,3 | 73 | 164 | ✅ live orari+esami |
| Ingegneria Meccanica | `H37` | 1,2 | 66 | 66 | ✅ live orari+esami |
| Ingegneria Medica | `H38` | 1,2 | 47 | 40 | ✅ live orari+esami |
| Ingegneria Medica | `H26` | 1,2,3 | 70 | 182 | ✅ live orari+esami |
| Ingegneria per l'Ambiente e il Territorio | `H29` | 1,2 | 24 | 7 | ✅ live orari+esami |
| Ingegneria per l'Energia e l'Ambiente | `X63` | 1,2,3 | 76 | 147 | ✅ live orari+esami |
| Mechatronics Engineering | `T20` | 1,2 | 41 | 82 | ✅ live orari+esami |

## FacoltadiLettereeFilosofia

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Archeologia, Filologia, Letterature e Storia dell'Antichità | `K80/LM-2 - M93/LM-15` | 1,2 | 50 | 19 | ✅ live orari+esami |
| Art History in Rome, From Late Antiquity to the Present | `T22` | 1,2 | 4 | 27 | ✅ live orari+esami |
| Beni Culturali (archeologici, Artistici, Musicali e dello Spettacolo) | `L85` | 1,2,3 | 118 | 21 | ✅ live orari+esami |
| Comunicazione e Intelligenza Artificiale | `AB5` | 1 | 11 | 3 | ✅ live orari+esami |
| Conservazione e Restauro dei Beni Culturali (abilitante Ai Sensi del D.Lgs N.42/2004) | `M91` | 1,2,3,4,5 | 24 | 11 | ✅ live orari+esami |
| Digital Humanities: Comunicazione, Lingue, Patrimonio Culturale | `AA9` | 1,2 | 8 | 5 | ✅ live orari+esami |
| Filologia Moderna | `AB4` | 1 | 31 | 3 | ✅ live orari+esami |
| Filosofia | `H42` | 1,2,3 | 63 | 19 | ✅ live orari+esami |
| Filosofia | `H59` | 1,2 | 80 | 27 | ✅ live orari+esami |
| Letteratura Italiana, Filologia Moderna e Linguistica | `H53/LM-14 - M94/LM-39` | 2 | 24 | 9 | ✅ live orari+esami |
| Lingua e Cultura Italiana a Stranieri per l'Accoglienza e l'Internazionalizzazione | `V86` | 1,2 | 30 | 5 | ✅ live orari+esami |
| Lingue e Letterature Europee e Americane | `H56` | 1,2 | 46 | 3 | ✅ live orari+esami |
| Lingue e Letterature Moderne | `H44` | 1,2,3 | 37 | 3 | ✅ live orari+esami |
| Lingue nella Società dell'Informazione | `H45` | 1,2,3 | 38 | 11 | ✅ live orari+esami |
| Musica e Spettacolo | `H57/LM-45 - M95/LM-65` | 1,2 | 28 | 0 | 🟢 live solo orari |
| Scienze del Turismo | `AB8` | 1,2,3 | 27 | 6 | ✅ live orari+esami |
| Scienze dell'Educazione e della Formazione | `U06` | 1,2,3 | 26 | 5 | ✅ live orari+esami |
| Scienze dell'Informazione, della Comunicazione e dell'Editoria | `L87` | 2 | 4 | 3 | ✅ live orari+esami |
| Scienze della Comunicazione | `H48` | 1,2,3 | 63 | 26 | ✅ live orari+esami |
| Scienze della Storia e del Documento | `U12` | 1,2 | 90 | 15 | ✅ live orari+esami |
| Scienze Pedagogiche | `U07` | 1,2 | 10 | 25 | ✅ live orari+esami |
| Storia dell'Arte | `H62` | 1,2 | 17 | 1 | ✅ live orari+esami |
| Tourism Strategy, Cultural Heritage and Made in Italy | `AB9` | 1,2 | 31 | 37 | ✅ live orari+esami |

## FacoltadiMedicina

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Psicologia e Salute Mentale nel Ciclo di Vita | `AB2` | 1 | 11 | 40 | ✅ live orari+esami |

## FacoltadiScienzeMatematiche-FisicheeNaturali

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Astrophysics and Space Science | `AA3` | 1,2 | 22 | 102 | ✅ live orari+esami |
| Bioinformatica | `J61` | 1,2 | 26 | 122 | ✅ live orari+esami |
| Biologia Ambientale | `AA7` | 1,2 | 0 | 11 | ⚪ manuale (solo esami via Esse3; orari celle=0) |
| Biologia Cellulare e Molecolare e Scienze Biomediche | `P63` | 2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Biologia Cellulare, Molecolare e Ricerca Biomedica | `AB7` | 1 | 13 | 103 | ✅ live orari+esami |
| Biotechnology - Biotecnologie | `Q67` | 2 | 6 | 21 | ✅ live orari+esami |
| Biotechnology for Industry and Health | `AB6` | 1 | 15 | 86 | ✅ live orari+esami |
| Biotecnologie | `H04` | 1,2,3 | 42 | 223 | ✅ live orari+esami |
| Biotecnologie Agrarie | `AB3` | 1 | 6 | 4 | ✅ live orari+esami |
| Chimica | `H05` | 1,2,3 | 42 | 256 | ✅ live orari+esami |
| Chimica | `J63` | 1,2 | 34 | 169 | ✅ live orari+esami |
| Chimica Applicata | `H06` | 1,2,3 | 52 | 258 | ✅ live orari+esami |
| Fisica | `H08` | 1,2,3 | 57 | 251 | ✅ live orari+esami |
| Fisica | `J64` | 1,2 | 109 | 380 | ✅ live orari+esami |
| Informatica | `J65` | 1,2 | 25 | 44 | ✅ live orari+esami |
| Informatica | `H02` | 1,2,3 | 29 | 109 | ✅ live orari+esami |
| Matematica | `H11` | 1,2,3 | 22 | 317 | ✅ live orari+esami |
| Metodi e Modelli per Data Science | `AA2` | 1,2,3 | 18 | 103 | ✅ live orari+esami |
| Pharmacy | `AA4` | 1,2,3,4,5 | 44 | 263 | ✅ live orari+esami |
| Scienza dei Materiali | `AB1` | 1 | 17 | 22 | ✅ live orari+esami |
| Scienza dei Materiali | `H10` | 2,3 | 23 | 120 | ✅ live orari+esami |
| Scienza e Tecnologia dei Materiali | `AA1` | 1,2 | 20 | 102 | ✅ live orari+esami |
| Scienze Biologiche | `H03` | 1,2,3 | 51 | 241 | ✅ live orari+esami |
