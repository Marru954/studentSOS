# Università Ca' Foscari Venezia — copertura corsi (verificata via combo.php + adapter grid/test_call)

Totale label corso: **81** · orari live: **69** · esami live (Appelli>0): **65** · manual (nessun dato verificabile): **12**. Esami: sì.

Verificato il 2026-06-17 esercitando i `degreeSources` end-to-end tramite l'adapter
easyacademy reale (non il raw `grid_call.php`): ogni `corso`/`anno2` qui sotto ha
restituito `celle`/`Appelli` reali. Codici (`corso`/`anno2`) dal portale
`combo.php?sw=ec_&aa=2025&page=corsi`, mai inventati. `scuola` vuota per ogni corso.
La riforma ordinamento 2025/26 spezza i triennali su un codice anno-1 (`…R`, es.
CTR3) e un codice anno-2/3 (es. CT3): ogni anno porta il proprio.

## Corsi (scuola vuota)

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Altre Opportunita' Formative | `AOF` | 1 | 13 | 2 | ✅ live orari+esami |
| Amministrazione, Finanza e Controllo | `EMR4/EM4` | 1,2 | 66 | 93 | ✅ live orari+esami |
| Antropologia Culturale, Etnologia, Etnolinguistica | `FMR10` | 1 | 81 | 133 | ✅ live orari+esami |
| Biotecnologie per L'ambiente e lo Sviluppo Sostenibile | `CMR10/CM10` | 1,2 | 57 | 59 | ✅ live orari+esami |
| Business Administration and Management | `ETR8` | 1,2,3 | 153 | 96 | ✅ live orari+esami |
| Chimica e Tecnologie Sostenibili | `CMR7/CM7/CT7` | 1,2,3 | 218 | 216 | ✅ live orari+esami |
| Commercio Estero e Turismo | `ETR30/ET30` | 1,2,3 | 157 | 151 | ✅ live orari+esami |
| Computer Science and Information Technology | `CM90` | 1,2 | 147 | 123 | ✅ live orari+esami |
| Conservation Science and Technology for Cultural Heritage | `CMR60/CM60` | 1,2 | 50 | 45 | ✅ live orari+esami |
| Conservazione e Gestione dei Beni e delle Attività Culturali | `FT1` | 1,2,3 | 552 | 782 | ✅ live orari+esami |
| Data Analytics for Business and Society | `EMR14` | 1,2 | 64 | 73 | ✅ live orari+esami |
| Digital and Public Humanities | `FMR11/FM11` | 1,2 | 63 | 90 | ✅ live orari+esami |
| Digital Management | `ETR7/ET7` | 1,2,3 | 60 | 69 | ✅ live orari+esami |
| Economia | `R304` | 1 | 2 | 0 | 🟢 live orari (esami 0) |
| Economia Aziendale | `ETR11/ET11` | 1,2,3 | 195 | 217 | ✅ live orari+esami |
| Economia e Commercio | `ETR4/ET4` | 1,2,3 | 184 | 166 | ✅ live orari+esami |
| Economia e Finanza | `EMR20/EM20` | 1,2 | 59 | 98 | ✅ live orari+esami |
| Economia e Gestione delle Arti e delle Attività Culturali | `EMR3` | 1,2 | 89 | 207 | ✅ live orari+esami |
| Economia e Governance delle Organizzazioni Pubbliche | `EMR11` | 1 | 23 | 36 | ✅ live orari+esami |
| Economics and Business | `ETR9` | 1,2,3 | 67 | 82 | ✅ live orari+esami |
| Economics, Finance and Sustainability | `EMR15/EM15` | 1,2 | 151 | 175 | ✅ live orari+esami |
| Energy, Climate Change and Environmental Risks | `NS02` | 1 | 1 | 15 | ✅ live orari+esami |
| Engineering Physics | `CMR13` | 1,2 | 76 | 77 | ✅ live orari+esami |
| Environmental Humanities | `LMR10/LM10` | 1,2 | 53 | 131 | ✅ live orari+esami |
| Filosofia | `FTR2/FT2` | 1,2,3 | 235 | 395 | ✅ live orari+esami |
| Foundation Year | `FOY` | 1 | 142 | 0 | 🟢 live orari (esami 0) |
| Gender Studies. Rights, Identities and Social Relations | `NE04` | 1 | 9 | 9 | ✅ live orari+esami |
| Global Accounting and Finance | `EMR16` | 1,2 | 28 | 61 | ✅ live orari+esami |
| Global Development and Entrepreneurship | `EMR12` | 1,2 | 61 | 91 | ✅ live orari+esami |
| Governance delle Organizzazioni Pubbliche | `EM11` | 2 | 12 | 21 | ✅ live orari+esami |
| Hospitality Innovation and E-tourism | `CTR9/CT9` | 1,2,3 | 50 | 104 | ✅ live orari+esami |
| Impresa, Banche, Lavoro e Fisco | `NM03` | 1 | 6 | 12 | ✅ live orari+esami |
| Informatica | `CTR3/CT3` | 1,2,3 | 326 | 199 | ✅ live orari+esami |
| Ingegneria Ambientale per la Transizione Ecologica | `CTR10/CT10` | 1,2,3 | 77 | 109 | ✅ live orari+esami |
| Ingegneria Fisica | `CTR8/CT8` | 1,2,3 | 112 | 125 | ✅ live orari+esami |
| Innovation and Management for Culture and Creativity | `EMR17` | 1 | 24 | 41 | ✅ live orari+esami |
| Innovation and Marketing | `EM17` | 2 | 18 | 20 | ✅ live orari+esami |
| International Management | `EMR18/EM18` | 1,2 | 42 | 61 | ✅ live orari+esami |
| Language and Management to China | `LMR9/LM9` | 1,2 | 90 | 58 | ✅ live orari+esami |
| Lavoro, Cittadinanza Sociale, Interculturalità | `FM8` | 2 | 30 | 46 | ✅ live orari+esami |
| Lettere | `FTR3/FT3` | 1,2,3 | 199 | 417 | ✅ live orari+esami |
| Lingue Dell'asia e Dell'africa Mediterranea per L'impresa e la Cooperazione Internazionale | `LMR40` | 1,2 | 153 | 164 | ✅ live orari+esami |
| Lingue e Civiltà Dell'asia e Dell'africa Mediterranea | `LMR20/LM20` | 1,2 | 283 | 333 | ✅ live orari+esami |
| Lingue e Letterature Europee, Americane e Postcoloniali | `LMR3/LM3` | 1,2 | 520 | 407 | ✅ live orari+esami |
| Lingue, Civiltà e Scienze del Linguaggio | `LTR10/LT10` | 1,2,3 | 973 | 692 | ✅ live orari+esami |
| Lingue, Culture e Società Dell'asia e Dell'africa Mediterranea | `LTR40/LT40` | 1,2,3 | 1773 | 1161 | ✅ live orari+esami |
| Lingue, Economie e Istituzioni Dell'asia e Dell'africa Mediterranea | `LM40` | 2 | 53 | 56 | ✅ live orari+esami |
| Management | `R357` | 1,2 | 13 | 2 | ✅ live orari+esami |
| Management e Sostenibilità | `EMR60/EM60` | 1,2 | 36 | 72 | ✅ live orari+esami |
| Marketing e Comunicazione | `EM7` | 2 | 12 | 8 | ✅ live orari+esami |
| Marketing Management | `EMR7` | 1 | 23 | 38 | ✅ live orari+esami |
| Mediazione Linguistica e Culturale | `LTR5/LT5` | 1,2,3 | 134 | 128 | ✅ live orari+esami |
| Philosophy, International and Economic Studies | `LTR6/LT6` | 1,2,3 | 56 | 132 | ✅ live orari+esami |
| Relazioni Internazionali Comparate | `LMR60` | 1,2 | 212 | 144 | ✅ live orari+esami |
| School for International Education | `SIE` | 1 | 107 | 0 | 🟢 live orari (esami 0) |
| Science and Technology of Bio and Nanomaterials | `CM14` | 1,2 | 64 | 75 | ✅ live orari+esami |
| Scienza e Gestione dei Cambiamenti Climatici | `R343` | 1 | 10 | 0 | 🟢 live orari (esami 0) |
| Scienze Ambientali | `CMR5/CM5/CT5` | 1,2,3 | 189 | 175 | ✅ live orari+esami |
| Scienze del Linguaggio | `LM5` | 1,2 | 307 | 336 | ✅ live orari+esami |
| Scienze della Società e del Servizio Sociale | `FTR4/FT4` | 1,2,3 | 61 | 113 | ✅ live orari+esami |
| Scienze e Tecnologie per i Beni Culturali | `CTR60/CT60` | 1,2,3 | 92 | 110 | ✅ live orari+esami |
| Scienze Filosofiche | `FMR61/FM61` | 1,2 | 78 | 160 | ✅ live orari+esami |
| Storia | `FTR5/FT5` | 1,2,3 | 412 | 548 | ✅ live orari+esami |
| Storia delle Arti e Conservazione dei Beni Artistici | `FMR9/FM9` | 1,2 | 128 | 277 | ✅ live orari+esami |
| Studi Transmediterranei: Migrazione, Cooperazione e Sviluppo | `LMR80/LM80` | 1,2 | 76 | 84 | ✅ live orari+esami |
| Sviluppo Interculturale dei Sistemi Turistici | `EM9` | 2 | 31 | 33 | ✅ live orari+esami |
| Tourism Management and Sustainability | `EMR9` | 1 | 18 | 33 | ✅ live orari+esami |
| Traduzione e Interpretazione | `LMR70/LM70` | 1,2 | 93 | 106 | ✅ live orari+esami |
| Welfare, Società e Lavoro Sociale | `FMR8` | 1,2 | 42 | 90 | ✅ live orari+esami |

## Manual (nessun corso/anno con celle>0 nelle finestre sondate)

Restano in modalità manuale (in `ateneo-courses.ts`), riproponibili a ottobre 2026:
Ancient Civilizations for the Contemporary World · Chimica Sostenibile ·
Computer and Data Science · Comunicare la Complessità ·
Environmental Engineering for the Green Transition ·
Filologia, Linguistica e Letteratura Italiana · Ingegneria Fisica e Materiali ·
Scienze Archivistiche e Biblioteconomiche ·
Scienze Dell'antichità (Archeologia/Letterature/Storia, 2 varianti) ·
Storia Dal Medioevo All'età Contemporanea ·
Studi Storici: Età Medievale, Moderna, Contemporanea.

> Nota: molti di questi sono magistrali a singolo anno la cui finestra di lezioni
> cade fuori dai due intervalli sondati (autunno 2025 + primavera 2026) oppure non
> espongono ancora la griglia; vanno riverificati col semestre in corso.
