#!/usr/bin/env bash
#
# safe-merge.sh — merge del branch corrente su main SOLO a gate verde,
# con tag di rollback creato e pushato prima del merge.
#
# Flusso (sessioni interattive):
#   branch di lavoro → gate (build+test+tsc+lint) → muri #4/#5 → merge su main → push
#
# Regole di sicurezza (fallisce in modo esplicito, mai merge silenziosi):
#   - il branch corrente non può essere main
#   - working tree pulito (niente modifiche/staged/untracked)
#   - main locale allineato a origin/main (niente commit non pushati/divergenza)
#   - gate tutto verde, altrimenti nessun merge
#   - MURO #5: nessuna dipendenza npm nuova non dichiarata (ALLOW_NEW_DEPS=1 per sbloccare)
#   - MURO #4: nessun URL/codice EasyAcademy non verificato nel diff
#             (allowlist in scripts/verified-endpoints.txt; ALLOW_UNVERIFIED_URLS=1 per sbloccare)
#   - crea tag rollback/<data-ora> sull'ultimo commit di main PRIMA del merge
#     e lo pusha su origin insieme a main
#
# NIENTE push diretto su main a mano: questo script è l'unica via.
#
# Modalità --auto (2026-09-26, autorizzata esplicitamente dall'utente per questo file):
#   ./scripts/safe-merge.sh --auto
#   Stesso flusso, pensato per l'esecuzione senza supervisione: gate verde + muri #4/#5
#   verdi + NESSUN file sensibile → tag di rollback → merge su main → push, senza altri
#   passaggi. Gate o muri rossi: si ferma (exit 1), nessun tag, nessun merge.
#   ECCEZIONE OBBLIGATORIA (non rimuovibile senza nuova autorizzazione esplicita dell'utente):
#   se il branch tocca preset/config EasyAcademy o il modulo di sync verso le università
#   — o le guardie del merge stesse — l'auto-merge si ferma ANCHE A GATE VERDE (exit 10),
#   elenca i file che hanno fatto scattare il blocco e chiede conferma manuale: "dati non
#   inventati / verificato con output mostrato" non lo può controllare nessun gate.
#   Dopo il via libera esplicito dell'utente si rilancia SENZA --auto.
#   Il rilevamento è fail-closed: se una regola è obsoleta o git non risponde, blocca.
#   A ogni uscita (merge, blocco o errore) stampa un riepilogo di ~10 righe e lo salva in
#   studentos/docs/stato/LAST_SESSION_SUMMARY.md (gitignored: riscritto a ogni corsa).
#   Codici di uscita: 0 ok · 1 errore (gate, muri, git…) · 2 uso errato · 10 conferma manuale.
#   Senza --auto lo script si comporta ESATTAMENTE come prima.
#
# Env di controllo:
#   DRY_RUN=1              esegue gate + muri #4/#5, stampa PASS/FAIL, NON fa merge né tag.
#   SKIP_GATE=1            (solo con DRY_RUN=1) salta il gate pesante e testa solo i due muri.
#   ALLOW_NEW_DEPS=1       muro #5 non blocca: stampa solo un avviso con le dep nuove.
#   ALLOW_UNVERIFIED_URLS=1 muro #4 non blocca: stampa solo un avviso con gli URL/codici.

set -euo pipefail

# --- helper ----------------------------------------------------------------
c_red() { printf '\033[31m%s\033[0m\n' "$1"; }
c_grn() { printf '\033[32m%s\033[0m\n' "$1"; }
c_ylw() { printf '\033[33m%s\033[0m\n' "$1"; }

# stato per il riepilogo di --auto (il trap on_exit lo legge a ogni uscita)
AUTO=0
OUTCOME=""            # MERGIATO | PRONTO (dry-run) | BLOCCATO | FALLITO
FAIL_REASON=""
GATE_LOG=""           # es. " build:PASS test:FAIL"
WALL5_RC=""
WALL4_RC=""
SENS_RC=0
SENS_ERR=""
SENSITIVE_HITS=""     # righe "percorso<TAB>motivo"
SENS_TMP=""
PRE_COMMITS=""
PRE_STAT=""
MAIN_LOCAL=""
ROLLBACK_TAG=""
MERGED_LOCAL=0
START_EPOCH="$(date +%s)"

fail() {
  FAIL_REASON="$1"
  c_red "✗ safe-merge: $1"
  exit 1
}

step() { c_ylw "→ $1"; }

for arg in "$@"; do
  case "$arg" in
    --auto) AUTO=1 ;;
    *) c_red "✗ safe-merge: argomento sconosciuto '$arg' (unico flag ammesso: --auto)"; exit 2 ;;
  esac
done

# --- MURO #5: nessuna dipendenza npm nuova non dichiarata -------------------
# Confronta le chiavi di dependencies+devDependencies tra origin/main e HEAD.
# Ritorna 0 (PASS) o 1 (FAIL). ALLOW_NEW_DEPS=1 declassa il blocco ad avviso.
check_new_deps() {
  step "muro #5: dipendenze npm (nuove chiavi vs origin/$MAIN)"

  local base_pkg head_pkg new_deps
  base_pkg="$(git show "origin/$MAIN:$PKG_PATH" 2>/dev/null || echo '{}')"
  if [ ! -f "$PKG_PATH" ]; then
    c_red "  ✗ muro #5 FAIL: $PKG_PATH non trovato."
    return 1
  fi
  head_pkg="$(cat "$PKG_PATH")"

  # union delle chiavi dependencies+devDependencies presenti in HEAD ma non su main
  new_deps="$(BASE_PKG="$base_pkg" HEAD_PKG="$head_pkg" node -e '
    const b = JSON.parse(process.env.BASE_PKG || "{}");
    const h = JSON.parse(process.env.HEAD_PKG || "{}");
    const keys = (o) => Object.keys({ ...(o.dependencies || {}), ...(o.devDependencies || {}) });
    const base = new Set(keys(b));
    const added = keys(h).filter((k) => !base.has(k));
    process.stdout.write(added.join("\n"));
  ')" || { c_red "  ✗ muro #5 FAIL: parsing package.json non riuscito."; return 1; }

  if [ -z "$new_deps" ]; then
    c_grn "  ✓ muro #5 PASS: nessuna dipendenza npm nuova."
    return 0
  fi

  if [ "$ALLOW_NEW_DEPS" = "1" ]; then
    c_ylw "  ⚠ muro #5: ALLOW_NEW_DEPS=1 — dipendenze nuove AUTORIZZATE una-tantum:"
    printf '%s\n' "$new_deps" | sed 's/^/      + /'
    c_grn "  ✓ muro #5 PASS (con override)."
    return 0
  fi

  c_red "  ✗ muro #5 FAIL: dipendenze npm nuove non dichiarate su origin/$MAIN:"
  printf '%s\n' "$new_deps" | sed 's/^/      + /'
  c_red "    Nessuna nuova dipendenza npm senza richiesta esplicita (muro #5)."
  c_red "    Per uno sblocco una-tantum riesegui con ALLOW_NEW_DEPS=1."
  return 1
}

# --- MURO #4: nessun URL/codice EasyAcademy non verificato ------------------
# Scansiona SOLO le righe aggiunte nel diff origin/main...HEAD, dentro src/ e
# scripts/ (esclusi lo script stesso e la sua allowlist). Blocca ogni URL
# http(s):// o token combo.php non presente in verified-endpoints.txt.
# Ritorna 0 (PASS) o 1 (FAIL). ALLOW_UNVERIFIED_URLS=1 declassa a avviso.
check_unverified_endpoints() {
  step "muro #4: URL/codici EasyAcademy non verificati (diff origin/$MAIN...HEAD)"

  local added allow_norm urls combos candidates
  added="$(git diff "origin/$MAIN...HEAD" -- \
      "$SRC_DIR" "scripts" \
      ":(exclude)scripts/safe-merge.sh" \
      ":(exclude)scripts/verified-endpoints.txt" \
    | grep '^+' | grep -v '^+++' || true)"

  if [ -z "$added" ]; then
    c_grn "  ✓ muro #4 PASS: nessuna riga aggiunta in src/ o scripts/ da controllare."
    return 0
  fi

  # allowlist normalizzata: no commenti/righe vuote, senza schema, senza slash finali
  allow_norm="$(grep -vE '^[[:space:]]*(#|$)' "$VERIFIED_FILE" 2>/dev/null \
    | sed -E 's#^https?://##; s#/+$##' || true)"

  # candidati: URL http(s):// completi + token che contengono combo.php
  urls="$(printf '%s\n' "$added" | grep -oE 'https?://[A-Za-z0-9._~:/?#@!$&*+,;=%()-]+' || true)"
  combos="$(printf '%s\n' "$added" | grep -oE '[A-Za-z0-9._~:/?#@!$&*+,;=%()-]*combo\.php[A-Za-z0-9._~:/?#@!$&*+,;=%()-]*' || true)"
  candidates="$(printf '%s\n%s\n' "$urls" "$combos" | sed '/^[[:space:]]*$/d' | sort -u || true)"

  if [ -z "$candidates" ]; then
    c_grn "  ✓ muro #4 PASS: nessun URL o codice combo.php nelle righe aggiunte."
    return 0
  fi

  local violations="" cand norm
  while IFS= read -r cand; do
    [ -z "$cand" ] && continue
    norm="$(printf '%s' "$cand" | sed -E 's#^https?://##; s#/+$##')"
    # verificato se una voce dell'allowlist è sottostringa del candidato
    if [ -n "$allow_norm" ] && printf '%s' "$norm" | grep -qFf <(printf '%s\n' "$allow_norm"); then
      continue
    fi
    violations+="$cand"$'\n'
  done <<< "$candidates"

  if [ -z "$violations" ]; then
    c_grn "  ✓ muro #4 PASS: tutti gli URL/codici sono in verified-endpoints.txt."
    return 0
  fi

  if [ "$ALLOW_UNVERIFIED_URLS" = "1" ]; then
    c_ylw "  ⚠ muro #4: ALLOW_UNVERIFIED_URLS=1 — URL/codici NON verificati (override):"
    printf '%s' "$violations" | sed '/^$/d; s/^/      • /'
    c_grn "  ✓ muro #4 PASS (con override)."
    return 0
  fi

  c_red "  ✗ muro #4 FAIL: URL/codici EasyAcademy non verificati nel diff:"
  printf '%s' "$violations" | sed '/^$/d; s/^/      • /'
  c_red "    Se sono verificati, aggiungili a scripts/verified-endpoints.txt (questo È l'atto di verifica);"
  c_red "    per uno sblocco una-tantum riesegui con ALLOW_UNVERIFIED_URLS=1."
  return 1
}

# --- FILE SENSIBILI (solo --auto) ---------------------------------------------
# Il branch tocca dati/config che nessun gate sa validare (codici EasyAcademy, preset degli
# atenei, sync verso le università)? O le guardie del merge stesse (questo script, la
# allowlist, gli hook)? Allora l'auto-merge si ferma e serve la conferma manuale dell'utente.
#
# Rilevamento su TRE livelli, sul diff origin/main...HEAD con --no-renames (un file spostato
# o cancellato compare anche col vecchio nome), sempre case-insensitive:
#   1. PERCORSO   il file toccato sta in uno dei perimetri qui sotto (SENS_LABELS ↔ SENS_RES).
#   2. CONTENUTO  una riga aggiunta/rimossa (fuori dai .md) cita EasyAcademy, preset o sync:
#                 prende un preset o un codice finito per errore fuori dai perimetri.
#   3. LINK       qualunque symlink/submodule toccato (potrebbe puntare dentro un perimetro).
# Fail-closed: regola obsoleta (nessun file tracciato la soddisfa: percorso spostato?),
# errore di git o diff vuoto → blocco. Mai "via libera per mancanza di prove".
SENS_LABELS=(
  "sync università / preset EasyAcademy"
  "route server di sync"
  "discovery/sync insegnamenti"
  "client di sync"
  "risoluzione corso→sorgenti da sincronizzare"
  "mappa email→ateneo"
  "tool di cattura/verifica codici"
  "allowlist endpoint verificati"
  "guardia del merge"
  "guardia del merge"
  "guardia del merge"
)
SENS_RES=(
  '^studentos/src/lib/sync/'
  '^studentos/src/app/api/([^/]+/)*sync[^/]*/'
  '^studentos/src/lib/insegnamenti/(discovery|sync)\.ts$'
  '^studentos/src/lib/(storage/syncClient|state/synced)\.ts$'
  '^studentos/src/lib/state/settings\.ts$'
  '^studentos/src/lib/domain/emailToAteneo\.ts$'
  '^studentos/scripts/(audit|recapture|probe)-[^/]*$'
  '^scripts/verified-endpoints\.txt$'
  '^(studentos/)?scripts/safe-merge\.sh$'
  '^\.claude/settings[^/]*\.json$'
  '^studentos/scripts/hooks/'
)
SENS_CONTENT_RE='easyacademy|easystaff|agendaweb|agendastudenti|portalestudenti|combo\.php|grid_call|test_call|anno2|esami_cdl|liveSources|livePrograms|liveProgramFor|degreeSources|UNIVERSITY_PRESETS|enabledSources|cineca|gomp\.it'
SENS_RAN=0

# Ritorna 0 = nessun file sensibile · 1 = trovati (in SENSITIVE_HITS) · 2 = rilevamento non
# affidabile (motivo in SENS_ERR). Chiamata sempre come `check_sensitive_files || SENS_RC=$?`:
# dentro una funzione così `set -e` è sospeso, quindi ogni comando che può fallire ha il
# suo `|| return 2` esplicito.
check_sensitive_files() {
  local range="origin/$MAIN...HEAD" tracked f i re line was_nocase=0 changed=0
  SENSITIVE_HITS=""
  SENS_ERR=""
  SENS_RAN=1

  # 0) autoverifica: le due tabelle devono restare allineate, e ogni regola di percorso deve
  #    trovare almeno un file tracciato su origin/main, altrimenti è obsoleta (cartella
  #    rinominata) e non protegge più nulla.
  if [ "${#SENS_LABELS[@]}" -ne "${#SENS_RES[@]}" ]; then
    SENS_ERR="tabelle sfasate: ${#SENS_LABELS[@]} etichette ≠ ${#SENS_RES[@]} regole"
    return 2
  fi
  #    Here-string e non pipe: `grep -q` chiude subito e, con pipefail, un SIGPIPE a monte
  #    farebbe sembrare "nessun match" un match riuscito.
  tracked="$(git ls-tree -r --name-only "origin/$MAIN")" \
    || { SENS_ERR="git ls-tree su origin/$MAIN fallito"; return 2; }
  i=0
  while [ "$i" -lt "${#SENS_RES[@]}" ]; do
    if ! grep -Eiq -- "${SENS_RES[$i]}" <<< "$tracked"; then
      SENS_ERR="regola obsoleta, nessun file di origin/$MAIN la soddisfa (percorso spostato?): ${SENS_LABELS[$i]} = ${SENS_RES[$i]}"
      return 2
    fi
    i=$((i + 1))
  done

  [ -n "$SENS_TMP" ] || SENS_TMP="$(mktemp)" || { SENS_ERR="mktemp fallito"; return 2; }

  # 1) livello PERCORSO (lista NUL-separata: nomi con spazi/accenti non rompono nulla)
  git diff -z --name-only --no-renames "$range" > "$SENS_TMP" \
    || { SENS_ERR="git diff $range fallito"; return 2; }
  shopt -q nocasematch && was_nocase=1
  shopt -s nocasematch
  while IFS= read -r -d '' f; do
    changed=$((changed + 1))
    i=0
    while [ "$i" -lt "${#SENS_RES[@]}" ]; do
      re="${SENS_RES[$i]}"
      if [[ "$f" =~ $re ]]; then
        SENSITIVE_HITS+="$f"$'\t'"${SENS_LABELS[$i]}"$'\n'
      fi
      i=$((i + 1))
    done
  done < "$SENS_TMP"
  [ "$was_nocase" -eq 1 ] || shopt -u nocasematch
  if [ "$changed" -eq 0 ]; then
    SENS_ERR="nessuna modifica rispetto a origin/$MAIN: niente da mergiare (o diff non affidabile)"
    return 2
  fi

  # 2) livello CONTENUTO (-G guarda solo le righe aggiunte/rimosse, non il contesto)
  git diff -z --name-only --no-renames -i -G"$SENS_CONTENT_RE" "$range" -- . ':(exclude)*.md' > "$SENS_TMP" \
    || { SENS_ERR="git diff -G fallito su $range"; return 2; }
  while IFS= read -r -d '' f; do
    SENSITIVE_HITS+="$f"$'\t'"righe modificate che citano EasyAcademy/preset/sync"$'\n'
  done < "$SENS_TMP"

  # 3) livello LINK: symlink (120000) o submodule (160000), vecchio o nuovo modo
  git diff --raw --no-renames "$range" > "$SENS_TMP" \
    || { SENS_ERR="git diff --raw fallito su $range"; return 2; }
  while IFS= read -r line; do
    SENSITIVE_HITS+="${line#*$'\t'}"$'\t'"symlink/submodule (può puntare dentro un perimetro sensibile)"$'\n'
  done < <(grep -E '^:(120000|160000) |^:[0-7]+ (120000|160000) ' "$SENS_TMP" || true)

  if [ -n "$SENSITIVE_HITS" ]; then
    return 1
  fi
  return 0
}

# un file per riga, con tutti i motivi per cui è scattato il blocco
print_sensitive_hits() {
  printf '%s' "$SENSITIVE_HITS" | LC_ALL=C sort -u | awk -F'\t' '
    NF < 2 { next }
    $1 == last { labels = labels "; " $2; next }
    { if (last != "") printf "      • %s   [%s]\n", last, labels; last = $1; labels = $2 }
    END { if (last != "") printf "      • %s   [%s]\n", last, labels }'
}

# blocco dell'auto-merge: nessun tag, nessun merge, exit 10 (≠ 1: non è un errore, è una
# decisione che spetta all'utente)
block_manual_confirmation() {
  OUTCOME="BLOCCATO"
  echo
  c_ylw "✋ AUTO-MERGE FERMATO — serve la conferma manuale dell'utente (anche a gate verde)"
  if [ "$SENS_RC" -eq 2 ]; then
    c_ylw "   Motivo: rilevamento dei file sensibili NON affidabile → blocco per sicurezza (fail-closed):"
    c_ylw "      $SENS_ERR"
  else
    c_ylw "   Motivo: il branch tocca file sensibili (preset/config EasyAcademy, sync università, guardie del merge):"
    print_sensitive_hits
  fi
  c_ylw "   Nessun tag creato, nessun merge, main non toccato."
  c_ylw "   Dopo il via libera ESPLICITO dell'utente: rilancia SENZA --auto → ./scripts/safe-merge.sh"
  exit 10
}

# --- riepilogo di --auto ------------------------------------------------------
# Cosa entra nel merge, calcolato PRIMA del merge (dopo, origin/main lo include già).
collect_branch_info() {
  local n
  n="$(git rev-list --count "origin/$MAIN..HEAD" 2>/dev/null || echo '?')"
  PRE_STAT="$n commit · $(git diff --shortstat "origin/$MAIN...HEAD" 2>/dev/null | sed 's/^ //' || true)"
  PRE_COMMITS="$(git log --oneline --no-decorate -8 "origin/$MAIN..HEAD" 2>/dev/null | sed 's/^/    /' || true)"
}

wall_mark() {
  case "$1" in
    0) printf '✓' ;;
    "") printf '–' ;;
    *) printf '✗' ;;
  esac
}

# testo del riepilogo (markdown: si legge uguale a schermo e nel file)
summary_text() {
  local outcome="$OUTCOME" icon dur s res gate="" overrides=""
  dur=$(( $(date +%s) - START_EPOCH ))
  [ -n "$outcome" ] || outcome="FALLITO"
  case "$outcome" in
    MERGIATO) icon="✅" ;;
    PRONTO)   icon="🧪" ;;
    BLOCCATO) icon="✋" ;;
    *)        icon="❌" ;;
  esac

  for s in build test tsc lint; do
    case "$GATE_LOG" in
      *" $s:PASS"*) res="✓" ;;
      *" $s:FAIL"*) res="✗" ;;
      *)            res="–" ;;
    esac
    gate+="$s $res   "
  done
  if [ "${DRY_RUN:-0}" = "1" ] && [ "${SKIP_GATE:-0}" = "1" ]; then gate="saltato (DRY_RUN + SKIP_GATE)"; fi

  printf '# Auto-merge: %s %s — %s\n' "$outcome" "$icon" "$(date '+%Y-%m-%d %H:%M:%S')"
  printf -- '- **Branch:** %s → %s  (%dm%02ds)%s\n' "${BRANCH:-?}" "$MAIN" $((dur / 60)) $((dur % 60)) \
    "$([ "${DRY_RUN:-0}" = "1" ] && printf '  — DRY_RUN: nessun merge eseguito')"
  if [ -n "$PRE_STAT" ]; then
    printf -- '- **Cosa:** %s\n' "$PRE_STAT"
    [ -n "$PRE_COMMITS" ] && printf '%s\n' "$PRE_COMMITS"
  fi
  printf -- '- **Gate:** %s\n' "$gate"
  printf -- '- **Muri:** #5 %s   #4 %s\n' "$(wall_mark "$WALL5_RC")" "$(wall_mark "$WALL4_RC")"
  [ "${ALLOW_NEW_DEPS:-0}" = "1" ] && overrides+=" ALLOW_NEW_DEPS=1"
  [ "${ALLOW_UNVERIFIED_URLS:-0}" = "1" ] && overrides+=" ALLOW_UNVERIFIED_URLS=1"
  [ -n "$overrides" ] && printf -- '- **Override attivi:**%s (decisione umana una-tantum)\n' "$overrides"
  if [ "$SENS_RAN" -eq 0 ]; then
    printf -- '- **File sensibili:** non controllati (uscito prima)\n'
  elif [ "$SENS_RC" -eq 2 ]; then
    printf -- '- **File sensibili:** rilevamento NON affidabile → blocco (%s)\n' "$SENS_ERR"
  elif [ "$SENS_RC" -eq 1 ]; then
    printf -- '- **File sensibili:** SÌ, conferma manuale richiesta:\n'
    print_sensitive_hits
  else
    printf -- '- **File sensibili:** nessuno\n'
  fi

  case "$outcome" in
    MERGIATO)
      printf -- '- **Rollback:** tag `%s` → %s — ripristino: `git reset --hard %s`\n' "$ROLLBACK_TAG" "${MAIN_LOCAL:0:7}" "$ROLLBACK_TAG"
      ;;
    PRONTO)
      printf -- '- **Esito previsto:** senza DRY_RUN avrebbe creato il tag di rollback e mergiato.\n'
      ;;
    BLOCCATO)
      printf -- '- **Effetti:** nessun tag, nessun merge, main invariato.\n'
      printf -- '- **Prossimo passo:** solo dopo il via libera esplicito dell'"'"'utente, rilanciare `./scripts/safe-merge.sh` SENZA `--auto`.\n'
      ;;
    *)
      [ -n "$FAIL_REASON" ] && printf -- '- **Motivo:** %s\n' "$FAIL_REASON"
      if [ "$MERGED_LOCAL" -eq 1 ]; then
        printf -- '- **Effetti:** ATTENZIONE — merge eseguito su main LOCALE ma non pubblicato: origin/main è invariato, main locale è avanti.\n'
      else
        printf -- '- **Effetti:** nessun tag, nessun merge, main invariato.\n'
      fi
      ;;
  esac
}

# a ogni uscita (merge, blocco, errore) di una corsa --auto: a schermo + file
on_exit() {
  local dir text
  set +e
  [ -n "$SENS_TMP" ] && rm -f "$SENS_TMP"
  if [ "$AUTO" = "1" ]; then
    text="$(summary_text)"
    echo
    echo "── RIEPILOGO AUTO-MERGE ─────────────────────────────────────────────"
    printf '%s\n' "$text"
    dir="$REPO_ROOT/$APP_DIR/docs/stato"
    if mkdir -p "$dir" 2>/dev/null && printf '%s\n' "$text" > "$dir/LAST_SESSION_SUMMARY.md" 2>/dev/null; then
      echo "(salvato in $APP_DIR/docs/stato/LAST_SESSION_SUMMARY.md)"
    fi
  fi
  return 0
}

# --- posizionamento --------------------------------------------------------
REPO_ROOT="$(git rev-parse --show-toplevel)" || fail "non sono in un repo git"
cd "$REPO_ROOT"

APP_DIR="studentos" # dove girano build/test/tsc/lint
MAIN="main"

# muri #4/#5: configurazione
SRC_DIR="$APP_DIR/src"                              # sorgenti scansionati dal muro #4
PKG_PATH="$APP_DIR/package.json"                    # manifest dep controllato dal muro #5
VERIFIED_FILE="$REPO_ROOT/scripts/verified-endpoints.txt" # allowlist muro #4
DRY_RUN="${DRY_RUN:-0}"
SKIP_GATE="${SKIP_GATE:-0}"
ALLOW_NEW_DEPS="${ALLOW_NEW_DEPS:-0}"
ALLOW_UNVERIFIED_URLS="${ALLOW_UNVERIFIED_URLS:-0}"

# --auto: da qui in poi ogni uscita (merge, blocco, errore) stampa e salva il riepilogo
[ "$AUTO" = "1" ] && trap on_exit EXIT
[ "$AUTO" = "1" ] && step "modalità --auto (merge senza supervisione, salvo file sensibili)"

# --- 1. branch corrente ≠ main --------------------------------------------
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
[ "$BRANCH" = "$MAIN" ] && fail "sei su '$MAIN'. Lavora su un branch dedicato e rilancia."
[ "$BRANCH" = "HEAD" ] && fail "HEAD detached: fai checkout di un branch prima del merge."
step "branch corrente: $BRANCH"

# --- 2. working tree pulito ------------------------------------------------
if [ -n "$(git status --porcelain)" ]; then
  git status --short
  fail "working tree sporco (modifiche/staged/untracked). Commit o pulisci prima del merge."
fi
step "working tree pulito"

# --- 3. allineamento main ↔ origin/main -----------------------------------
step "fetch origin"
git fetch --quiet origin "$MAIN" --tags

git rev-parse --verify --quiet "origin/$MAIN" >/dev/null \
  || fail "origin/$MAIN non trovato."

MAIN_LOCAL="$(git rev-parse "$MAIN")"
MAIN_REMOTE="$(git rev-parse "origin/$MAIN")"
if [ "$MAIN_LOCAL" != "$MAIN_REMOTE" ]; then
  AHEAD="$(git rev-list --count "origin/$MAIN..$MAIN")"
  BEHIND="$(git rev-list --count "$MAIN..origin/$MAIN")"
  fail "$MAIN locale e origin/$MAIN divergono (ahead=$AHEAD, behind=$BEHIND). Allinea $MAIN a origin prima del merge."
fi
step "$MAIN allineato a origin/$MAIN ($MAIN_LOCAL)"
[ "$AUTO" = "1" ] && collect_branch_info

# --- 4. gate (build + test + tsc + lint) -----------------------------------
[ -d "$APP_DIR" ] || fail "cartella app '$APP_DIR' assente."

run_gate() {
  local name="$1"; shift
  step "  gate: $name"
  if ! ( cd "$APP_DIR" && "$@" ); then
    GATE_LOG+=" $name:FAIL"
    fail "gate '$name' fallito — nessun merge."
  fi
  GATE_LOG+=" $name:PASS"
}

if [ "$DRY_RUN" = "1" ] && [ "$SKIP_GATE" = "1" ]; then
  c_ylw "→ gate: SALTATO (DRY_RUN=1 SKIP_GATE=1 — test dei soli muri #4/#5)"
else
  step "gate: build + test + tsc --noEmit + lint (in $APP_DIR/)"
  run_gate "build" npm run build
  run_gate "test"  npm test
  run_gate "tsc"   npx tsc --noEmit
  run_gate "lint"  npx eslint .
  c_grn "✓ gate verde"
fi

# --- 4bis. muri #4 (URL/codici EA) + #5 (dipendenze npm) -------------------
# Girano DOPO il gate verde e PRIMA di ogni scrittura su main: un fallimento
# aborta prima del tag e del merge. In DRY_RUN non abortiscono: raccolgono
# l'esito e lo riportano nel riepilogo finale.
step "muri #4/#5 (enforcement pre-merge)"

WALL5_RC=0
WALL4_RC=0
check_new_deps            || WALL5_RC=$?
check_unverified_endpoints || WALL4_RC=$?

# --auto: il branch tocca file sensibili? (v. FILE SENSIBILI). Gira anche a muri rossi,
# così il riepilogo dice tutto in una volta.
if [ "$AUTO" = "1" ]; then
  step "auto-merge: file sensibili (preset/config EasyAcademy, sync università, guardie del merge)"
  check_sensitive_files || SENS_RC=$?
  case "$SENS_RC" in
    0) c_grn "  ✓ nessun file sensibile toccato." ;;
    1) c_ylw "  ⚠ file sensibili toccati:"; print_sensitive_hits ;;
    *) c_ylw "  ⚠ rilevamento non affidabile: $SENS_ERR" ;;
  esac
fi

if [ "$DRY_RUN" = "1" ]; then
  echo
  c_ylw "── DRY_RUN: riepilogo (nessun merge, nessun tag) ─────────────────────"
  if [ "$SKIP_GATE" = "1" ]; then
    c_ylw "  gate:    SALTATO"
  else
    c_grn "  gate:    PASS"
  fi
  [ "$WALL5_RC" -eq 0 ] && c_grn "  muro #5: PASS" || c_red "  muro #5: FAIL"
  [ "$WALL4_RC" -eq 0 ] && c_grn "  muro #4: PASS" || c_red "  muro #4: FAIL"
  if [ "$AUTO" = "1" ]; then
    [ "$SENS_RC" -eq 0 ] && c_grn "  sensibili: nessuno" || c_ylw "  sensibili: BLOCCO (conferma manuale)"
  fi
  if [ "$WALL5_RC" -eq 0 ] && [ "$WALL4_RC" -eq 0 ]; then
    if [ "$AUTO" = "1" ] && [ "$SENS_RC" -ne 0 ]; then
      c_ylw "→ DRY_RUN --auto: i controlli passano, ma l'auto-merge si fermerebbe qui."
      block_manual_confirmation
    fi
    c_grn "✓ DRY_RUN: tutti i controlli PASS (merge NON eseguito)."
    OUTCOME="PRONTO"
    exit 0
  fi
  FAIL_REASON="DRY_RUN: almeno un muro fallito"
  c_red "✗ DRY_RUN: almeno un muro FAIL (merge NON eseguito)."
  exit 1
fi

[ "$WALL5_RC" -eq 0 ] || fail "muro #5 (dipendenze npm) fallito — nessun merge."
[ "$WALL4_RC" -eq 0 ] || fail "muro #4 (URL/codici EA) fallito — nessun merge."
c_grn "✓ muri #4/#5 verdi"

# --auto: ECCEZIONE OBBLIGATORIA — file sensibili (o rilevamento inaffidabile) → stop,
# anche a gate verde. Prima di tag e merge: main resta intatto.
if [ "$AUTO" = "1" ] && [ "$SENS_RC" -ne 0 ]; then
  block_manual_confirmation
fi

# --- 5. tag di rollback (sul main PRE-merge) -------------------------------
STAMP="$(date +%Y-%m-%d-%H%M%S)"
ROLLBACK_TAG="rollback/$STAMP"
git rev-parse --verify --quiet "refs/tags/$ROLLBACK_TAG" >/dev/null \
  && fail "il tag $ROLLBACK_TAG esiste già (rilancia tra un secondo)."

git tag -a "$ROLLBACK_TAG" "$MAIN_LOCAL" \
  -m "Rollback point: stato di $MAIN prima del merge di $BRANCH ($STAMP)"
step "tag rollback creato: $ROLLBACK_TAG → $MAIN_LOCAL"

# se qualcosa va storto dopo aver creato il tag ma prima del push, rimuovilo
cleanup_tag() {
  git tag -d "$ROLLBACK_TAG" >/dev/null 2>&1 || true
}

# --- 6. merge su main (ff se possibile, altrimenti merge commit) -----------
step "merge $BRANCH → $MAIN"
git checkout --quiet "$MAIN"

if git merge --ff-only "$BRANCH" >/dev/null 2>&1; then
  step "  fast-forward"
else
  if ! git merge --no-ff "$BRANCH" -m "merge: $BRANCH → $MAIN (safe-merge, rollback $ROLLBACK_TAG)"; then
    git merge --abort >/dev/null 2>&1 || true
    git checkout --quiet "$BRANCH" || true
    cleanup_tag
    fail "merge fallito (conflitti). Tag rollback rimosso, nessuna modifica pushata."
  fi
  step "  merge commit"
fi
MERGED_LOCAL=1

# --- 7. push atomico main + tag rollback -----------------------------------
step "push origin $MAIN + $ROLLBACK_TAG"
if ! git push origin "$MAIN" "refs/tags/$ROLLBACK_TAG"; then
  cleanup_tag
  fail "push fallito. Nulla è arrivato su origin/$MAIN; tag rollback locale rimosso."
fi
OUTCOME="MERGIATO"

c_grn "✓ merge completato: $BRANCH → $MAIN"
c_grn "✓ rollback disponibile:  git reset --hard $ROLLBACK_TAG   (ripristina $MAIN pre-merge)"
git --no-pager log --oneline -3 "$MAIN"
