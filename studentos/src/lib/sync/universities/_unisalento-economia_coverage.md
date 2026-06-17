# Università del Salento (Lecce) — copertura corsi (verificata via combo.php + adapter grid/test_call)

`unisalento-economia` · base `logistica.unisalento.it/PortaleStudenti` · scuola vuota per ogni corso.

Totale corsi combo: **158** → raggruppati in **81 lauree live** + 6 corsi ISUFI manuali.
Orari live: **81/81** (ogni source restituisce `celle>0`). Esami live (`Appelli>0`): **31**;
le restanti 50 lauree espongono solo l'orario (`exams:false`): economia/lettere/scienze
sociali tengono il calendario esami fuori da EasyAcademy. Verificato il **2026-06-17**
esercitando i `degreeSources` end-to-end tramite l'adapter easyacademy reale (non il raw
`grid_call.php`). Codici (`corso`/`anno2`) dal portale `combo.php?sw=ec_&aa=2025&page=corsi`,
mai inventati.

La riforma ordinamento 2025/26 spezza LB/LM/LMG su un codice anno-1 `<code>R` e un codice
anno-2+ `<code>` base. La combo dell'anno-1 `R` spesso porta solo un placeholder `999|1`:
i veri `anno2` dell'anno-1 sono stati ricavati dai curricula verificati della laurea e
ri-controllati contro l'adapter (es. Economia Aziendale anno-1 → `A-L|1`,`M-Z|1`).

## Corsi (scuola vuota)

| Corso | corso | Anni | celle | appelli | Stato |
|---|---|---|---|---|---|
| Aerospace Engineering | `LM52R/LM52` | 1,2 | 64 | 156 | ✅ live orari+esami |
| Archeologia | `LM13R/LM13` | 1,2 | 48 | 0 | 🟢 live orari (esami 0) |
| Beni Culturali | `LB13R/LB13` | 1,2,3 | 200 | 0 | 🟢 live orari (esami 0) |
| Biologia Sperimentale ed Applicata | `LM68R/LM68` | 1,2 | 94 | 0 | 🟢 live orari (esami 0) |
| Biotecnologie | `LB01R/LB01` | 1,2,3 | 38 | 3 | ✅ live orari+esami |
| Biotecnologie Mediche e Nanobiotecnologie | `LM49R/LM49` | 1,2 | 73 | 0 | 🟢 live orari (esami 0) |
| Chimica per la Sostenibilità | `LB59` | 1,2 | 21 | 47 | ✅ live orari+esami |
| Coastal and Marine Biology and Ecology (Biologia ed Ecologia Costiera e Marina) | `LM51R/LM51` | 1,2 | 54 | 0 | 🟢 live orari (esami 0) |
| Comunicazione, Media Digitali, Giornalismo | `LM78R/LM78` | 1,2 | 32 | 0 | 🟢 live orari (esami 0) |
| Consulenza Pedagogica e Progettazione dei Processi Formativi | `LM66R/LM66` | 1,2 | 38 | 0 | 🟢 live orari (esami 0) |
| Data Science per le Scienze Umane e Sociali | `LM81R/LM81` | 1,2 | 36 | 0 | 🟢 live orari (esami 0) |
| Digital Heritage | `LM85` | 1,2 | 19 | 0 | 🟢 live orari (esami 0) |
| Diritto e Management dello Sport | `LB48R/LB48` | 1,2,3 | 38 | 0 | 🟢 live orari (esami 0) |
| Diritto e Politiche per le Pubbliche Amministrazioni | `LB54R/LB54` | 1,2,3 | 43 | 0 | 🟢 live orari (esami 0) |
| Discipline delle Arti, della Musica e dello Spettacolo (Dams) | `LB40R/LB40` | 1,2,3 | 48 | 0 | 🟢 live orari (esami 0) |
| Economia Aziendale | `LB05R/LB05` | 1,2,3 | 163 | 0 | 🟢 live orari (esami 0) |
| Economia e Finanza | `LB06` | 3 | 38 | 0 | 🟢 live orari (esami 0) |
| Economia Finanza e Assicurazioni | `LM16R/LM16` | 1,2 | 47 | 0 | 🟢 live orari (esami 0) |
| Economia, Finanza e Innovazione | `LB60R/LB60` | 1,2 | 42 | 0 | 🟢 live orari (esami 0) |
| Educazione Sociale e Tecniche Dell'intervento Educativo | `LB47R/LB47` | 1,2,3 | 46 | 0 | 🟢 live orari (esami 0) |
| Engineering for Safety of Critical Industrial and Civil Infrastructures | `LM80R/LM80` | 1,2 | 118 | 106 | ✅ live orari+esami |
| Filosofia | `LB16R/LB16` | 1,2,3 | 214 | 0 | 🟢 live orari (esami 0) |
| Fisica (magistrale) | `LM38R/LM38` | 1,2 | 78 | 66 | ✅ live orari+esami |
| Fisica (triennale) | `LB23R/LB23` | 1,2,3 | 25 | 223 | ✅ live orari+esami |
| Fisica Medica | `LM87` | 1 | 8 | 15 | ✅ live orari+esami |
| Gestione delle Attivita' Turistiche e Culturali | `LM02` | 2 | 14 | 0 | 🟢 live orari (esami 0) |
| Giurisprudenza | `LMG2R/LMG2` | 1,2,3,4,5 | 293 | 0 | 🟢 live orari (esami 0) |
| Governance Euro-Mediterranea delle Politiche Migratorie | `LM67R/LM67` | 1,2 | 32 | 0 | 🟢 live orari (esami 0) |
| Infermieristica (Abilitante alla Professione Sanitaria di Infermiere) | `LB51T/LB51` | 1,2,3 | 47 | 20 | ✅ live orari+esami |
| Ingegneria Biomedica (magistrale) | `LM79R/LM79` | 1,2 | 68 | 148 | ✅ live orari+esami |
| Ingegneria Biomedica (triennale) | `LB49R/LB49` | 1,2,3 | 56 | 195 | ✅ live orari+esami |
| Ingegneria Civile (magistrale) | `LM03R/LM03` | 1,2 | 66 | 121 | ✅ live orari+esami |
| Ingegneria Civile (triennale) | `LB07R/LB07` | 1,2,3 | 51 | 177 | ✅ live orari+esami |
| Ingegneria dei Materiali e Nanotecnologie | `LM76R/LM76` | 1,2 | 43 | 94 | ✅ live orari+esami |
| Ingegneria Dell' Informazione: Elettronica, Informatica e Telecomunicazioni | `LB56R/LB56` | 1,2,3 | 51 | 154 | ✅ live orari+esami |
| Ingegneria delle Telecomunicazioni e delle Tecnologie Elettroniche | `LM65R/LM65` | 1,2 | 32 | 82 | ✅ live orari+esami |
| Ingegneria Gestionale | `LB61` | 1 | 12 | 37 | ✅ live orari+esami |
| Ingegneria Industriale | `LB09R/LB09` | 1,2,3 | 62 | 294 | ✅ live orari+esami |
| Ingegneria Informatica (magistrale) | `LM75R/LM75` | 1,2 | 44 | 112 | ✅ live orari+esami |
| Ingegneria Informatica (triennale) | `LB55R/LB55` | 1,2,3 | 53 | 160 | ✅ live orari+esami |
| Ingegneria Meccanica | `LM07R/LM07` | 1,2 | 52 | 137 | ✅ live orari+esami |
| Ingegneria per L'industria Sostenibile | `LB52R/LB52` | 1,2,3 | 52 | 221 | ✅ live orari+esami |
| Lettere | `LB11R/LB11` | 1,2,3 | 131 | 0 | 🟢 live orari (esami 0) |
| Lettere Classiche | `LM11R/LM11` | 1,2 | 33 | 0 | 🟢 live orari (esami 0) |
| Lettere Moderne | `LM10R/LM10` | 1,2 | 66 | 0 | 🟢 live orari (esami 0) |
| Lingue Moderne, Letterature e Traduzione | `LM57R/LM57` | 1,2 | 112 | 0 | 🟢 live orari (esami 0) |
| Lingue, Culture e Letterature Straniere | `LB38R/LB38` | 1,2,3 | 191 | 1 | ✅ live orari+esami |
| Management Aziendale | `LM01R/LM01` | 1,2 | 97 | 0 | 🟢 live orari (esami 0) |
| Management dei Territori, delle Aziende Pubbliche e del Turismo | `LM88` | 1 | 40 | 0 | 🟢 live orari (esami 0) |
| Management delle Organizzazioni Turistiche | `LB53R/LB53` | 1,2,3 | 65 | 0 | 🟢 live orari (esami 0) |
| Management Digitale | `LB46R/LB46` | 1,2,3 | 86 | 0 | 🟢 live orari (esami 0) |
| Management Engineering - Ingegneria Gestionale | `LM54R/LM54` | 1,2 | 47 | 111 | ✅ live orari+esami |
| Matematica (magistrale) | `LM39R/LM39` | 1,2 | 89 | 139 | ✅ live orari+esami |
| Matematica (triennale) | `LB04R/LB04` | 1,2,3 | 30 | 215 | ✅ live orari+esami |
| Medicina e Chirurgia | `LM73R/LM73` | 1,2,3,4,5 | 57 | 19 | ✅ live orari+esami |
| Ottica e Optometria | `LB24R/LB24` | 1,2,3 | 26 | 163 | ✅ live orari+esami |
| Progettazione e Gestione delle Politiche e dei Servizi Sociali | `LM42R/LM42` | 1,2 | 39 | 0 | 🟢 live orari (esami 0) |
| Psicologia Dell'intervento Nei Contesti Relazionali e Sociali | `LM84R/LM84` | 1,2 | 46 | 0 | 🟢 live orari (esami 0) |
| Scienza e Tecnica della Mediazione Linguistica | `LB19R/LB19` | 1,2,3 | 291 | 1 | ✅ live orari+esami |
| Scienza e Tecniche Psicologiche | `LB58R/LB58` | 1,2,3 | 49 | 0 | 🟢 live orari (esami 0) |
| Scienze Ambientali | `LM60R/LM60` | 1,2 | 40 | 3 | ✅ live orari+esami |
| Scienze Biologiche | `LB02R/LB02` | 1,2,3 | 35 | 0 | 🟢 live orari (esami 0) |
| Scienze della Comunicazione | `LB36R/LB36` | 1,2,3 | 34 | 0 | 🟢 live orari (esami 0) |
| Scienze della Formazione Primaria | `LM63` | 1,2,3,4,5 | 80 | 0 | 🟢 live orari (esami 0) |
| Scienze dello Spettacolo e della Produzione Audiovisiva | `LM77R/LM77` | 1,2 | 20 | 0 | 🟢 live orari (esami 0) |
| Scienze e Tecniche delle Attivita' Motorie Preventive e Adattate | `LM82R/LM82` | 1,2 | 30 | 0 | 🟢 live orari (esami 0) |
| Scienze e Tecnologie per L'ambiente | `LB03R/LB03` | 1,2,3 | 33 | 28 | ✅ live orari+esami |
| Scienze Filosofiche | `LM30R/LM30` | 1,2 | 192 | 0 | 🟢 live orari (esami 0) |
| Scienze Infermieristiche e Ostetriche | `LM86` | 1 | 12 | 1 | ✅ live orari+esami |
| Scienze Motorie e dello Sport | `LB57R/LB57` | 1,2,3 | 88 | 0 | 🟢 live orari (esami 0) |
| Scienze per la Cooperazione Internazionale | `LM72R/LM72` | 1,2 | 30 | 0 | 🟢 live orari (esami 0) |
| Scienze Politiche e delle Relazioni Internazionali | `LB17R/LB17` | 1,2,3 | 32 | 0 | 🟢 live orari (esami 0) |
| Semestre Filtro | `SFMC` | 1 | 28 | 0 | 🟢 live orari (esami 0) |
| Servizio Sociale | `LB27R/LB27` | 1,2,3 | 48 | 0 | 🟢 live orari (esami 0) |
| Sociologia | `LB26R/LB26` | 1,2,3 | 73 | 0 | 🟢 live orari (esami 0) |
| Sociologia e Ricerca Sociale | `LM83R/LM83` | 1,2 | 50 | 0 | 🟢 live orari (esami 0) |
| Storia Dell'arte | `LM14R/LM14` | 1,2 | 33 | 0 | 🟢 live orari (esami 0) |
| Studi Geopolitici e Internazionali | `LM59R/LM59` | 1,2 | 29 | 0 | 🟢 live orari (esami 0) |
| Sviluppo Sostenibile e Cambiamenti Climatici | `LB50` | 3 | 15 | 0 | 🟢 live orari (esami 0) |
| Traduzione Tecnico-Scientifica e Interpretariato | `LM33R/LM33` | 1,2 | 159 | 0 | 🟢 live orari (esami 0) |
| Viticoltura ed Enologia | `LB42R/LB42` | 1,2,3 | 31 | 0 | 🟢 live orari (esami 0) |

## Manuali (nessun orario pubblico via EasyAcademy)

In `ateneo-courses.ts`: i 6 percorsi ordinari della Scuola Superiore ISUFI
(Area Economico-Giuridica / Tecnico-Scientifica / Umanistico-Sociale, I e II livello)
non hanno griglia pubblica EasyAcademy → modalità manuale.

> `🟢 live orari (esami 0)` = orario verificato live, ma `test_call.php` non espone
> appelli per quel `corso` (esami su altro sistema d'ateneo); riproponibile a ottobre 2026.
