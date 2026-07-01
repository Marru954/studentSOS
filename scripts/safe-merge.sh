#!/usr/bin/env bash
#
# safe-merge.sh — merge del branch corrente su main SOLO a gate verde,
# con tag di rollback creato e pushato prima del merge.
#
# Flusso (sessioni interattive):
#   branch di lavoro → gate (build+test+tsc+lint) → merge su main → push
#
# Regole di sicurezza (fallisce in modo esplicito, mai merge silenziosi):
#   - il branch corrente non può essere main
#   - working tree pulito (niente modifiche/staged/untracked)
#   - main locale allineato a origin/main (niente commit non pushati/divergenza)
#   - gate tutto verde, altrimenti nessun merge
#   - crea tag rollback/<data-ora> sull'ultimo commit di main PRIMA del merge
#     e lo pusha su origin insieme a main
#
# NIENTE push diretto su main a mano: questo script è l'unica via.

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

# --- posizionamento --------------------------------------------------------
REPO_ROOT="$(git rev-parse --show-toplevel)" || fail "non sono in un repo git"
cd "$REPO_ROOT"

APP_DIR="studentos" # dove girano build/test/tsc/lint
MAIN="main"

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
step "gate: build + test + tsc --noEmit + lint (in $APP_DIR/)"

run_gate() {
  local name="$1"; shift
  step "  gate: $name"
  if ! ( cd "$APP_DIR" && "$@" ); then
    fail "gate '$name' fallito — nessun merge."
  fi
}

run_gate "build" npm run build
run_gate "test"  npm test
run_gate "tsc"   npx tsc --noEmit
run_gate "lint"  npx eslint .
c_grn "✓ gate verde"

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
