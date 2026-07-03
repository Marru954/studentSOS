#!/usr/bin/env bash
# Merge sicuro del branch di lavoro corrente su main.
# Uso: ./scripts/safe-merge.sh (da lanciare dalla root di studentos/, dal branch di lavoro)
#
# Fallisce in modo esplicito se: sei su main, il working tree è sporco,
# main locale diverge da origin/main, o il gate (build+test+tsc+lint) non è verde.
# Solo a gate verde: crea un tag rollback/<data-ora> sullo stato di main
# precedente al merge, fa il merge (fast-forward se possibile, altrimenti
# merge commit) e pusha main + il tag su origin.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

err() { echo "safe-merge: $*" >&2; exit 1; }

current_branch=$(git rev-parse --abbrev-ref HEAD)

[ "$current_branch" = "main" ] && err "sei su main — lancia questo script dal branch di lavoro, non da main."
[ "$current_branch" = "HEAD" ] && err "HEAD staccato — checkout su un branch di lavoro prima di continuare."

[ -z "$(git status --porcelain)" ] || err "working tree sporco — committa o stash prima di continuare."

echo "==> aggiorno origin/main"
git fetch origin main

local_main=$(git rev-parse main)
remote_main=$(git rev-parse origin/main)
[ "$local_main" = "$remote_main" ] || err "main locale diverge da origin/main — aggiorna main (git fetch/pull) prima di continuare."

echo "==> gate: build"
npm run build

echo "==> gate: test"
npm test

echo "==> gate: tsc --noEmit"
./node_modules/.bin/tsc --noEmit

echo "==> gate: lint"
npm run lint

echo "==> gate verde, procedo con il merge"

timestamp=$(date +%Y%m%d-%H%M%S)
tag_name="rollback/${timestamp}"
git tag "$tag_name" main
echo "==> tag di rollback creato: $tag_name (stato di main pre-merge)"

git checkout main

if git merge --ff-only "$current_branch" 2>/dev/null; then
  echo "==> fast-forward su main"
else
  git merge --no-ff "$current_branch" -m "Merge branch '$current_branch' into main"
  echo "==> merge commit creato su main"
fi

echo "==> push main + tag su origin"
git push origin main
git push origin "$tag_name"

echo
echo "Merge completato: $current_branch -> main"
echo "Rollback disponibile con: git reset --hard $tag_name"
