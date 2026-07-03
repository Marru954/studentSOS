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

fail() {
  c_red "✗ safe-merge: $1"
  exit 1
}

step() { c_ylw "→ $1"; }

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

# --- 4. gate (build + test + tsc + lint) -----------------------------------
[ -d "$APP_DIR" ] || fail "cartella app '$APP_DIR' assente."

run_gate() {
  local name="$1"; shift
  step "  gate: $name"
  if ! ( cd "$APP_DIR" && "$@" ); then
    fail "gate '$name' fallito — nessun merge."
  fi
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
  if [ "$WALL5_RC" -eq 0 ] && [ "$WALL4_RC" -eq 0 ]; then
    c_grn "✓ DRY_RUN: tutti i controlli PASS (merge NON eseguito)."
    exit 0
  fi
  c_red "✗ DRY_RUN: almeno un muro FAIL (merge NON eseguito)."
  exit 1
fi

[ "$WALL5_RC" -eq 0 ] || fail "muro #5 (dipendenze npm) fallito — nessun merge."
[ "$WALL4_RC" -eq 0 ] || fail "muro #4 (URL/codici EA) fallito — nessun merge."
c_grn "✓ muri #4/#5 verdi"

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

# --- 7. push atomico main + tag rollback -----------------------------------
step "push origin $MAIN + $ROLLBACK_TAG"
if ! git push origin "$MAIN" "refs/tags/$ROLLBACK_TAG"; then
  cleanup_tag
  fail "push fallito. Nulla è arrivato su origin/$MAIN; tag rollback locale rimosso."
fi

c_grn "✓ merge completato: $BRANCH → $MAIN"
c_grn "✓ rollback disponibile:  git reset --hard $ROLLBACK_TAG   (ripristina $MAIN pre-merge)"
git --no-pager log --oneline -3 "$MAIN"
