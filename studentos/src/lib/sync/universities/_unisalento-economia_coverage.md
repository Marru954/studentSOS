# Salento (Lecce) — EasyAcademy recon stub

Recon 2026-06-17 (Phase 1). **Stub for the main session to expand** — codes
captured, not invented. NOT yet wired (no `liveSources: true`).

- **Email domain:** studenti.unisalento.it
- **System:** EasyAcademy (EasyStaff "PortaleStudenti")
- **Detected base url:** `https://logistica.unisalento.it/PortaleStudenti`
  - (also reachable: `easyroom.unisalento.it` for room booking; the public
    course-grid host is `logistica.unisalento.it/PortaleStudenti`)
- **combo.php health:** `GET {base}/combo.php?sw=ec_&aa=2025&page=corsi` →
  non-empty `var elenco_corsi`, **158 corsi, all 158 with populated
  `elenco_anni`** (anno2 codes present). Strong EasyAcademy course-grid shape.
- **Note on `scuola`:** empty string for every corso (this instance keys the
  grid by corso+anno2 only — like UNIVE). Pass `scuola=` empty in grid_call.php.

## Example corso captured (for grid verification by the main session)

| corso | scuola | anno2 (sample) | label |
|---|---|---|---|
| `LB05R` | `` (empty) | `A-L|1`, `M-Z|1` | ECONOMIA AZIENDALE (triennale, year 1) |
| `LB05` | `` (empty) | `A-L|2`, `M-Z|2` | ECONOMIA AZIENDALE (year 2/3) |
| `LB49R` | `` (empty) | `999|1` | INGEGNERIA BIOMEDICA (triennale, year 1) |

> No Informatica triennale in the captured catalogue; Economia Aziendale and
> Ingegneria are the cleanest targets.

## ⚠️ Timetable endpoint NOT confirmed celle>0 (off-season caveat)

Probed in **June 2026**: `grid_call.php` returns the valid response envelope but
`celle=[]` (length 0) for every corso/anno2/date tried — **this is the global
off-season state, not a Salento defect.** The shipping, verified-live
`uniroma2` preset (`easyutv.uniroma2.it/agendaweb`, Informatica H02 `comune|1`)
*also* returns `celle=0` for all AA-2025/26 dates right now, and `combo.php?aa=2026`
is still empty everywhere (next year not loaded). **Re-run the grid_call.php
celle>0 check in October 2026** (term in session) before flipping to live; the
combo catalogue is the only verifiable EasyAcademy signal available today.
