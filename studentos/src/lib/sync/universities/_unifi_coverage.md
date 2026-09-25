# Università degli Studi di Firenze — copertura corsi (verificata via combo.php + grid/test_call)

Totale corsi: **280** · orari live: **278** · esami live: **279**. Esami: sì.

Codici (`scuola`/`corso`/`anno2`) dal portale, mai inventati.

## Ri-verifica anno accademico 2026/27 — 2026-09-25

Sorgente: GET reale `https://kairos.unifi.it/agendaweb/combo.php?sw=ec_&aa=2026&page=corsi` + POST reali `grid_call.php` (anno=2026, settimane 28-09, 12-10, 09-11, 07-12-2026 e 01-03-2027: basta una con `celle` non vuote) e `test_call.php` (appelli 01-09-2026..30-09-2027; se vuoto, controllo sul 2025/26 per distinguere "calendario non ancora pubblicato" da "codice inesistente"). Nessun codice inventato: ogni riga sotto è stata restituita dal combo 2026 e confermata da una risposta non vuota.

- Programmi (livePrograms) prima: **189** · dopo: **183** (rimossi interamente: **6**)
- Anni-sorgente orario prima: **422** · dopo: **397** (invariati verificati: 265, ricatturati/aggiornati: 132, rimossi: 25)
- Programmi rimasti live solo in parte (alcuni anni rimossi): **16**
- Le tabelle per scuola più sotto sono lo **storico della verifica 2025/26** e NON sono state rigenerate: fa fede questa sezione.

### Corsi passati a solo-orari (exams:false) — 34

Regola rigida: `exams:false` se `test_call.php` non restituisce appelli nella finestra 2026/27 (01-09-2026..30-09-2027). Da riattivare (ultimo argomento `false` di `degreeSources`) quando i calendari esami vengono pubblicati. 'Nel 2025/26' = il codice risponde con appelli della finestra precedente (calendario nuovo non ancora pubblicato); 'mai' = nessun appello neanche nel 2025/26.

- Advanced Molecular Sciences — mai
- Architettura (magistrale) (B348) — appelli nel 2025/26
- Architettura del Paesaggio (magistrale) — appelli nel 2025/26
- Architettura del Paesaggio (magistrale) (B268) — mai
- Biologia Dell'ambiente e del Comportamento (magistrale) — appelli nel 2025/26
- Biologia Dell'ambiente e del Comportamento (magistrale) (B232) — appelli nel 2025/26
- Biotecnologie Molecolari — appelli nel 2025/26
- Design per L'innovazione Sostenibile (magistrale) — appelli nel 2025/26
- Design per L'innovazione Sostenibile (magistrale) (B270) — appelli nel 2025/26
- Design Tessile e Moda (magistrale) — appelli nel 2025/26
- Design Tessile e Moda (triennale) — appelli nel 2025/26
- Dirigenza Scolastica e Pedagogia per L'inclusione — mai
- Diritto per le Sostenibilita' e la Sicurezza — mai
- Disegno e Gestione degli Interventi Sociali — appelli nel 2025/26
- Giurisprudenza Italiana e Tedesca — appelli nel 2025/26
- Intelligenza Artificiale — appelli nel 2025/26
- Management Engineering — appelli nel 2025/26
- Odontoiatria e Protesi Dentaria (ciclo unico) (B125) — appelli nel 2025/26
- Ottica e Optometria — appelli nel 2025/26
- Pianificazione della Citta', del Territorio e del Paesaggio (magistrale) — appelli nel 2025/26
- Pianificazione della Citta', del Territorio e del Paesaggio (triennale) — appelli nel 2025/26
- Pianificazione e Progettazione per la Sostenibilità Urbana e Territoriale (magistrale) — appelli nel 2025/26
- Pianificazione e Progettazione per la Sostenibilità Urbana e Territoriale (magistrale) (B269) — mai
- Politica, Istituzioni e Mercato — appelli nel 2025/26
- Product, Interior, Communication and Eco-social Design (triennale) — appelli nel 2025/26
- Scienze Chimiche — appelli nel 2025/26
- Scienze e Materiali per la Conservazione e il Restauro — appelli nel 2025/26
- Scienze e Tecnologie Geologiche — appelli nel 2025/26
- Scienze Geologiche — appelli nel 2025/26
- Semestre Filtro — appelli nel 2025/26
- Statistica — appelli nel 2025/26
- Statistica e Data Science — appelli nel 2025/26
- Strategie di Comunicazione nella Società Digitale — appelli nel 2025/26
- Tecniche e Tecnologie per le Costruzioni e il Territorio — appelli nel 2025/26

### Corsi live verificati (2026/27)

| Corso | scuola | corso (per anno) | Anni live | celle/anno | appelli/anno | Stato |
|---|---|---|---|---|---|---|
| Accounting, Auditing e Controllo | ScuoladiEconomiaeManagement | 1:`B377` 2:`B377` | 1,2 | 26,22 | 10,6 | ✅ orari+esami |
| Advanced Molecular Sciences | ScuoladiScienzeMatematiche-FisicheeNaturali | 2:`B370` | 2 | 14 | 0 | 🟢 solo orari (nessun appello) |
| Archeologia | ScuoladiStudiUmanisticiedellaFormazione | 1:`B347` 2:`B347` | 1,2 | 18,19 | 19,0 | ✅ orari+esami |
| Architettura (magistrale) | ScuoladiArchitettura | 1:`B387` 2:`B430` | 1,2 | 31,1 | 11,0 | ✅ orari+esami |
| Architettura (magistrale) (B348) | ScuoladiArchitettura | 1:`B430` 2:`B348` | 1,2 | 16,9 | 0,(3) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Architettura (ciclo unico) | ScuoladiArchitettura | 2:`B387` 3:`B117` 4:`B117` 5:`B117` | 2,3,4,5 | 21,24,12,12 | 0,12,6,1 | ✅ orari+esami |
| Architettura del Paesaggio (magistrale) | ScuoladiArchitettura | 1:`B409` 2:`B409` | 1,2 | 6,5 | (19),0 | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Architettura del Paesaggio (magistrale) (B268) | ScuoladiArchitettura | 2:`B409` | 2 | 5 | 0 | 🟢 solo orari (nessun appello) |
| Assistenza Sanitaria (abilitante alla Professione Sanitaria di Assistente Sanitario) | ScuoladiScienzedellaSaluteUmana | 1:`B178` 2:`B178` 3:`B178` | 1,2,3 | 6,6,6 | 34,1,5 | ✅ orari+esami |
| Biologia Dell'ambiente e del Comportamento (magistrale) | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B350` 2:`B350` | 1,2 | 17,12 | (37),(4) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Biologia Dell'ambiente e del Comportamento (magistrale) (B232) | ScuoladiScienzeMatematiche-FisicheeNaturali | 2:`B350` | 2 | 21 | (4) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Biologia Molecolare e Applicata | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B351` 2:`B351` | 1,2 | 18,34 | 4,0 | ✅ orari+esami |
| Biotecnologie | ScuoladiScienzedellaSaluteUmana | 2:`B301` 3:`B014` | 2,3 | 9,35 | 9,8 | ✅ orari+esami |
| Biotecnologie Mediche e Farmaceutiche | ScuoladiScienzedellaSaluteUmana | 1:`B353` 2:`B353` | 1,2 | 9,22 | 57,0 | ✅ orari+esami |
| Biotecnologie Molecolari | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B352` 2:`B352` | 1,2 | 12,4 | (34),0 | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Biotecnologie per la Gestione Ambientale e L'agricoltura Sostenibile [b225] | ScuoladiAgraria | 2:`B422` | 2 | 8 | 24 | ✅ orari+esami |
| Biotecnologie per la Gestione Ambientale e L'agricoltura Sostenibile [b422] | ScuoladiAgraria | 1:`B422` | 1 | 12 | 62 | ✅ orari+esami |
| Chimica | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B321` 2:`B321` 3:`B025` | 1,2,3 | 23,20,32 | 6,0,(82) | ✅ orari+esami |
| Chimica e Tecnologia Farmaceutiche (ciclo unico) | ScuoladiScienzedellaSaluteUmana | 1:`B356` 2:`B356` 3:`B263` 4:`B263` 5:`B053` | 1,2,3,4,5 | 7,10,8,9,6 | 8,12,10,11,2 | ✅ orari+esami |
| Chimica e Tecnologia Farmaceutiche (ciclo unico) (B053) | ScuoladiScienzedellaSaluteUmana | 4:`B263` 5:`B053` | 4,5 | 9,6 | 11,2 | ✅ orari+esami |
| Data Science, Calcolo Scientifico and Intelligenza Artificiale | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B343` 2:`B343` | 1,2 | 16,16 | 1,0 | ✅ orari+esami |
| Design of Sustainable Tourism Systems | ScuoladiEconomiaeManagement | 1:`B415` | 1 | 16 | 12 | ✅ orari+esami |
| Design per L'innovazione Sostenibile (magistrale) | ScuoladiArchitettura | 1:`B355` 2:`B355` | 1,2 | 8,10 | (10),(2) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Design per L'innovazione Sostenibile (magistrale) (B270) | ScuoladiArchitettura | 2:`B355` | 2 | 10 | (2) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Design Sistema Moda | ScuoladiArchitettura | 1:`B354` 2:`B354` | 1,2 | 11,7 | 2,0 | ✅ orari+esami |
| Design Tessile e Moda (magistrale) | ScuoladiArchitettura | 1:`B404` 2:`B404` | 1,2 | 7,5 | (50),(1) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Design Tessile e Moda (triennale) | ScuoladiArchitettura | 2:`B404` 3:`B246` | 2,3 | 5,4 | (1),(21) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Diagnostica e Materiali per la Conservazione e il Restauro | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B405` 2:`B405` 3:`B186` | 1,2,3 | 13,13,10 | 3,0,1 | ✅ orari+esami |
| Dietistica (abilitante alla Professione Sanitaria di Dietista) | ScuoladiScienzedellaSaluteUmana | 1:`B170` 2:`B170` 3:`B170` | 1,2,3 | 5,12,7 | 34,1,1 | ✅ orari+esami |
| Dirigenza Scolastica e Pedagogia per L'inclusione | ScuoladiStudiUmanisticiedellaFormazione | 1:`B431` 2:`B367` | 1,2 | 6,10 | 0,0 | 🟢 solo orari (nessun appello) |
| Diritto per le Sostenibilita' e la Sicurezza | ScuoladiGiurisprudenza | 1:`B433` 2:`B386` | 1,2 | 19,6 | 0,0 | 🟢 solo orari (nessun appello) |
| Discipline delle Arti, della Musica e dello Spettacolo | ScuoladiStudiUmanisticiedellaFormazione | 1:`B401` 2:`B401` 3:`B027` | 1,2,3 | 10,6,5 | 6,0,7 | ✅ orari+esami |
| Disegno e Gestione degli Interventi Sociali | ScuoladiScienzePoliticheCesareAlfieri | 1:`B382` 2:`B382` | 1,2 | 13,6 | (44),(14) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Economia Aziendale | ScuoladiEconomiaeManagement | 1:`B395` 3:`B009` | 1,3 | 54,27 | 23,18 | ✅ orari+esami |
| Economia e Commercio | ScuoladiEconomiaeManagement | 1:`B402` 3:`B034` | 1,3 | 54,41 | 23,7 | ✅ orari+esami |
| Economia Istituzioni Sostenibilità / Economics Institutions Sustainability | ScuoladiEconomiaeManagement | 1:`B417` 2:`B417` | 1,2 | 31,9 | 2,(16) | ✅ orari+esami |
| Economics and Development (magistrale) | ScuoladiEconomiaeManagement | 1:`B418` 2:`B418` | 1,2 | 34,19 | 5,4 | ✅ orari+esami |
| Educazione Professionale (abilitante alla Professione Sanitaria di Educatore Professionale) | ScuoladiScienzedellaSaluteUmana | 1:`B164` 2:`B164` 3:`B164` | 1,2,3 | 7,10,8 | 8,5,9 | ✅ orari+esami |
| Farmacia (ciclo unico) | ScuoladiScienzedellaSaluteUmana | 1:`B357` 2:`B357` 3:`B264` 4:`B264` 5:`B054` | 1,2,3,4,5 | 7,11,10,9,1 | 20,18,17,2,0 | ✅ orari+esami |
| Farmacia (ciclo unico) (B054) | ScuoladiScienzedellaSaluteUmana | 4:`B264` 5:`B054` | 4,5 | 9,1 | 2,0 | ✅ orari+esami |
| Filologia Moderna | ScuoladiStudiUmanisticiedellaFormazione | 1:`B333` 2:`B333` | 1,2 | 47,32 | 29,0 | ✅ orari+esami |
| Filologia, Letteratura e Storia Dell'antichità | ScuoladiStudiUmanisticiedellaFormazione | 1:`B334` 2:`B334` | 1,2 | 15,23 | 10,0 | ✅ orari+esami |
| Filosofia | ScuoladiStudiUmanisticiedellaFormazione | 1:`B304` 2:`B304` 3:`B042` | 1,2,3 | 9,28,14 | 7,0,6 | ✅ orari+esami |
| Finance and Risk Management | ScuoladiEconomiaeManagement | 1:`B358` | 1 | 9 | 5 | ✅ orari+esami |
| Fisica e Astrofisica | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B322` 2:`B322` 3:`B030` | 1,2,3 | 19,10,7 | 3,0,(35) | ✅ orari+esami |
| Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista) - Empoli | ScuoladiScienzedellaSaluteUmana | 1:`B165_EMPOLI` 2:`B165_EMPOLI` 3:`B165_EMPOLI` | 1,2,3 | 1,1,6 | (1),(14),1 | ✅ orari+esami |
| Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista) - Firenze | ScuoladiScienzedellaSaluteUmana | 1:`B165_FIRENZE` 2:`B165_FIRENZE` 3:`B165_FIRENZE` | 1,2,3 | 2,2,10 | 29,2,2 | ✅ orari+esami |
| Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista) - Pistoia | ScuoladiScienzedellaSaluteUmana | 1:`B165_PISTOIA` 2:`B165_PISTOIA` 3:`B165_PISTOIA` | 1,2,3 | 1,1,8 | 0,(1),1 | ✅ orari+esami |
| Food Design e Innovazione dei Prodotti Alimentari [b423] | ScuoladiAgraria | 1:`B423` | 1 | 9 | 48 | ✅ orari+esami |
| Geoengineering | ScuoladiIngegneria | 1:`B361` 2:`B361` | 1,2 | 12,12 | 1,0 | ✅ orari+esami |
| Geography, Spatial Management, Heritage for International Cooperation | ScuoladiStudiUmanisticiedellaFormazione | 1:`B427` 2:`B427` | 1,2 | 3,2 | 12,0 | ✅ orari+esami |
| Giurisprudenza (ciclo unico) | ScuoladiGiurisprudenza | 1:`B344` 5:`1170` | 1,5 | 30,60 | 1,4 | ✅ orari+esami |
| Giurisprudenza (ciclo unico) (1170) | ScuoladiGiurisprudenza | 2:`B344` 3:`1170` 4:`1170` 5:`1170` | 2,3,4,5 | 17,20,24,60 | 0,6,1,4 | ✅ orari+esami |
| Giurisprudenza Italiana e Francese | ScuoladiGiurisprudenza | 1:`B345` 2:`B345` | 1,2 | 9,9 | 2,0 | ✅ orari+esami |
| Giurisprudenza Italiana e Tedesca | ScuoladiGiurisprudenza | 1:`B346` 2:`B346` | 1,2 | 9,15 | (48),0 | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Governo e Direzione D'impresa | ScuoladiEconomiaeManagement | 1:`B426` 2:`B426` | 1,2 | 12,13 | (46),3 | ✅ orari+esami |
| Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Borgo San Lorenzo | ScuoladiScienzedellaSaluteUmana | 1:`B162_BORGO SAN LORENZO` 2:`B162_BORGO SAN LORENZO` 3:`B162_BORGO SAN LORENZO` | 1,2,3 | 7,1,1 | 20,(10),1 | ✅ orari+esami |
| Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Empoli | ScuoladiScienzedellaSaluteUmana | 1:`B162_EMPOLI` 2:`B162_EMPOLI` 3:`B162_EMPOLI` | 1,2,3 | 5,1,1 | 11,(6),0 | ✅ orari+esami |
| Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Firenze | ScuoladiScienzedellaSaluteUmana | 1:`B162_FIRENZE` 2:`B162_FIRENZE` 3:`B162_FIRENZE` | 1,2,3 | 11,19,11 | 41,17,1 | ✅ orari+esami |
| Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Pistoia | ScuoladiScienzedellaSaluteUmana | 1:`B162_PISTOIA` 2:`B162_PISTOIA` 3:`B162_PISTOIA` | 1,2,3 | 7,1,1 | 18,0,(1) | ✅ orari+esami |
| Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Prato | ScuoladiScienzedellaSaluteUmana | 1:`B162_PRATO` 2:`B162_PRATO` 3:`B162_PRATO` | 1,2,3 | 8,11,9 | 19,5,3 | ✅ orari+esami |
| Informatica | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B324` 2:`B324` 3:`B032` | 1,2,3 | 9,10,7 | 3,0,2 | ✅ orari+esami |
| Ingegneria Ambientale | ScuoladiIngegneria | 1:`B305` 2:`B305` 3:`B254` | 1,2,3 | 9,12,24 | 3,5,3 | ✅ orari+esami |
| Ingegneria Biomedica (triennale) | ScuoladiIngegneria | 1:`B388` 2:`B388` 3:`B237` | 1,2,3 | 9,10,17 | 40,16,4 | ✅ orari+esami |
| Ingegneria Biomedica (magistrale) | ScuoladiIngegneria | 1:`B359` 2:`B359` | 1,2 | 8,32 | 1,0 | ✅ orari+esami |
| Ingegneria Civile | ScuoladiIngegneria | 1:`B360` 2:`B360` | 1,2 | 21,24 | 13,(1) | ✅ orari+esami |
| Ingegneria Civile e Edile per la Sostenibilità | ScuoladiIngegneria | 1:`B306` 2:`B306` 3:`B259` | 1,2,3 | 19,24,17 | 3,7,(67) | ✅ orari+esami |
| Ingegneria dei Sistemi Elettronici | ScuoladiIngegneria | 1:`B337` 2:`B337` | 1,2 | 59,22 | 8,8 | ✅ orari+esami |
| Ingegneria Edile | ScuoladiIngegneria | 1:`B408` 2:`B408` | 1,2 | 18,8 | 13,(1) | ✅ orari+esami |
| Ingegneria Elettronica | ScuoladiIngegneria | 1:`B307` 2:`B307` 3:`B244` | 1,2,3 | 11,12,35 | 18,0,9 | ✅ orari+esami |
| Ingegneria Energetica | ScuoladiIngegneria | 1:`B410` 2:`B410` | 1,2 | 34,18 | 4,0 | ✅ orari+esami |
| Ingegneria Gestionale | ScuoladiIngegneria | 1:`B406` 2:`B406` 3:`B222` | 1,2,3 | 27,28,11 | 79,0,5 | ✅ orari+esami |
| Ingegneria Informatica (magistrale) | ScuoladiIngegneria | 1:`B308` 2:`B339` | 1,2 | 18,22 | 11,0 | ✅ orari+esami |
| Ingegneria Informatica (triennale) | ScuoladiIngegneria | 1:`B339` 2:`B308` 3:`B047` | 1,2,3 | 60,12,16 | (168),1,10 | ✅ orari+esami |
| Ingegneria Meccanica (magistrale) | ScuoladiIngegneria | 1:`B412` 2:`B412` | 1,2 | 61,88 | 5,1 | ✅ orari+esami |
| Ingegneria Meccanica (triennale) | ScuoladiIngegneria | 1:`B309` 2:`B309` 3:`B049` | 1,2,3 | 27,62,76 | 79,2,24 | ✅ orari+esami |
| Ingegneria per la Tutela Dell'ambiente e del Territorio | ScuoladiIngegneria | 1:`B362` 2:`B362` | 1,2 | 18,14 | 13,0 | ✅ orari+esami |
| Innovazione Sostenibile in Viticoltura ed Enologia [b253] | ScuoladiAgraria | 2:`B424` | 2 | 8 | 39 | ✅ orari+esami |
| Innovazione Sostenibile in Viticoltura ed Enologia [b424] | ScuoladiAgraria | 1:`B424` | 1 | 5 | 52 | ✅ orari+esami |
| Intelligenza Artificiale | ScuoladiIngegneria | 1:`B340` 2:`B340` | 1,2 | 16,12 | (46),0 | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Intermediazione Culturale e Religiosa | ScuoladiStudiUmanisticiedellaFormazione | 1:`B342` 2:`B342` | 1,2 | 15,12 | 16,0 | ✅ orari+esami |
| Lettere | ScuoladiStudiUmanisticiedellaFormazione | 1:`B393` 2:`B393` 3:`B200` | 1,2,3 | 29,68,54 | 22,0,27 | ✅ orari+esami |
| Lingue e Civiltà Dell'asia e Dell'africa | ScuoladiStudiUmanisticiedellaFormazione | 1:`B363` 2:`B363` | 1,2 | 25,17 | 24,0 | ✅ orari+esami |
| Lingue e Letterature Europee e Americane | ScuoladiStudiUmanisticiedellaFormazione | 1:`B413` 2:`B413` | 1,2 | 96,130 | 32,0 | ✅ orari+esami |
| Lingue, Letterature e Studi Interculturali | ScuoladiStudiUmanisticiedellaFormazione | 1:`B394` 2:`B394` 3:`B004` | 1,2,3 | 92,140,80 | 54,0,50 | ✅ orari+esami |
| Logica, Filosofia delle Scienze e Metodi della Ricerca | ScuoladiStudiUmanisticiedellaFormazione | 1:`B391` | 1 | 13 | 11 | ✅ orari+esami |
| Logopedia (abilitante alla Professione Sanitaria di Logopedista) | ScuoladiScienzedellaSaluteUmana | 1:`B166` 2:`B166` 3:`B166` | 1,2,3 | 12,3,2 | 23,1,(15) | ✅ orari+esami |
| Management Engineering | ScuoladiIngegneria | 1:`B338` 2:`B338` | 1,2 | 13,9 | (60),0 | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Matematica (magistrale) | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B327` 2:`B364` | 1,2 | 13,3 | 1,0 | ✅ orari+esami |
| Matematica (triennale) | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B364` 2:`B327` 3:`B036` | 1,2,3 | 82,17,14 | 4,0,2 | ✅ orari+esami |
| Mechanical Engineering for Sustainability | ScuoladiIngegneria | 1:`B341` 2:`B341` | 1,2 | 15,37 | 6,0 | ✅ orari+esami |
| Medicina e Chirurgia | ScuoladiScienzedellaSaluteUmana | 1:`B414` 2:`B414` 3:`B240` 4:`B240` 5:`B240` 6:`B240` | 1,2,3,4,5,6 | 1,30,20,5,5,10 | 41,93,4,15,8,(4) | ✅ orari+esami |
| Odontoiatria e Protesi Dentaria (ciclo unico) | ScuoladiScienzedellaSaluteUmana | 2:`B365` 3:`B265` 4:`B265` 5:`B125` 6:`B265` | 2,3,4,5,6 | 10,6,11,9,2 | 14,(20),0,(23),(1) | ✅ orari+esami |
| Odontoiatria e Protesi Dentaria (ciclo unico) (B125) | ScuoladiScienzedellaSaluteUmana | 4:`B265` 5:`B125` 6:`B125` | 4,5,6 | 11,9,2 | 0,(23),(4) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Osteopatia | ScuoladiScienzedellaSaluteUmana | 1:`B275` 2:`B275` | 1,2 | 9,3 | 16,1 | ✅ orari+esami |
| Ostetricia (abilitante alla Professione Sanitaria di Ostetrica/o) | ScuoladiScienzedellaSaluteUmana | 1:`B163` 2:`B163` 3:`B163` | 1,2,3 | 2,1,2 | 8,1,5 | ✅ orari+esami |
| Ottica e Optometria | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B323` 2:`B323` 3:`B031` | 1,2,3 | 10,13,11 | (44),0,(31) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Physical and Astrophysical Sciences | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B411` | 1 | 229 | 3 | ✅ orari+esami |
| Pianificazione della Citta', del Territorio e del Paesaggio (magistrale) | ScuoladiArchitettura | 1:`B317` 2:`B317` | 1,2 | 5,5 | (34),(2) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Pianificazione della Citta', del Territorio e del Paesaggio (triennale) | ScuoladiArchitettura | 2:`B317` 3:`B016` | 2,3 | 5,4 | (2),(18) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Pianificazione e Progettazione per la Sostenibilità Urbana e Territoriale (magistrale) | ScuoladiArchitettura | 1:`B366` 2:`B366` | 1,2 | 6,10 | (20),0 | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Pianificazione e Progettazione per la Sostenibilità Urbana e Territoriale (magistrale) (B269) | ScuoladiArchitettura | 2:`B366` | 2 | 10 | 0 | 🟢 solo orari (nessun appello) |
| Politica, Istituzioni e Mercato | ScuoladiScienzePoliticheCesareAlfieri | 1:`B374` 2:`B374` | 1,2 | 20,42 | (48),(49) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Pratiche, Linguaggi e Culture della Comunicazione | ScuoladiStudiUmanisticiedellaFormazione | 1:`B385` 2:`B385` | 1,2 | 11,9 | 13,0 | ✅ orari+esami |
| Product, Interior, Communication and Eco-social Design (magistrale) | ScuoladiArchitettura | 1:`B303` | 1 | 12 | 10 | ✅ orari+esami |
| Product, Interior, Communication and Eco-social Design (triennale) | ScuoladiArchitettura | 3:`B251` | 3 | 17 | (45) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Progettazione e Gestione di Eventi e Imprese Dell'arte e dello Spettacolo | ScuoladiStudiUmanisticiedellaFormazione | 1:`B302` 2:`B302` 3:`B028` | 1,2,3 | 7,6,2 | 7,0,2 | ✅ orari+esami |
| Psicologia Clinica e della Salute e Neuropsicologia (magistrale) | ScuoladiPsicologia | 1:`B368` 2:`B368` | 1,2 | 7,9 | 91,24 | ✅ orari+esami |
| Psicologia Clinica e della Salute e Neuropsicologia (magistrale) (B267) | ScuoladiPsicologia | 2:`B368` | 2 | 9 | 24 | ✅ orari+esami |
| Psicologia del Ciclo di Vita e dei Contesti (magistrale) | ScuoladiPsicologia | 1:`B369` 2:`B369` | 1,2 | 13,2 | 80,21 | ✅ orari+esami |
| Psicologia del Ciclo di Vita e dei Contesti (magistrale) (B266) | ScuoladiPsicologia | 2:`B369` | 2 | 2 | 21 | ✅ orari+esami |
| Relazioni Internazionali e Studi Europei | ScuoladiScienzePoliticheCesareAlfieri | 1:`B416` 2:`B416` | 1,2 | 18,34 | 6,(119) | ✅ orari+esami |
| Robotics, Automation and Electrical Engineering | ScuoladiIngegneria | 1:`B336` 2:`B336` | 1,2 | 46,34 | 1,1 | ✅ orari+esami |
| Scienza dei Materiali | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B300` 2:`B300` 3:`B258` | 1,2,3 | 17,16,15 | 1,0,(33) | ✅ orari+esami |
| Scienze Agrarie [B020] | ScuoladiAgraria | 2:`B397` 3:`B020` | 2,3 | 11,10 | 32,42 | ✅ orari+esami |
| Scienze Agrarie [b397] | ScuoladiAgraria | 1:`B397` | 1 | 6 | 52 | ✅ orari+esami |
| Scienze Archivistiche e Biblioteconomiche | ScuoladiStudiUmanisticiedellaFormazione | 1:`B349` 2:`B349` | 1,2 | 11,22 | 9,0 | ✅ orari+esami |
| Scienze Biologiche | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B310` 2:`B310` 3:`B005` | 1,2,3 | 19,8,6 | 2,0,(41) | ✅ orari+esami |
| Scienze Chimiche | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B371` 2:`B371` | 1,2 | 37,27 | (138),0 | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Scienze dei Servizi Giuridici | ScuoladiGiurisprudenza | 1:`B311` 2:`B311` 3:`B006` | 1,2,3 | 11,8,24 | 9,(1),3 | ✅ orari+esami |
| Scienze Dell'alimentazione | ScuoladiScienzedellaSaluteUmana | 1:`B373` 2:`B373` | 1,2 | 10,4 | 14,(1) | ✅ orari+esami |
| Scienze Dell'architettura | ScuoladiArchitettura | 1:`B313` 2:`B313` 3:`B008` | 1,2,3 | 14,16,5 | 7,0,6 | ✅ orari+esami |
| Scienze Dell'educazione e della Formazione | ScuoladiStudiUmanisticiedellaFormazione | 1:`B429` 2:`B315` 3:`B219` | 1,2,3 | 13,7,8 | 16,0,12 | ✅ orari+esami |
| Scienze della Formazione Primaria | ScuoladiStudiUmanisticiedellaFormazione | 1:`B198` 2:`B198` 3:`B198_1` 4:`B198_1` 5:`B198_1` | 1,2,3,4,5 | 8,11,6,6,6 | 19,16,0,0,0 | ✅ orari+esami |
| Scienze della Natura e Dell'uomo | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B372` 2:`B372` | 1,2 | 23,14 | 3,3 | ✅ orari+esami |
| Scienze della Natura e dell'Uomo | ScuoladiScienzeMatematiche-FisicheeNaturali | 2:`B372` | 2 | 29 | 3 | ✅ orari+esami |
| Scienze dello Spettacolo | ScuoladiStudiUmanisticiedellaFormazione | 1:`B420` 2:`B420` | 1,2 | 25,2 | 14,0 | ✅ orari+esami |
| Scienze e Gestione delle Risorse Faunistico-ambientali [B112] | ScuoladiAgraria | 2:`B381` | 2 | 5 | 18 | ✅ orari+esami |
| Scienze e Gestione delle Risorse Faunistico-ambientali [b381] | ScuoladiAgraria | 1:`B381` | 1 | 13 | 52 | ✅ orari+esami |
| Scienze e Materiali per la Conservazione e il Restauro | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B407` 2:`B407` | 1,2 | 12,8 | (34),0 | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Scienze e Tecniche dello Sport e delle Attività Motorie Preventive e Adattate | ScuoladiScienzedellaSaluteUmana | 1:`B390` 2:`B390` | 1,2 | 11,3 | 10,(1) | ✅ orari+esami |
| Scienze e Tecniche Psicologiche (magistrale) | ScuoladiPsicologia | 1:`B319` 2:`B319` | 1,2 | 6,5 | 56,15 | ✅ orari+esami |
| Scienze e Tecniche Psicologiche (triennale) | ScuoladiPsicologia | 2:`B319` 3:`B018` | 2,3 | 5,9 | 15,83 | ✅ orari+esami |
| Scienze e Tecnologie Agrarie [b098] | ScuoladiAgraria | 2:`B375` | 2 | 35 | 131 | ✅ orari+esami |
| Scienze e Tecnologie Agrarie [b375] | ScuoladiAgraria | 1:`B375` | 1 | 9 | 66 | ✅ orari+esami |
| Scienze e Tecnologie dei Sistemi Forestali [b102] | ScuoladiAgraria | 2:`B425` | 2 | 15 | 43 | ✅ orari+esami |
| Scienze e Tecnologie dei Sistemi Forestali [b425] | ScuoladiAgraria | 1:`B425` | 1 | 9 | 56 | ✅ orari+esami |
| Scienze e Tecnologie Geologiche | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B376` 2:`B376` | 1,2 | 48,32 | (137),0 | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Scienze e Tecnologie per la Gestione degli Spazi Verdi e del Paesaggio [b235] | ScuoladiAgraria | 3:`B235` | 3 | 11 | 57 | ✅ orari+esami |
| Scienze Farmaceutiche Applicate-controllo Qualità | ScuoladiScienzedellaSaluteUmana | 1:`B400` 2:`B400` 3:`B193` | 1,2,3 | 9,6,9 | 17,6,17 | ✅ orari+esami |
| Scienze Faunistiche [B191] | ScuoladiAgraria | 2:`B329` 3:`B191` | 2,3 | 9,6 | 33,43 | ✅ orari+esami |
| Scienze Faunistiche [b329] | ScuoladiAgraria | 1:`B329` | 1 | 7 | 49 | ✅ orari+esami |
| Scienze Filosofiche | ScuoladiStudiUmanisticiedellaFormazione | 1:`B378` 2:`B378` | 1,2 | 64,30 | 34,15 | ✅ orari+esami |
| Scienze Forestali e Ambientali [b019] | ScuoladiAgraria | 2:`B396` 3:`B019` | 2,3 | 5,7 | 35,47 | ✅ orari+esami |
| Scienze Forestali e Ambientali [b396] | ScuoladiAgraria | 1:`B396` | 1 | 9 | 53 | ✅ orari+esami |
| Scienze Geologiche | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B326` 2:`B326` 3:`B035` | 1,2,3 | 11,14,7 | (18),0,(19) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Scienze Infermieristiche e Ostetriche | ScuoladiScienzedellaSaluteUmana | 2:`B180` | 2 | 13 | 2 | ✅ orari+esami |
| Scienze Motorie, Sport e Salute | ScuoladiScienzedellaSaluteUmana | 1:`B318` 2:`B318` 3:`B122` | 1,2,3 | 10,9,11 | 23,11,7 | ✅ orari+esami |
| Scienze Naturali | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B325` 2:`B325` 3:`B033` | 1,2,3 | 6,12,3 | 3,0,(39) | ✅ orari+esami |
| Scienze Pedagogiche e Management della Formazione per lo Sviluppo Sostenibile | ScuoladiStudiUmanisticiedellaFormazione | 1:`B389` 2:`B389` | 1,2 | 6,6 | 12,0 | ✅ orari+esami |
| Scienze Politiche (magistrale) | ScuoladiScienzePoliticheCesareAlfieri | 1:`B403` 2:`B403` | 1,2 | 18,77 | 3,7 | ✅ orari+esami |
| Scienze Politiche (triennale) | ScuoladiScienzePoliticheCesareAlfieri | 2:`B403` 3:`B037` | 2,3 | 77,45 | 7,2 | ✅ orari+esami |
| Scienze Riabilitative delle Professioni Sanitarie | ScuoladiScienzedellaSaluteUmana | 1:`B181` 2:`B181` | 1,2 | 1,1 | 5,(13) | ✅ orari+esami |
| Scienze Storiche | ScuoladiStudiUmanisticiedellaFormazione | 1:`B380` 2:`B380` | 1,2 | 14,25 | 25,0 | ✅ orari+esami |
| Scienze Umanistiche per la Comunicazione | ScuoladiStudiUmanisticiedellaFormazione | 1:`B316` 2:`B316` 3:`B195` | 1,2,3 | 6,13,2 | 16,0,8 | ✅ orari+esami |
| Scienze Vivaistiche e Progettazione degli Spazi Verdi [b398] | ScuoladiAgraria | 1:`B398` | 1 | 6 | 44 | ✅ orari+esami |
| Semestre Filtro | ScuoladiScienzedellaSaluteUmana | 1:`SFM` | 1 | 24 | (2) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Servizio Sociale (magistrale) | ScuoladiScienzePoliticheCesareAlfieri | 1:`B330` 2:`B330` | 1,2 | 5,16 | 1,1 | ✅ orari+esami |
| Servizio Sociale (triennale) | ScuoladiScienzePoliticheCesareAlfieri | 2:`B330` 3:`B201` | 2,3 | 16,5 | 1,(29) | ✅ orari+esami |
| Sociologia e Sfide Globali | ScuoladiScienzePoliticheCesareAlfieri | 1:`B383` 2:`B383` | 1,2 | 6,15 | (24),1 | ✅ orari+esami |
| Software: Science and Technology | ScuoladiScienzeMatematiche-FisicheeNaturali | 1:`B335` 2:`B335` | 1,2 | 14,6 | 3,0 | ✅ orari+esami |
| Statistica | ScuoladiEconomiaeManagement | 1:`B331` 3:`B039` | 1,3 | 13,11 | (55),(45) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Statistica e Data Science | ScuoladiEconomiaeManagement | 1:`B379` 2:`B379` | 1,2 | 9,23 | (32),0 | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Storia | ScuoladiStudiUmanisticiedellaFormazione | 1:`B332` 2:`B332` 3:`B040` | 1,2,3 | 5,26,22 | 6,0,20 | ✅ orari+esami |
| Storia Dell'arte | ScuoladiStudiUmanisticiedellaFormazione | 1:`B384` 2:`B384` | 1,2 | 15,3 | 15,0 | ✅ orari+esami |
| Storia e Tutela dei Beni Archeologici, Artistici, Archivistici e Librari | ScuoladiStudiUmanisticiedellaFormazione | 1:`B392` 2:`B392` 3:`B001` | 1,2,3 | 42,81,29 | 16,0,26 | ✅ orari+esami |
| Strategie di Comunicazione nella Società Digitale | ScuoladiScienzePoliticheCesareAlfieri | 1:`B419` 2:`B419` | 1,2 | 14,24 | (54),(11) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Sustainable Business for Societal Challenges | ScuoladiEconomiaeManagement | 1:`B314` | 1 | 9 | 13 | ✅ orari+esami |
| Sustainable Business for Societal Challenges. | ScuoladiEconomiaeManagement | 3:`B247` | 3 | 7 | 5 | ✅ orari+esami |
| Sviluppo Sostenibile, Cooperazione e Gestione dei Conflitti (magistrale) | ScuoladiEconomiaeManagement | 1:`B328` 2:`B328` | 1,2 | 8,12 | (40),11 | ✅ orari+esami |
| Sviluppo Sostenibile, Cooperazione e Gestione dei Conflitti (triennale) | ScuoladiEconomiaeManagement | 3:`B243` | 3 | 28 | 5 | ✅ orari+esami |
| Tecniche della Prevenzione Nell'ambiente e Nei Luoghi di Lavoro (abilitante alla Professione Sanitaria di Tecnico della Prevenzione Nell'ambiente e Nei Luoghi di Lavoro) | ScuoladiScienzedellaSaluteUmana | 1:`B179` 2:`B179` 3:`B179` | 1,2,3 | 11,5,2 | 4,6,(34) | ✅ orari+esami |
| Tecniche di Laboratorio Biomedico (abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico) | ScuoladiScienzedellaSaluteUmana | 1:`B174` 2:`B174` 3:`B174` | 1,2,3 | 7,15,7 | 30,1,5 | ✅ orari+esami |
| Tecniche di Neurofisiopatologia (abilitante alla Professione Sanitaria di Tecnico di Neurofisiopatologia) | ScuoladiScienzedellaSaluteUmana | 1:`B202` 2:`B202` 3:`B202` | 1,2,3 | 5,1,2 | 18,(3),5 | ✅ orari+esami |
| Tecniche di Radiologia Medica, per Immagini e Radioterapia (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica) | ScuoladiScienzedellaSaluteUmana | 1:`B176` 2:`B176` 3:`B176` | 1,2,3 | 7,11,4 | 16,(11),1 | ✅ orari+esami |
| Tecniche e Tecnologie per le Costruzioni e il Territorio | ScuoladiIngegneria | 1:`B273` 2:`B273` | 1,2 | 8,9 | (64),(33) | 🟢 solo orari (esami: nessun appello 2026/27; presenti nel 2025/26 → riattivare quando pubblicano) |
| Tecniche Ortopediche (abilitante alla Professione Sanitaria di Tecnico Ortopedico) | ScuoladiScienzedellaSaluteUmana | 1:`B177` 2:`B177` 3:`B177` | 1,2,3 | 5,3,4 | 29,14,6 | ✅ orari+esami |
| Tecnologie Alimentari [b024] | ScuoladiAgraria | 2:`B320` 3:`B024` | 2,3 | 8,4 | 34,22 | ✅ orari+esami |
| Tecnologie Alimentari [b320] | ScuoladiAgraria | 1:`B320` | 1 | 6 | 51 | ✅ orari+esami |
| Tecnologie e Trasformazioni Avanzate per il Settore Legno Arredo Edilizia [b272] | ScuoladiAgraria | 1:`B272` 2:`B272` | 1,2 | 9,11 | 77,72 | ✅ orari+esami |
| Tropical and Subtropical Agriculture [b421] | ScuoladiAgraria | 1:`B421` | 1 | 7 | 53 | ✅ orari+esami |
| Viticoltura ed Enologia [b022] | ScuoladiAgraria | 2:`B399` 3:`B022` | 2,3 | 9,5 | 22,43 | ✅ orari+esami |
| Viticoltura ed Enologia [b399] | ScuoladiAgraria | 1:`B399` | 1 | 8 | 61 | ✅ orari+esami |

Nota appelli: numero senza parentesi = appelli nella finestra 2026/27; tra parentesi = solo nella finestra 2025/26 (calendario nuovo non ancora pubblicato).

### Codici ricatturati (132 anni)

| Corso | Anno | corso prima → dopo | anno2 prima → dopo |
|---|---|---|---|
| Accounting, Auditing e Controllo | 2 | `B249` → `B377` | `F033\|2, F074\|2, F032\|2` → `F033\|2, F074\|2, F032\|2` |
| Advanced Molecular Sciences | 2 | `B234` → `B370` | `GEN\|2` → `GEN\|2` |
| Archeologia | 2 | `B060` → `B347` | `E32\|2, E33\|2, E31\|2, E30\|2` → `E32\|2, E33\|2, E31\|2, E30\|2` |
| Architettura (magistrale) | 2 | `B076` → `B430` | `D59\|2, C61\|2` → `D59\|2, C61\|2` |
| Architettura (magistrale) (B348) | 1 | `B348` → `B430` | `D59\|1, C61\|1` → `D59\|1, C61\|1` |
| Architettura (ciclo unico) | 2 | `B117` → `B387` | `GEN\|2` → `GEN\|2` |
| Architettura del Paesaggio (magistrale) (B268) | 2 | `B268` → `B409` | `GEN\|2` → `GEN\|2` |
| Biologia Dell'ambiente e del Comportamento (magistrale) (B232) | 2 | `B232` → `B350` | `E86\|2, E85\|2` → `E86\|2, E85\|2` |
| Biologia Molecolare e Applicata | 2 | `B230` → `B351` | `E65\|2, E63\|2, E64\|2` → `E65\|2, E63\|2, E64\|2` |
| Biotecnologie | 2 | `B014` → `B301` | `D72\|2, D70\|2, D71\|2` → `D72\|2, D70\|2, D71\|2` |
| Biotecnologie Mediche e Farmaceutiche | 1 | `B353` → `B353` | `GEN\|1` → `F100\|1, F099\|1, F101\|1, F102\|1` |
| Biotecnologie Mediche e Farmaceutiche | 2 | `B121` → `B353` | `GEN\|2` → `GEN\|2` |
| Biotecnologie Molecolari | 2 | `B108` → `B352` | `GEN\|2` → `GEN\|2` |
| Biotecnologie per la Gestione Ambientale e L'agricoltura Sostenibile [b225] | 2 | `B225` → `B422` | `GEN\|2` → `GEN\|2` |
| Chimica | 2 | `B025` → `B321` | `C78\|2, C79\|2` → `C78\|2, C79\|2` |
| Chimica e Tecnologia Farmaceutiche (ciclo unico) | 2 | `B263` → `B356` | `GEN\|2` → `GEN\|2` |
| Chimica e Tecnologia Farmaceutiche (ciclo unico) | 5 | `B263` → `B053` | `GEN\|5` → `GEN\|5` |
| Chimica e Tecnologia Farmaceutiche (ciclo unico) (B053) | 4 | `B053` → `B263` | `GEN\|4` → `GEN\|4` |
| Data Science, Calcolo Scientifico and Intelligenza Artificiale | 2 | `B257` → `B343` | `GEN\|2` → `GEN\|2` |
| Design per L'innovazione Sostenibile (magistrale) (B270) | 2 | `B270` → `B355` | `GEN\|2` → `GEN\|2` |
| Design Sistema Moda | 2 | `B220` → `B354` | `GEN\|2` → `GEN\|2` |
| Design Tessile e Moda (triennale) | 2 | `B246` → `B404` | `GEN\|2` → `GEN\|2` |
| Diagnostica e Materiali per la Conservazione e il Restauro | 2 | `B186` → `B405` | `GEN\|2` → `GEN\|2` |
| Dirigenza Scolastica e Pedagogia per L'inclusione | 1 | `B367` → `B431` | `GEN\|1` → `GEN\|1` |
| Dirigenza Scolastica e Pedagogia per L'inclusione | 2 | `B261` → `B367` | `GEN\|2` → `GEN\|2` |
| Diritto per le Sostenibilita' e la Sicurezza | 1 | `B386` → `B433` | `GEN\|1` → `F109\|1, F110\|1` |
| Diritto per le Sostenibilita' e la Sicurezza | 2 | `B256` → `B386` | `GEN\|2` → `GEN\|2` |
| Discipline delle Arti, della Musica e dello Spettacolo | 2 | `B027` → `B401` | `GEN\|2` → `GEN\|2` |
| Farmacia (ciclo unico) | 2 | `B264` → `B357` | `GEN\|2` → `GEN\|2` |
| Farmacia (ciclo unico) | 5 | `B264` → `B054` | `GEN\|5` → `GEN\|5` |
| Farmacia (ciclo unico) (B054) | 4 | `B054` → `B264` | `GEN\|4` → `GEN\|4` |
| Filologia Moderna | 2 | `B055` → `B333` | `B90\|2, D48\|2, E38\|2` → `B90\|2, D48\|2, E38\|2` |
| Filologia, Letteratura e Storia Dell'antichità | 2 | `B056` → `B334` | `D92\|2, D93\|2` → `D92\|2, D93\|2` |
| Filosofia | 2 | `B042` → `B304` | `GEN\|2` → `GEN\|2` |
| Fisica e Astrofisica | 2 | `B030` → `B322` | `GEN\|2` → `GEN\|2` |
| Geoengineering | 2 | `B226` → `B361` | `GEN\|2` → `GEN\|2` |
| Geography, Spatial Management, Heritage for International Cooperation | 2 | `B231` → `B427` | `GEN\|2` → `GEN\|2` |
| Giurisprudenza (ciclo unico) | 5 | `B344` → `1170` | `GEN\|5` → `GEN\|5` |
| Giurisprudenza (ciclo unico) (1170) | 2 | `1170` → `B344` | `GEN_A-G\|2, GEN_H-Z\|2` → `GEN_A-G\|2, GEN_H-Z\|2` |
| Giurisprudenza Italiana e Francese | 2 | `B250` → `B345` | `GEN\|2` → `GEN\|2` |
| Giurisprudenza Italiana e Tedesca | 2 | `B218` → `B346` | `GEN\|2` → `GEN\|2` |
| Governo e Direzione D'impresa | 2 | `B105` → `B426` | `B72\|2, B73\|2` → `B72\|2, B73\|2` |
| Informatica | 2 | `B032` → `B324` | `GEN\|2` → `GEN\|2` |
| Ingegneria Ambientale | 2 | `B254` → `B305` | `F046\|2, F048\|2, F047\|2` → `F046\|2, F048\|2, F047\|2` |
| Ingegneria Biomedica (triennale) | 2 | `B237` → `B388` | `GEN\|2` → `GEN\|2` |
| Ingegneria Biomedica (magistrale) | 1 | `B359` → `B359` | `F057\|1, F058\|1, F059\|1, F060\|1` → `F104\|1, F103\|1, F058\|1, F105\|1` |
| Ingegneria Biomedica (magistrale) | 2 | `B061` → `B359` | `F057\|2, F058\|2, F059\|2, F060\|2` → `F057\|2, F058\|2, F059\|2, F060\|2` |
| Ingegneria Civile | 2 | `B062` → `B360` | `E17\|2, E16\|2, E18\|2` → `E17\|2, E16\|2, E18\|2` |
| Ingegneria Civile e Edile per la Sostenibilità | 1 | `B306` → `B306` | `F062\|1, F064\|1, F063\|1` → `F108\|1, F107\|1, F106\|1` |
| Ingegneria Civile e Edile per la Sostenibilità | 2 | `B259` → `B306` | `F062\|2, F064\|2, F063\|2` → `F062\|2, F064\|2, F063\|2` |
| Ingegneria dei Sistemi Elettronici | 1 | `B337` → `B337` | `F022\|1, F021\|1, F020\|1, F023\|1` → `F098\|1, F020\|1, F097\|1, F023\|1` |
| Ingegneria dei Sistemi Elettronici | 2 | `B245` → `B337` | `F022\|2, F021\|2, F020\|2, F023\|2` → `F022\|2, F021\|2, F020\|2, F023\|2` |
| Ingegneria Edile | 2 | `B063` → `B408` | `GEN\|2` → `GEN\|2` |
| Ingegneria Elettronica | 2 | `B244` → `B307` | `F017\|2, F018\|2, F019\|2` → `F017\|2, F018\|2, F019\|2` |
| Ingegneria Energetica | 2 | `B068` → `B410` | `E83\|2, E84\|2` → `E83\|2, E84\|2` |
| Ingegneria Gestionale | 2 | `B222` → `B406` | `E62\|2, E62_A-L\|2, E62_M-Z\|2, F006\|2, F006_A-L\|2, F006_M-Z\|2, E45\|2, E45_A-L\|2, E45_M-Z\|2` → `F087\|2, F086\|2, F089\|2, F088\|2` |
| Ingegneria Informatica (magistrale) | 2 | `B070` → `B339` | `F027\|2, F026\|2, F025\|2, F024\|2` → `F027\|2, F026\|2, F025\|2, F024\|2` |
| Ingegneria Informatica (triennale) | 2 | `B047` → `B308` | `E70\|2, E69\|2` → `E70\|2, E69\|2` |
| Ingegneria Meccanica (magistrale) | 2 | `B071` → `B412` | `E05\|2, E61\|2, E90\|2, E06\|2, E42\|2, E41\|2, E72\|2, E73\|2` → `E05\|2, E61\|2, E90\|2, E06\|2, E42\|2, E41\|2, E72\|2, E73\|2` |
| Ingegneria Meccanica (triennale) | 2 | `B049` → `B309` | `F052_A-L\|2, F052_M-Z\|2, F051_A-L\|2, F051_M-Z\|2, F054_A-L\|2, F054_M-Z\|2, F053_A-L\|2, F053_M-Z\|2, F055_A-L\|2, F055_M-Z\|2, F077_A-L\|2, F077_M-Z\|2, F078_A-L\|2, F078_M-Z\|2` → `F052_A-L\|2, F052_M-Z\|2, F051_A-L\|2, F051_M-Z\|2, F054_A-L\|2, F054_M-Z\|2, F053_A-L\|2, F053_M-Z\|2, F055_A-L\|2, F055_M-Z\|2, F077_A-L\|2, F077_M-Z\|2, F078_A-L\|2, F078_M-Z\|2` |
| Ingegneria Meccanica (triennale) | 3 | `B049` → `B049` | `F050_A-L\|3, F050_M-Z\|3, F049_A-L\|3, F049_M-Z\|3, F052_A-L\|3, F052_M-Z\|3, F051_A-L\|3, F051_M-Z\|3, F054_A-L\|3, F054_M-Z\|3, F053_A-L\|3, F053_M-Z\|3, F055_A-L\|3, F055_M-Z\|3` → `F052\|3, F051\|3, F054\|3, F053\|3, F055\|3, F077\|3, F078\|3` |
| Ingegneria per la Tutela Dell'ambiente e del Territorio | 1 | `B362` → `B362` | `E75\|1, E74\|1` → `F111\|1, F112\|1` |
| Ingegneria per la Tutela Dell'ambiente e del Territorio | 2 | `B072` → `B362` | `E75\|2, E74\|2` → `E75\|2, E74\|2` |
| Innovazione Sostenibile in Viticoltura ed Enologia [b253] | 2 | `B253` → `B424` | `F044\|2, F045\|2` → `F093\|2, F094\|2` |
| Intelligenza Artificiale | 2 | `B241` → `B340` | `GEN\|2` → `GEN\|2` |
| Intermediazione Culturale e Religiosa | 2 | `B242` → `B342` | `GEN\|2` → `GEN\|2` |
| Lettere | 2 | `B200` → `B393` | `D85\|2, D86\|2` → `D85\|2, D86\|2` |
| Lingue e Civiltà Dell'asia e Dell'africa | 2 | `B262` → `B363` | `GEN\|2` → `GEN\|2` |
| Lingue e Letterature Europee e Americane | 2 | `B074` → `B413` | `F03\|2, F01\|2, C35\|2, C81\|2, F02\|2` → `F03\|2, LETE2\|2, F01\|2, C35\|2, C81\|2, F02\|2` |
| Lingue, Letterature e Studi Interculturali | 2 | `B004` → `B394` | `C09\|2, C80\|2, D42\|2` → `LETI2\|2, C09\|2, C80\|2, D42\|2` |
| Lingue, Letterature e Studi Interculturali | 3 | `B004` → `B004` | `LET\|3, C09\|3, C80\|3, D42\|3` → `LETI3\|3, C09\|3, C80\|3, D42\|3` |
| Management Engineering | 2 | `B271` → `B338` | `F061\|2` → `F061\|2` |
| Matematica (magistrale) | 2 | `B077` → `B364` | `C76\|2, E24\|2, C75\|2` → `C76\|2, E24\|2, C75\|2` |
| Matematica (triennale) | 2 | `B036` → `B327` | `GEN\|2` → `GEN\|2` |
| Mechanical Engineering for Sustainability | 2 | `B248` → `B341` | `F029\|2, F030\|2, F031\|2` → `F029\|2, F030\|2, F031\|2` |
| Medicina e Chirurgia | 2 | `B240` → `B414` | `GEN\|2` → `GEN\|2` |
| Medicina e Chirurgia | 6 | `B120` → `B240` | `GEN\|6` → `GEN\|6` |
| Odontoiatria e Protesi Dentaria (ciclo unico) | 2 | `B265` → `B365` | `GEN\|2` → `GEN\|2` |
| Odontoiatria e Protesi Dentaria (ciclo unico) | 5 | `B265` → `B125` | `GEN\|5` → `GEN\|5` |
| Odontoiatria e Protesi Dentaria (ciclo unico) (B125) | 4 | `B125` → `B265` | `GEN\|4` → `GEN\|4` |
| Ottica e Optometria | 2 | `B031` → `B323` | `GEN\|2` → `GEN\|2` |
| Pianificazione della Citta', del Territorio e del Paesaggio (triennale) | 2 | `B016` → `B317` | `GEN\|2` → `GEN\|2` |
| Pianificazione e Progettazione per la Sostenibilità Urbana e Territoriale (magistrale) (B269) | 2 | `B269` → `B366` | `F068\|2, F069\|2` → `F068\|2, F069\|2` |
| Pratiche, Linguaggi e Culture della Comunicazione | 2 | `B252` → `B385` | `GEN\|2` → `GEN\|2` |
| Progettazione e Gestione di Eventi e Imprese Dell'arte e dello Spettacolo | 2 | `B028` → `B302` | `GEN\|2` → `GEN\|2` |
| Psicologia Clinica e della Salute e Neuropsicologia (magistrale) (B267) | 2 | `B267` → `B368` | `E21\|2, B38\|2, F070\|2` → `E21\|2, B38\|2, F070\|2` |
| Psicologia del Ciclo di Vita e dei Contesti (magistrale) (B266) | 2 | `B266` → `B369` | `F073\|2, F071\|2, F072\|2` → `F073\|2, F071\|2, F072\|2` |
| Relazioni Internazionali e Studi Europei | 2 | `B416` → `B416` | `GEN\|2, LM 52\|2, LM 90\|2` → `B416_LM 52\|2, B416_LM 90\|2, GEN\|2` |
| Robotics, Automation and Electrical Engineering | 2 | `B274` → `B336` | `F080\|2, F079\|2` → `F080\|2, F079\|2` |
| Scienza dei Materiali | 2 | `B258` → `B300` | `GEN\|2` → `GEN\|2` |
| Scienze Agrarie [B020] | 2 | `B020` → `B397` | `GEN\|2` → `GEN\|2` |
| Scienze Archivistiche e Biblioteconomiche | 2 | `B084` → `B349` | `GEN\|2` → `GEN\|2` |
| Scienze Biologiche | 2 | `B005` → `B310` | `GEN\|2` → `GEN\|2` |
| Scienze Chimiche | 2 | `B088` → `B371` | `D22\|2, D23\|2, D21\|2, D24\|2, D20\|2` → `D22\|2, D23\|2, D21\|2, D24\|2, D20\|2` |
| Scienze dei Servizi Giuridici | 2 | `B006` → `B311` | `GEN\|2` → `GEN\|2` |
| Scienze Dell'alimentazione | 2 | `B207` → `B373` | `GEN\|2` → `GEN\|2` |
| Scienze Dell'architettura | 2 | `B008` → `B313` | `GEN\|2` → `GEN\|2` |
| Scienze Dell'educazione e della Formazione | 1 | `B315` → `B429` | `GEN\|1` → `GEN\|1` |
| Scienze Dell'educazione e della Formazione | 2 | `B219` → `B315` | `GEN\|2` → `GEN\|2` |
| Scienze della Formazione Primaria | 3 | `B198` → `B198_1` | `GEN\|3` → `GEN\|3` |
| Scienze della Formazione Primaria | 4 | `B198` → `B198_1` | `GEN\|4` → `GEN\|4` |
| Scienze della Formazione Primaria | 5 | `B198` → `B198_1` | `GEN\|5` → `GEN\|5` |
| Scienze della Natura e dell'Uomo | 2 | `B093` → `B372` | `D28\|2, F034\|2, D51\|2` → `D28\|2, F034\|2, D51\|2` |
| Scienze dello Spettacolo | 2 | `B097` → `B420` | `D88\|2, D50\|2, B69\|2` → `D88\|2, D50\|2, B69\|2` |
| Scienze e Gestione delle Risorse Faunistico-ambientali [B112] | 2 | `B112` → `B381` | `GEN\|2` → `GEN\|2` |
| Scienze e Materiali per la Conservazione e il Restauro | 2 | `B194` → `B407` | `GEN\|2` → `GEN\|2` |
| Scienze e Tecniche dello Sport e delle Attività Motorie Preventive e Adattate | 2 | `B185` → `B390` | `GEN\|2` → `GEN\|2` |
| Scienze e Tecniche Psicologiche (triennale) | 2 | `B018` → `B319` | `B13\|2, D47\|2, B14\|2, D46\|2` → `B13\|2, D47\|2, B14\|2, D46\|2` |
| Scienze e Tecnologie Agrarie [b098] | 2 | `B098` → `B375` | `E92\|2, E53\|2, F065\|2, C45\|2, C47\|2, E91\|2` → `E92\|2, E53\|2, F065\|2, C45\|2, C47\|2, E91\|2` |
| Scienze e Tecnologie Agrarie [b375] | 1 | `B375` → `B375` | `E92\|1, E53\|1, F065\|1, C45\|1, C47\|1, E91\|1` → `F113\|1, F115\|1, F114\|1` |
| Scienze e Tecnologie dei Sistemi Forestali [b102] | 2 | `B102` → `B425` | `E76\|2, E55\|2, E77\|2, F037\|2` → `F090\|2, F091\|2, F092\|2` |
| Scienze e Tecnologie Geologiche | 2 | `B103` → `B376` | `D25\|2, F001\|2, F002\|2, E48\|2` → `D25\|2, F001\|2, F002\|2, E48\|2` |
| Scienze Farmaceutiche Applicate-controllo Qualità | 2 | `B193` → `B400` | `GEN\|2` → `GEN\|2` |
| Scienze Faunistiche [B191] | 2 | `B191` → `B329` | `GEN\|2` → `GEN\|2` |
| Scienze Filosofiche | 2 | `B106` → `B378` | `F042\|2, F043\|2, F040\|2, F041\|2` → `F042\|2, F043\|2, F040\|2, F041\|2` |
| Scienze Forestali e Ambientali [b019] | 2 | `B019` → `B396` | `GEN\|2` → `GEN\|2` |
| Scienze Geologiche | 2 | `B035` → `B326` | `GEN\|2` → `GEN\|2` |
| Scienze Motorie, Sport e Salute | 2 | `B122` → `B318` | `GEN\|2` → `GEN\|2` |
| Scienze Naturali | 2 | `B033` → `B325` | `GEN\|2` → `GEN\|2` |
| Scienze Pedagogiche e Management della Formazione per lo Sviluppo Sostenibile | 2 | `B260` → `B389` | `GEN\|2` → `GEN\|2` |
| Scienze Politiche (triennale) | 2 | `B037` → `B403` | `D76\|2, D77\|2, D75\|2, D78\|2` → `D76\|2, F085\|2, D77\|2, D75\|2, D78\|2` |
| Scienze Storiche | 2 | `B111` → `B380` | `F039\|2, F038\|2` → `GEN\|2` |
| Scienze Umanistiche per la Comunicazione | 2 | `B195` → `B316` | `GEN\|2` → `GEN\|2` |
| Semestre Filtro | 1 | `SFM` → `SFM` | `A\|1, B\|1, C\|1, D\|1, E\|1, F\|1, N\|1, O\|1, P\|1, Q\|1, U\|1` → `BIO\|1, CHI\|1, FIS\|1, T\|1` |
| Servizio Sociale (triennale) | 2 | `B201` → `B330` | `GEN\|2` → `GEN\|2` |
| Software: Science and Technology | 2 | `B255` → `B335` | `GEN\|2` → `GEN\|2` |
| Statistica e Data Science | 2 | `B236` → `B379` | `F076\|2, F075\|2` → `F076\|2, F075\|2` |
| Storia | 2 | `B040` → `B332` | `GEN\|2` → `GEN\|2` |
| Storia Dell'arte | 2 | `B115` → `B384` | `GEN\|2` → `GEN\|2` |
| Storia e Tutela dei Beni Archeologici, Artistici, Archivistici e Librari | 2 | `B001` → `B392` | `B51\|2, B55\|2, B52\|2` → `B51\|2, B55\|2, B52\|2` |
| Tecnologie Alimentari [b024] | 2 | `B024` → `B320` | `GEN\|2` → `GEN\|2` |
| Viticoltura ed Enologia [b022] | 2 | `B022` → `B399` | `GEN\|2` → `GEN\|2` |

### Anni rimossi da livePrograms (25; 6 programmi interi)

Restano disponibili in modalità manuale. Codici originali (scuola + corso + anno2) conservati per un eventuale ripristino quando gli orari 2026/27 verranno pubblicati.

| Corso | scuola | Anno | corso originale | anno2 originale | Motivo |
|---|---|---|---|---|---|
| Advanced Molecular Sciences | ScuoladiScienzeMatematiche-FisicheeNaturali | 1 | `B370` | `GEN\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Biotecnologie | ScuoladiScienzedellaSaluteUmana | 1 | `B301` | `D72\|1, D70\|1, D71\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Design of Sustainable Tourism Systems | ScuoladiEconomiaeManagement | 2 | `B205` | `GEN\|2` | corso assente dal combo 2026 |
| Economia Aziendale | ScuoladiEconomiaeManagement | 2 | `B009` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Economia e Commercio | ScuoladiEconomiaeManagement | 2 | `B034` | `F013\|2, F011\|2, F012\|2, F04\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Economics and Development (magistrale) (B214) (intero) | ScuoladiEconomiaeManagement | 2 | `B214` | `E20\|2, E19\|2` | corso assente dal combo 2026 |
| Finance and Risk Management | ScuoladiEconomiaeManagement | 2 | `B203` | `GEN\|2` | corso assente dal combo 2026 |
| Giurisprudenza Italiana e Francese | ScuoladiGiurisprudenza | 3 | `B250` | `GEN\|3` | corso rinumerato ma nessun candidato verifica |
| Giurisprudenza Italiana e Francese | ScuoladiGiurisprudenza | 4 | `B250` | `GEN\|4` | corso rinumerato ma nessun candidato verifica |
| Giurisprudenza Italiana e Tedesca | ScuoladiGiurisprudenza | 3 | `B218` | `GEN\|3` | corso rinumerato ma nessun candidato verifica |
| Giurisprudenza Italiana e Tedesca | ScuoladiGiurisprudenza | 4 | `B218` | `GEN\|4` | corso rinumerato ma nessun candidato verifica |
| Giurisprudenza Italiana e Tedesca | ScuoladiGiurisprudenza | 5 | `B218` | `GEN\|5` | corso rinumerato ma nessun candidato verifica |
| Logica, Filosofia e Storia della Scienza (intero) | ScuoladiStudiUmanisticiedellaFormazione | 2 | `B107` | `GEN\|2` | corso assente dal combo 2026 |
| Natural Resources Management for Tropical Rural Development [b216] (intero) | ScuoladiAgraria | 2 | `B216` | `E28\|2, E29\|2` | corso assente dal combo 2026 |
| Odontoiatria e Protesi Dentaria (ciclo unico) | ScuoladiScienzedellaSaluteUmana | 1 | `B365` | `GEN\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Product, Interior, Communication and Eco-social Design (magistrale) | ScuoladiArchitettura | 2 | `B303` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Product, Interior, Communication and Eco-social Design (triennale) | ScuoladiArchitettura | 2 | `B251` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Scienze Dell'economia (intero) | ScuoladiEconomiaeManagement | 2 | `B089` | `D52\|2, E66\|2` | corso assente dal combo 2026 |
| Scienze e Tecnologie Alimentari [b188] (intero) | ScuoladiAgraria | 2 | `B188` | `GEN\|2` | corso assente dal combo 2026 |
| Scienze e Tecnologie per la Gestione degli Spazi Verdi e del Paesaggio [b235] | ScuoladiAgraria | 2 | `B235` | `E98\|2, E99\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Scienze Fisiche e Astrofisiche (intero) | ScuoladiScienzeMatematiche-FisicheeNaturali | 2 | `B058` | `D31\|2, F066\|2, F067\|2, D34\|2, D33\|2, D32\|2` | corso assente dal combo 2026 |
| Scienze Infermieristiche e Ostetriche | ScuoladiScienzedellaSaluteUmana | 1 | `B180` | `GEN\|1` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Statistica | ScuoladiEconomiaeManagement | 2 | `B039` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Sustainable Business for Societal Challenges. | ScuoladiEconomiaeManagement | 2 | `B247` | `GEN\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |
| Sviluppo Sostenibile, Cooperazione e Gestione dei Conflitti (triennale) | ScuoladiEconomiaeManagement | 2 | `B243` | `F015\|2, F014\|2, F016\|2` | corso in combo 2026 ma grid_call=0 celle (orari non pubblicati) |

## ScuoladiAgraria

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Biotecnologie per la Gestione Ambientale e L'agricoltura Sostenibile [b225] | `B225` | 2 | 11 | 32 | ✅ live orari+esami |
| Biotecnologie per la Gestione Ambientale e L'agricoltura Sostenibile [b422] | `B422` | 1 | 13 | 51 | ✅ live orari+esami |
| Food Design e Innovazione dei Prodotti Alimentari [b423] | `B423` | 1 | 9 | 40 | ✅ live orari+esami |
| Innovazione Sostenibile in Viticoltura ed Enologia [b253] | `B253` | 2 | 8 | 46 | ✅ live orari+esami |
| Innovazione Sostenibile in Viticoltura ed Enologia [b424] | `B424` | 1 | 9 | 44 | ✅ live orari+esami |
| Natural Resources Management for Tropical Rural Development [b216] | `B216` | 2 | 15 | 66 | ✅ live orari+esami |
| Scienze Agrarie [B020] | `B020` | 2,3 | 20 | 100 | ✅ live orari+esami |
| Scienze Agrarie [b397] | `B397` | 1 | 6 | 57 | ✅ live orari+esami |
| Scienze e Gestione delle Risorse Faunistico-ambientali [B112] | `B112` | 2 | 8 | 21 | ✅ live orari+esami |
| Scienze e Gestione delle Risorse Faunistico-ambientali [b381] | `B381` | 1 | 10 | 49 | ✅ live orari+esami |
| Scienze e Tecnologie Agrarie [b098] | `B098` | 2 | 34 | 164 | ✅ live orari+esami |
| Scienze e Tecnologie Agrarie [b375] | `B375` | 1 | 8 | 67 | ✅ live orari+esami |
| Scienze e Tecnologie Alimentari [b188] | `B188` | 2 | 9 | 21 | ✅ live orari+esami |
| Scienze e Tecnologie dei Sistemi Forestali [b102] | `B102` | 2 | 24 | 108 | ✅ live orari+esami |
| Scienze e Tecnologie dei Sistemi Forestali [b425] | `B425` | 1 | 9 | 45 | ✅ live orari+esami |
| Scienze e Tecnologie per la Gestione degli Spazi Verdi e del Paesaggio [b235] | `B235` | 2,3 | 21 | 136 | ✅ live orari+esami |
| Scienze Faunistiche [B191] | `B191` | 2,3 | 15 | 92 | ✅ live orari+esami |
| Scienze Faunistiche [b329] | `B329` | 1 | 8 | 42 | ✅ live orari+esami |
| Scienze Forestali e Ambientali [b019] | `B019` | 2,3 | 16 | 113 | ✅ live orari+esami |
| Scienze Forestali e Ambientali [b396] | `B396` | 1 | 9 | 50 | ✅ live orari+esami |
| Scienze Vivaistiche e Progettazione degli Spazi Verdi [b398] | `B398` | 1 | 6 | 58 | ✅ live orari+esami |
| Tecnologie Alimentari [b024] | `B024` | 2,3 | 14 | 88 | ✅ live orari+esami |
| Tecnologie Alimentari [b320] | `B320` | 1 | 6 | 66 | ✅ live orari+esami |
| Tecnologie e Trasformazioni Avanzate per il Settore Legno Arredo Edilizia [b272] | `B272` | 1,2 | 20 | 148 | ✅ live orari+esami |
| Tropical and Subtropical Agriculture [b421] | `B421` | 1 | 10 | 49 | ✅ live orari+esami |
| Viticoltura ed Enologia [b022] | `B022` | 2,3 | 15 | 87 | ✅ live orari+esami |
| Viticoltura ed Enologia [b399] | `B399` | 1 | 8 | 46 | ✅ live orari+esami |

## ScuoladiArchitettura

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Architettura | `B387` | 1 | 30 | 63 | ✅ live orari+esami |
| Architettura | `B348` | 1,2 | 13 | 39 | ✅ live orari+esami |
| Architettura | `B076` | 2 | 9 | 9 | ✅ live orari+esami |
| Architettura | `B117` | 2,3,4,5 | 67 | 274 | ✅ live orari+esami |
| Architettura del Paesaggio | `B409` | 1,2 | 6 | 19 | ✅ live orari+esami |
| Architettura del Paesaggio | `B268` | 2 | 6 | 13 | ✅ live orari+esami |
| Design per L'innovazione Sostenibile | `B355` | 1,2 | 7 | 11 | ✅ live orari+esami |
| Design per L'innovazione Sostenibile | `B270` | 2 | 9 | 15 | ✅ live orari+esami |
| Design Sistema Moda | `B354` | 1 | 5 | 27 | ✅ live orari+esami |
| Design Sistema Moda | `B220` | 2 | 8 | 12 | ✅ live orari+esami |
| Design Tessile e Moda | `B404` | 1,2 | 7 | 45 | ✅ live orari+esami |
| Design Tessile e Moda | `B246` | 2,3 | 10 | 70 | ✅ live orari+esami |
| Pianificazione della Citta', del Territorio e del Paesaggio | `B317` | 1,2 | 6 | 31 | ✅ live orari+esami |
| Pianificazione della Citta', del Territorio e del Paesaggio | `B016` | 2,3 | 8 | 25 | ✅ live orari+esami |
| Pianificazione e Progettazione per la Sostenibilità Urbana e Territoriale | `B366` | 1,2 | 8 | 19 | ✅ live orari+esami |
| Pianificazione e Progettazione per la Sostenibilità Urbana e Territoriale | `B269` | 2 | 7 | 8 | ✅ live orari+esami |
| Product, Interior, Communication and Eco-social Design | `B303` | 1,2 | 12 | 74 | ✅ live orari+esami |
| Product, Interior, Communication and Eco-social Design | `B251` | 2,3 | 32 | 101 | ✅ live orari+esami |
| Scienze Dell'architettura | `B313` | 1 | 16 | 50 | ✅ live orari+esami |
| Scienze Dell'architettura | `B008` | 2,3 | 21 | 90 | ✅ live orari+esami |

## ScuoladiEconomiaeManagement

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Accounting, Auditing e Controllo | `B377` | 1 | 35 | 96 | ✅ live orari+esami |
| Accounting, Auditing e Controllo | `B249` | 2 | 23 | 75 | ✅ live orari+esami |
| Design of Sustainable Tourism Systems | `B205` | 2 | 6 | 49 | ✅ live orari+esami |
| Design of Sustainable Tourism Systems | `B415` | 1 | 13 | 46 | ✅ live orari+esami |
| Economia Aziendale | `B395` | 1 | 52 | 132 | ✅ live orari+esami |
| Economia Aziendale | `B009` | 2,3 | 53 | 312 | ✅ live orari+esami |
| Economia e Commercio | `B402` | 1 | 52 | 132 | ✅ live orari+esami |
| Economia e Commercio | `B034` | 2,3 | 53 | 183 | ✅ live orari+esami |
| Economia Istituzioni Sostenibilità / Economics Institutions Sustainability | `B417` | 1,2 | 31 | 146 | ✅ live orari+esami |
| Economics and Development | `B418` | 1,2 | 43 | 116 | ✅ live orari+esami |
| Economics and Development | `B214` | 2 | 30 | 138 | ✅ live orari+esami |
| Finance and Risk Management | `B358` | 1 | 9 | 43 | ✅ live orari+esami |
| Finance and Risk Management | `B203` | 2 | 9 | 49 | ✅ live orari+esami |
| Governo e Direzione D'impresa | `B426` | 1 | 12 | 46 | ✅ live orari+esami |
| Governo e Direzione D'impresa | `B105` | 2 | 11 | 79 | ✅ live orari+esami |
| Scienze Dell'economia | `B089` | 2 | 9 | 53 | ✅ live orari+esami |
| Statistica | `B331` | 1 | 13 | 53 | ✅ live orari+esami |
| Statistica | `B039` | 2,3 | 20 | 82 | ✅ live orari+esami |
| Statistica e Data Science | `B379` | 1 | 9 | 31 | ✅ live orari+esami |
| Statistica e Data Science | `B236` | 2 | 24 | 83 | ✅ live orari+esami |
| Sustainable Business for Societal Challenges | `B314` | 1 | 8 | 55 | ✅ live orari+esami |
| Sustainable Business for Societal Challenges. | `B247` | 2,3 | 15 | 117 | ✅ live orari+esami |
| Sviluppo Sostenibile, Cooperazione e Gestione dei Conflitti | `B328` | 1,2 | 10 | 40 | ✅ live orari+esami |
| Sviluppo Sostenibile, Cooperazione e Gestione dei Conflitti | `B243` | 2,3 | 35 | 227 | ✅ live orari+esami |

## ScuoladiGiurisprudenza

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Diritto per le Sostenibilita' e la Sicurezza | `B386` | 1 | 8 | 58 | ✅ live orari+esami |
| Diritto per le Sostenibilita' e la Sicurezza | `B256` | 2 | 6 | 49 | ✅ live orari+esami |
| Giurisprudenza | `B344` | 1,5 | 30 | 110 | ✅ live orari+esami |
| Giurisprudenza | `1170` | 2,3,4,5 | 125 | 637 | ✅ live orari+esami |
| Giurisprudenza Italiana e Francese | `B345` | 1 | 9 | 45 | ✅ live orari+esami |
| Giurisprudenza Italiana e Francese | `B250` | 2,3,4 | 10 | 73 | ✅ live orari+esami |
| Giurisprudenza Italiana e Tedesca | `B346` | 1 | 9 | 51 | ✅ live orari+esami |
| Giurisprudenza Italiana e Tedesca | `B218` | 2,3,4,5 | 15 | 82 | ✅ live orari+esami |
| Scienze dei Servizi Giuridici | `B311` | 1 | 11 | 60 | ✅ live orari+esami |
| Scienze dei Servizi Giuridici | `B006` | 2,3 | 31 | 193 | ✅ live orari+esami |

## ScuoladiIngegneria

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Geoengineering | `B361` | 1 | 10 | 55 | ✅ live orari+esami |
| Geoengineering | `B226` | 2 | 10 | 45 | ✅ live orari+esami |
| Ingegneria Ambientale | `B305` | 1 | 9 | 60 | ✅ live orari+esami |
| Ingegneria Ambientale | `B254` | 2,3 | 37 | 178 | ✅ live orari+esami |
| Ingegneria Biomedica | `B388` | 1 | 9 | 75 | ✅ live orari+esami |
| Ingegneria Biomedica | `B359` | 1 | 8 | 27 | ✅ live orari+esami |
| Ingegneria Biomedica | `B237` | 2,3 | 27 | 218 | ✅ live orari+esami |
| Ingegneria Biomedica | `B061` | 2 | 34 | 165 | ✅ live orari+esami |
| Ingegneria Civile | `B360` | 1 | 22 | 68 | ✅ live orari+esami |
| Ingegneria Civile | `B062` | 2 | 23 | 96 | ✅ live orari+esami |
| Ingegneria Civile e Edile per la Sostenibilità | `B306` | 1 | 17 | 80 | ✅ live orari+esami |
| Ingegneria Civile e Edile per la Sostenibilità | `B259` | 2,3 | 39 | 200 | ✅ live orari+esami |
| Ingegneria dei Sistemi Elettronici | `B337` | 1 | 57 | 158 | ✅ live orari+esami |
| Ingegneria dei Sistemi Elettronici | `B245` | 2 | 36 | 81 | ✅ live orari+esami |
| Ingegneria Edile | `B408` | 1 | 21 | 61 | ✅ live orari+esami |
| Ingegneria Edile | `B063` | 2 | 7 | 24 | ✅ live orari+esami |
| Ingegneria Elettronica | `B307` | 1 | 9 | 86 | ✅ live orari+esami |
| Ingegneria Elettronica | `B244` | 2,3 | 42 | 230 | ✅ live orari+esami |
| Ingegneria Energetica | `B410` | 1 | 27 | 153 | ✅ live orari+esami |
| Ingegneria Energetica | `B068` | 2 | 23 | 105 | ✅ live orari+esami |
| Ingegneria Gestionale | `B406` | 1 | 28 | 245 | ✅ live orari+esami |
| Ingegneria Gestionale | `B222` | 2,3 | 39 | 181 | ✅ live orari+esami |
| Ingegneria Informatica | `B308` | 1 | 12 | 102 | ✅ live orari+esami |
| Ingegneria Informatica | `B339` | 1 | 65 | 171 | ✅ live orari+esami |
| Ingegneria Informatica | `B070` | 2 | 28 | 82 | ✅ live orari+esami |
| Ingegneria Informatica | `B047` | 2,3 | 27 | 179 | ✅ live orari+esami |
| Ingegneria Meccanica | `B412` | 1 | 47 | 148 | ✅ live orari+esami |
| Ingegneria Meccanica | `B309` | 1 | 28 | 257 | ✅ live orari+esami |
| Ingegneria Meccanica | `B071` | 2 | 85 | 257 | ✅ live orari+esami |
| Ingegneria Meccanica | `B049` | 2,3 | 142 | 307 | ✅ live orari+esami |
| Ingegneria per la Tutela Dell'ambiente e del Territorio | `B362` | 1 | 13 | 68 | ✅ live orari+esami |
| Ingegneria per la Tutela Dell'ambiente e del Territorio | `B072` | 2 | 12 | 55 | ✅ live orari+esami |
| Intelligenza Artificiale | `B340` | 1 | 12 | 53 | ✅ live orari+esami |
| Intelligenza Artificiale | `B241` | 2 | 12 | 61 | ✅ live orari+esami |
| Management Engineering | `B338` | 1 | 17 | 59 | ✅ live orari+esami |
| Management Engineering | `B271` | 2 | 10 | 39 | ✅ live orari+esami |
| Mechanical Engineering for Sustainability | `B341` | 1 | 15 | 68 | ✅ live orari+esami |
| Mechanical Engineering for Sustainability | `B248` | 2 | 39 | 125 | ✅ live orari+esami |
| Robotics, Automation and Electrical Engineering | `B336` | 1 | 44 | 239 | ✅ live orari+esami |
| Robotics, Automation and Electrical Engineering | `B274` | 2 | 34 | 128 | ✅ live orari+esami |
| Tecniche e Tecnologie per le Costruzioni e il Territorio | `B273` | 1,2 | 23 | 85 | ✅ live orari+esami |

## ScuoladiPsicologia

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Psicologia Clinica e della Salute e Neuropsicologia | `B368` | 1,2 | 47 | 197 | ✅ live orari+esami |
| Psicologia Clinica e della Salute e Neuropsicologia | `B267` | 2 | 16 | 136 | ✅ live orari+esami |
| Psicologia del Ciclo di Vita e dei Contesti | `B369` | 1,2 | 30 | 167 | ✅ live orari+esami |
| Psicologia del Ciclo di Vita e dei Contesti | `B266` | 2 | 13 | 103 | ✅ live orari+esami |
| Scienze e Tecniche Psicologiche | `B319` | 1,2 | 38 | 109 | ✅ live orari+esami |
| Scienze e Tecniche Psicologiche | `B018` | 2,3 | 39 | 326 | ✅ live orari+esami |

## ScuoladiScienzeMatematiche-FisicheeNaturali

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Advanced Molecular Sciences | `B370` | 1 | 9 | 25 | ✅ live orari+esami |
| Advanced Molecular Sciences | `B234` | 2 | 14 | 23 | ✅ live orari+esami |
| Biologia Dell'ambiente e del Comportamento | `B350` | 1,2 | 20 | 41 | ✅ live orari+esami |
| Biologia Dell'ambiente e del Comportamento | `B232` | 2 | 17 | 74 | ✅ live orari+esami |
| Biologia Molecolare e Applicata | `B351` | 1 | 16 | 73 | ✅ live orari+esami |
| Biologia Molecolare e Applicata | `B230` | 2 | 38 | 136 | ✅ live orari+esami |
| Biotecnologie Molecolari | `B352` | 1 | 12 | 33 | ✅ live orari+esami |
| Biotecnologie Molecolari | `B108` | 2 | 4 | 8 | ✅ live orari+esami |
| Chimica | `B321` | 1 | 31 | 107 | ✅ live orari+esami |
| Chimica | `B025` | 2,3 | 75 | 145 | ✅ live orari+esami |
| Data Science, Calcolo Scientifico and Intelligenza Artificiale | `B343` | 1 | 17 | 73 | ✅ live orari+esami |
| Data Science, Calcolo Scientifico and Intelligenza Artificiale | `B257` | 2 | 14 | 69 | ✅ live orari+esami |
| Diagnostica e Materiali per la Conservazione e il Restauro | `B405` | 1 | 14 | 36 | ✅ live orari+esami |
| Diagnostica e Materiali per la Conservazione e il Restauro | `B186` | 2,3 | 14 | 51 | ✅ live orari+esami |
| Fisica e Astrofisica | `B322` | 1 | 15 | 54 | ✅ live orari+esami |
| Fisica e Astrofisica | `B030` | 2,3 | 18 | 113 | ✅ live orari+esami |
| Informatica | `B324` | 1 | 10 | 59 | ✅ live orari+esami |
| Informatica | `B032` | 2,3 | 18 | 106 | ✅ live orari+esami |
| Matematica | `B327` | 1 | 13 | 44 | ✅ live orari+esami |
| Matematica | `B364` | 1 | 81 | 148 | ✅ live orari+esami |
| Matematica | `B077` | 2 | 3 | 10 | ✅ live orari+esami |
| Matematica | `B036` | 2,3 | 36 | 160 | ✅ live orari+esami |
| Ottica e Optometria | `B323` | 1 | 11 | 40 | ✅ live orari+esami |
| Ottica e Optometria | `B031` | 2,3 | 22 | 60 | ✅ live orari+esami |
| Physical and Astrophysical Sciences | `B411` | 1 | 183 | 317 | ✅ live orari+esami |
| Scienza dei Materiali | `B300` | 1 | 14 | 42 | ✅ live orari+esami |
| Scienza dei Materiali | `B258` | 2,3 | 35 | 76 | ✅ live orari+esami |
| Scienze Biologiche | `B310` | 1 | 20 | 98 | ✅ live orari+esami |
| Scienze Biologiche | `B005` | 2,3 | 13 | 94 | ✅ live orari+esami |
| Scienze Chimiche | `B371` | 1 | 43 | 130 | ✅ live orari+esami |
| Scienze Chimiche | `B088` | 2 | 28 | 108 | ✅ live orari+esami |
| Scienze della Natura e Dell'uomo | `B372` | 1,2 | 26 | 60 | ✅ live orari+esami |
| Scienze della Natura e dell'Uomo | `B093` | 2 | 38 | 123 | ✅ live orari+esami |
| Scienze e Materiali per la Conservazione e il Restauro | `B407` | 1 | 13 | 34 | ✅ live orari+esami |
| Scienze e Materiali per la Conservazione e il Restauro | `B194` | 2 | 4 | 18 | ✅ live orari+esami |
| Scienze e Tecnologie Geologiche | `B376` | 1 | 48 | 136 | ✅ live orari+esami |
| Scienze e Tecnologie Geologiche | `B103` | 2 | 32 | 56 | ✅ live orari+esami |
| Scienze Fisiche e Astrofisiche | `B058` | 2 | 2 | 2 | ✅ live orari+esami |
| Scienze Geologiche | `B326` | 1 | 10 | 17 | ✅ live orari+esami |
| Scienze Geologiche | `B035` | 2,3 | 25 | 40 | ✅ live orari+esami |
| Scienze Naturali | `B325` | 1 | 18 | 49 | ✅ live orari+esami |
| Scienze Naturali | `B033` | 2,3 | 16 | 69 | ✅ live orari+esami |
| Software: Science and Technology | `B335` | 1 | 16 | 72 | ✅ live orari+esami |
| Software: Science and Technology | `B255` | 2 | 6 | 6 | ✅ live orari+esami |

## ScuoladiScienzePoliticheCesareAlfieri

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Disegno e Gestione degli Interventi Sociali | `B382` | 1,2 | 4 | 65 | ✅ live orari+esami |
| Politica, Istituzioni e Mercato | `B374` | 1,2 | 25 | 95 | ✅ live orari+esami |
| Relazioni Internazionali e Studi Europei | `B416` | 1,2 | 46 | 176 | ✅ live orari+esami |
| Scienze Politiche | `B403` | 1,2 | 73 | 231 | ✅ live orari+esami |
| Scienze Politiche | `B037` | 2,3 | 83 | 324 | ✅ live orari+esami |
| Servizio Sociale | `B330` | 1,2 | 23 | 103 | ✅ live orari+esami |
| Servizio Sociale | `B201` | 2,3 | 15 | 77 | ✅ live orari+esami |
| Sociologia e Sfide Globali | `B383` | 1,2 | 20 | 73 | ✅ live orari+esami |
| Strategie di Comunicazione nella Società Digitale | `B419` | 1,2 | 20 | 66 | ✅ live orari+esami |

## ScuoladiScienzedellaSaluteUmana

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Assistenza Sanitaria (abilitante alla Professione Sanitaria di Assistente Sanitario) | `B178` | 1,2,3 | 15 | 65 | ✅ live orari+esami |
| Biotecnologie | `B014` | 2,3 | 40 | 54 | ✅ live orari+esami |
| Biotecnologie | `B301` | 1 | 18 | 120 | ✅ live orari+esami |
| Biotecnologie Mediche e Farmaceutiche | `B121` | 2 | 16 | 6 | ✅ live orari+esami |
| Biotecnologie Mediche e Farmaceutiche | `B353` | 1 | 12 | 67 | ✅ live orari+esami |
| Chimica e Tecnologia Farmaceutiche | `B053` | 4,5 | 11 | 8 | ✅ live orari+esami |
| Chimica e Tecnologia Farmaceutiche | `B263` | 2,3,4,5 | 31 | 53 | ✅ live orari+esami |
| Chimica e Tecnologia Farmaceutiche | `B356` | 1 | 6 | 41 | ✅ live orari+esami |
| Dietistica (abilitante alla Professione Sanitaria di Dietista) | `B170` | 1,2,3 | 25 | 108 | ✅ live orari+esami |
| Educazione Professionale (abilitante alla Professione Sanitaria di Educatore Professionale) | `B164` | 1,2,3 | 16 | 80 | ✅ live orari+esami |
| Farmacia | `B054` | 4,5 | 9 | 23 | ✅ live orari+esami |
| Farmacia | `B264` | 2,3,4,5 | 28 | 83 | ✅ live orari+esami |
| Farmacia | `B357` | 1 | 7 | 43 | ✅ live orari+esami |
| Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista) - Empoli | `B165_EMPOLI` | 1,2,3 | 3 | 26 | ✅ live orari+esami |
| Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista) - Firenze | `B165_FIRENZE` | 1,2,3 | 14 | 98 | ✅ live orari+esami |
| Fisioterapia (abilitante alla Professione Sanitaria di Fisioterapista) - Pistoia | `B165_PISTOIA` | 1,2,3 | 1 | 16 | ✅ live orari+esami |
| Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Borgo San Lorenzo | `B162_BORGO SAN LORENZO` | 1,2,3 | 9 | 58 | ✅ live orari+esami |
| Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Empoli | `B162_EMPOLI` | 1,2,3 | 5 | 25 | ✅ live orari+esami |
| Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Firenze | `B162_FIRENZE` | 1,2,3 | 16 | 166 | ✅ live orari+esami |
| Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Pistoia | `B162_PISTOIA` | 1,2,3 | 9 | 40 | ✅ live orari+esami |
| Infermieristica (abilitante alla Professione Sanitaria di Infermiere) - Prato | `B162_PRATO` | 1,2,3 | 12 | 208 | ✅ live orari+esami |
| Logopedia (abilitante alla Professione Sanitaria di Logopedista) | `B166` | 1,2,3 | 15 | 43 | ✅ live orari+esami |
| Medicina e Chirurgia | `B120` | 6 | 9 | 28 | ✅ live orari+esami |
| Medicina e Chirurgia | `B240` | 2,3,4,5 | 62 | 311 | ✅ live orari+esami |
| Medicina e Chirurgia | `B414` | 1 | 36 | 27 | ✅ live orari+esami |
| Odontoiatria e Protesi Dentaria | `B125` | 4,5,6 | 20 | 9 | ✅ live orari+esami |
| Odontoiatria e Protesi Dentaria | `B265` | 2,3,4,5,6 | 36 | 40 | ✅ live orari+esami |
| Odontoiatria e Protesi Dentaria | `B365` | 1 | 9 | 9 | ✅ live orari+esami |
| Osteopatia | `B275` | 1,2 | 13 | 45 | ✅ live orari+esami |
| Ostetricia (abilitante alla Professione Sanitaria di Ostetrica/o) | `B163` | 1,2,3 | 21 | 74 | ✅ live orari+esami |
| Scienze Dell'alimentazione | `B207` | 2 | 5 | 3 | ✅ live orari+esami |
| Scienze Dell'alimentazione | `B373` | 1 | 10 | 18 | ✅ live orari+esami |
| Scienze delle Professioni Sanitarie della Prevenzione | `B184` | 1,2 | 0 | 1 | ⚪ manuale (solo esami; orari celle=0) |
| Scienze delle Professioni Sanitarie Tecniche Diagnostiche | `B183` | 1,2 | 0 | 0 | ⚪ manuale: orari non pubblicati (celle=0) |
| Scienze e Tecniche dello Sport e delle Attività Motorie Preventive e Adattate | `B185` | 2 | 5 | 24 | ✅ live orari+esami |
| Scienze e Tecniche dello Sport e delle Attività Motorie Preventive e Adattate | `B390` | 1 | 13 | 15 | ✅ live orari+esami |
| Scienze Farmaceutiche Applicate-controllo Qualità | `B193` | 2,3 | 16 | 25 | ✅ live orari+esami |
| Scienze Farmaceutiche Applicate-controllo Qualità | `B400` | 1 | 6 | 10 | ✅ live orari+esami |
| Scienze Infermieristiche e Ostetriche | `B180` | 1,2 | 7 | 40 | ✅ live orari+esami |
| Scienze Motorie, Sport e Salute | `B122` | 2,3 | 22 | 89 | ✅ live orari+esami |
| Scienze Motorie, Sport e Salute | `B318` | 1 | 11 | 37 | ✅ live orari+esami |
| Scienze Riabilitative delle Professioni Sanitarie | `B181` | 1,2 | 8 | 20 | ✅ live orari+esami |
| Semestre Filtro | `SFM` | 1 | 40 | 2 | ✅ live orari+esami |
| Tecniche della Prevenzione Nell'ambiente e Nei Luoghi di Lavoro (abilitante alla Professione Sanitaria di Tecnico della Prevenzione Nell'ambiente e Nei Luoghi di Lavoro) | `B179` | 1,2,3 | 16 | 63 | ✅ live orari+esami |
| Tecniche di Laboratorio Biomedico (abilitante alla Professione Sanitaria di Tecnico di Laboratorio Biomedico) | `B174` | 1,2,3 | 20 | 103 | ✅ live orari+esami |
| Tecniche di Neurofisiopatologia (abilitante alla Professione Sanitaria di Tecnico di Neurofisiopatologia) | `B202` | 1,2,3 | 11 | 43 | ✅ live orari+esami |
| Tecniche di Radiologia Medica, per Immagini e Radioterapia (abilitante alla Professione Sanitaria di Tecnico di Radiologia Medica) | `B176` | 1,2,3 | 19 | 34 | ✅ live orari+esami |
| Tecniche Ortopediche (abilitante alla Professione Sanitaria di Tecnico Ortopedico) | `B177` | 1,2,3 | 7 | 76 | ✅ live orari+esami |

## ScuoladiStudiUmanisticiedellaFormazione

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Archeologia | `B060` | 2 | 24 | 146 | ✅ live orari+esami |
| Archeologia | `B347` | 1 | 46 | 127 | ✅ live orari+esami |
| Dirigenza Scolastica e Pedagogia per L'inclusione | `B261` | 2 | 6 | 56 | ✅ live orari+esami |
| Dirigenza Scolastica e Pedagogia per L'inclusione | `B367` | 1 | 2 | 52 | ✅ live orari+esami |
| Discipline delle Arti, della Musica e dello Spettacolo | `B027` | 2,3 | 8 | 126 | ✅ live orari+esami |
| Discipline delle Arti, della Musica e dello Spettacolo | `B401` | 1 | 6 | 49 | ✅ live orari+esami |
| Filologia Moderna | `B055` | 2 | 13 | 132 | ✅ live orari+esami |
| Filologia Moderna | `B333` | 1 | 47 | 206 | ✅ live orari+esami |
| Filologia, Letteratura e Storia Dell'antichità | `B056` | 2 | 13 | 138 | ✅ live orari+esami |
| Filologia, Letteratura e Storia Dell'antichità | `B334` | 1 | 18 | 64 | ✅ live orari+esami |
| Filosofia | `B042` | 2,3 | 34 | 330 | ✅ live orari+esami |
| Filosofia | `B304` | 1 | 9 | 45 | ✅ live orari+esami |
| Geography, Spatial Management, Heritage for International Cooperation | `B231` | 2 | 4 | 31 | ✅ live orari+esami |
| Geography, Spatial Management, Heritage for International Cooperation | `B427` | 1 | 6 | 62 | ✅ live orari+esami |
| Intermediazione Culturale e Religiosa | `B242` | 2 | 4 | 112 | ✅ live orari+esami |
| Intermediazione Culturale e Religiosa | `B342` | 1 | 9 | 100 | ✅ live orari+esami |
| Lettere | `B200` | 2,3 | 78 | 448 | ✅ live orari+esami |
| Lettere | `B393` | 1 | 38 | 139 | ✅ live orari+esami |
| Lingue e Civiltà Dell'asia e Dell'africa | `B262` | 2 | 13 | 117 | ✅ live orari+esami |
| Lingue e Civiltà Dell'asia e Dell'africa | `B363` | 1 | 23 | 167 | ✅ live orari+esami |
| Lingue e Letterature Europee e Americane | `B074` | 2 | 125 | 451 | ✅ live orari+esami |
| Lingue e Letterature Europee e Americane | `B413` | 1 | 142 | 205 | ✅ live orari+esami |
| Lingue, Letterature e Studi Interculturali | `B004` | 2,3 | 247 | 663 | ✅ live orari+esami |
| Lingue, Letterature e Studi Interculturali | `B394` | 1 | 250 | 302 | ✅ live orari+esami |
| Logica, Filosofia delle Scienze e Metodi della Ricerca | `B391` | 1 | 11 | 82 | ✅ live orari+esami |
| Logica, Filosofia e Storia della Scienza | `B107` | 2 | 8 | 97 | ✅ live orari+esami |
| Pratiche, Linguaggi e Culture della Comunicazione | `B252` | 2 | 16 | 76 | ✅ live orari+esami |
| Pratiche, Linguaggi e Culture della Comunicazione | `B385` | 1 | 21 | 102 | ✅ live orari+esami |
| Progettazione e Gestione di Eventi e Imprese Dell'arte e dello Spettacolo | `B028` | 2,3 | 9 | 94 | ✅ live orari+esami |
| Progettazione e Gestione di Eventi e Imprese Dell'arte e dello Spettacolo | `B302` | 1 | 4 | 50 | ✅ live orari+esami |
| Scienze Archivistiche e Biblioteconomiche | `B084` | 2 | 11 | 97 | ✅ live orari+esami |
| Scienze Archivistiche e Biblioteconomiche | `B349` | 1 | 14 | 61 | ✅ live orari+esami |
| Scienze Dell'educazione e della Formazione | `B219` | 2,3 | 21 | 242 | ✅ live orari+esami |
| Scienze Dell'educazione e della Formazione | `B315` | 1 | 12 | 159 | ✅ live orari+esami |
| Scienze della Formazione Primaria | `B198` | 1,2,3,4,5 | 43 | 540 | ✅ live orari+esami |
| Scienze dello Spettacolo | `B097` | 2 | 7 | 64 | ✅ live orari+esami |
| Scienze dello Spettacolo | `B420` | 1 | 19 | 104 | ✅ live orari+esami |
| Scienze Filosofiche | `B106` | 2 | 42 | 295 | ✅ live orari+esami |
| Scienze Filosofiche | `B378` | 1 | 68 | 265 | ✅ live orari+esami |
| Scienze Pedagogiche e Management della Formazione per lo Sviluppo Sostenibile | `B260` | 2 | 6 | 116 | ✅ live orari+esami |
| Scienze Pedagogiche e Management della Formazione per lo Sviluppo Sostenibile | `B389` | 1 | 6 | 70 | ✅ live orari+esami |
| Scienze Storiche | `B111` | 2 | 27 | 281 | ✅ live orari+esami |
| Scienze Storiche | `B380` | 1 | 18 | 178 | ✅ live orari+esami |
| Scienze Umanistiche per la Comunicazione | `B195` | 2,3 | 15 | 203 | ✅ live orari+esami |
| Scienze Umanistiche per la Comunicazione | `B316` | 1 | 9 | 91 | ✅ live orari+esami |
| Storia | `B040` | 2,3 | 25 | 376 | ✅ live orari+esami |
| Storia Dell'arte | `B115` | 2 | 2 | 49 | ✅ live orari+esami |
| Storia Dell'arte | `B384` | 1 | 15 | 101 | ✅ live orari+esami |
| Storia e Tutela dei Beni Archeologici, Artistici, Archivistici e Librari | `B001` | 2,3 | 81 | 390 | ✅ live orari+esami |
| Storia e Tutela dei Beni Archeologici, Artistici, Archivistici e Librari | `B392` | 1 | 56 | 107 | ✅ live orari+esami |
| Storia | `B332` | 1 | 5 | 40 | ✅ live orari+esami |
