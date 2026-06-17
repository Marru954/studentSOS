# Campania "Luigi Vanvitelli" — EasyAcademy recon stub

Recon 2026-06-17 (Phase 1). **Stub for the main session to expand** — codes
captured, not invented. NOT yet wired (no `liveSources: true`).

- **Email domain:** studenti.unicampania.it
- **System:** EasyAcademy (EasyStaff, shared "agendastudenti" host)
- **Detected base url:** `https://easyacademy.easystaff.it/agendastudenti`
  - (this ateneo lives on EasyStaff's multi-tenant `easyacademy.easystaff.it`
    host, path `/agendastudenti` — not on a `*.unicampania.it` vanity host)
- **combo.php health:** `GET {base}/combo.php?sw=ec_&aa=2025&page=corsi` →
  non-empty `var elenco_corsi`, **40 corsi, all 40 with populated
  `elenco_anni`**. Catalogue includes Ingegneria (standard `scuola` codes).

## Example corso captured (for grid verification by the main session)

| corso | scuola | anno2 (sample) | label |
|---|---|---|---|
| `A15` | `DipartimentodiIngegneria` | `GEN|2` | INGEGNERIA AEROSPAZIALE |

> Catalogue is small (40 corsi) — may be a subset; the main session should
> sweep all 40 labels to pick the cleanest Ingegneria/Informatica target and
> derive its full per-year corso+anno2 mapping.

## ⚠️ Timetable endpoint NOT confirmed celle>0 (off-season caveat)

Probed in **June 2026**: same off-season state as every other EasyAcademy
instance — `grid_call.php` returns a valid envelope but `celle=0` for all
corso/anno2/date combos, exactly as the shipping live `uniroma2` preset does
right now, and `combo.php?aa=2026` is empty (next year not loaded). **Re-run the
celle>0 grid check in October 2026** before wiring live.
