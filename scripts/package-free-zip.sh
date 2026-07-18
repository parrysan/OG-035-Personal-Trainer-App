#!/usr/bin/env bash
# package-free-zip.sh — build the FREE offline tier and package it as a
# distributable ZIP (the Helium-10 acquisition asset per the Gemini PRD).
#
# The free build is the same static export as the cloud build, but with no
# cloud env vars present — so useProvider() falls back to LocalProvider
# (localStorage, 3-client cap, text-only exercises, teaser gates active).
#
# Usage:  ./scripts/package-free-zip.sh
# Output: dist/og-035-free.zip  (unpack anywhere, serve statically, works offline)

set -euo pipefail
cd "$(dirname "$0")/.."

DIST_DIR="dist"
ZIP_NAME="og-035-free.zip"

echo "→ Building static export (no cloud env — free tier)..."
env -u SUPABASE_URL -u SUPABASE_PUBLISHABLE_KEY npm run build

echo "→ Packaging ${ZIP_NAME}..."
mkdir -p "$DIST_DIR"
rm -f "$DIST_DIR/$ZIP_NAME"
(cd out && zip -qr "../$DIST_DIR/$ZIP_NAME" .)

echo "✓ $DIST_DIR/$ZIP_NAME"
echo "  Test locally:  unzip -q $DIST_DIR/$ZIP_NAME -d /tmp/og035-free && python3 -m http.server 8080 -d /tmp/og035-free"
