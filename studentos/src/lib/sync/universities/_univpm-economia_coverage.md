# UnivPM (Università Politecnica delle Marche) — copertura EasyAcademy

Preset: `univpm-economia` · host `aule.univpm.it/agendastudenti` · sonda **2026-06-22**.
Verifica end-to-end con l'adapter reale (`grid_call.php` / `test_call.php`), NON curl grezzo.

## Sintesi

- combo.php → **119 corsi** su 5 scuole: Medicina 33 · Ingegneria 41 · Economia 19 · Scienze 12 · Agraria 14.
- **72/119 corsi con orario live** (celle>0, finestra 1ª settimana di novembre).
- Dopo il merge delle coppie riforma 2025/26 ("- primo anno" + corso base) →
  **55 programmi** in `univpm.ts`, **35 con esami** (test_call appelli>0, finestra giu–set 2026).
- Esami **per-anno**: ogni anno porta una source esami solo dove `test_call.php`
  ha restituito appelli reali per quel (corso, anno); i degree misti sono spezzati
  in un blocco `exams:true` + un blocco solo-orario (`false`).

## Faculty escluse / non pubblicate

- **Ingegneria (41 corsi): NON pubblica la griglia** su questo host. Sondati tutti
  end-to-end (grid_call → 0 celle su ogni corso/anno Ingegneria, 2026-06-22) →
  restano **manuali**. (Coerente con la nota storica "Ingegneria grid not published".)
- Gli altri 47 corsi non-live (Medicina/Scienze/Economia/Agraria) hanno
  `elenco_anni` ma `grid_call` torna 0 celle (anni fuori calendario o non esposti) →
  esclusi dal preset. Wrong/empty data è peggio di nessun dato.

## Note tecniche

- `scuola` = nome facoltà ("Economia" / "Scienze" / "Medicina" / "Agraria").
- Riforma 2025/26: trienni splittati su corso year-1 ("…- primo anno") + corso base
  year-2+, ognuno con il suo `anno2` curriculum-coded → uniti in un LiveProgram con
  `corso` per-anno (stesso pattern di unicampania/unisalento).
- Le sedi distaccate (Ancona/Ascoli/Fermo/Macerata/Pesaro) restano programmi distinti
  (lo studente sceglie la propria sede), non vengono unite.
- Esami: shape `Insegnamenti` = oggetto quando popolato, `[]` quando vuoto (l'adapter
  tollera il vuoto via default; -9 nei probe = finestra vuota, trattata come no-exams).

Re-verificare ogni settembre e bumpare ANNO (i codici corso/anno2 cambiano per coorte).
