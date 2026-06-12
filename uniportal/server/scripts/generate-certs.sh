#!/usr/bin/env bash
# Genera la coppia di chiavi autofirmate del Service Provider (solo sviluppo).
# In produzione usa un certificato emesso/registrato presso la federazione.
set -euo pipefail

CERT_DIR="$(cd "$(dirname "$0")/.." && pwd)/certs"
mkdir -p "$CERT_DIR"

openssl req -x509 -newkey rsa:2048 -sha256 -days 1095 -nodes \
  -keyout "$CERT_DIR/sp-private-key.pem" \
  -out "$CERT_DIR/sp-public-cert.pem" \
  -subj "/CN=UniPortal SP/O=UniPortal/OU=SAML SP/C=IT"

chmod 600 "$CERT_DIR/sp-private-key.pem"

echo "✓ Chiavi SP generate in $CERT_DIR"
echo "  - sp-private-key.pem (privata, NON committare)"
echo "  - sp-public-cert.pem (pubblica, finisce nel metadata)"
echo
echo "Manca ancora il certificato di firma dell'IdP:"
echo "  scaricalo dal metadata di Tor Vergata e salvalo come $CERT_DIR/idp-cert.pem"
