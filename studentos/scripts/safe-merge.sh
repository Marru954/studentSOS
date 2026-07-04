#!/usr/bin/env bash
#
# safe-merge.sh (studentos/) — WRAPPER, non ha logica propria.
#
# Storicamente qui viveva una copia dello script di merge SENZA i muri #4/#5
# (URL/codici EasyAcademy verificati + niente dipendenze npm nuove): un percorso
# che poteva mergiare su main bypassando quei controlli. Ora rilancia sempre lo
# script canonico alla root del repo, così esiste un solo comportamento di merge.
#
# Tutto (env di controllo DRY_RUN/SKIP_GATE/ALLOW_NEW_DEPS/ALLOW_UNVERIFIED_URLS,
# gate, muri, tag di rollback, push) è gestito da <root>/scripts/safe-merge.sh.
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)" || {
  echo "safe-merge: non sono in un repo git." >&2
  exit 1
}

CANONICAL="$ROOT/scripts/safe-merge.sh"
[ -x "$CANONICAL" ] || {
  echo "safe-merge: script canonico non trovato o non eseguibile: $CANONICAL" >&2
  exit 1
}

exec "$CANONICAL" "$@"
