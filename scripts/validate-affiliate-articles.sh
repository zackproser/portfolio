#!/bin/bash
# Validates ALL affiliate articles have hiddenFromIndex: true
# Scans the ENTIRE repo, not just new files — catches drift from edits too.
# Also creates a pre-commit-usable exit code.

set -euo pipefail

ERRORS=0
CHECKED=0

for mdx in src/content/blog/*/page.mdx; do
  [ -f "$mdx" ] || continue
  dir=$(dirname "$mdx")
  meta="$dir/metadata.json"
  [ -f "$meta" ] || continue

  # Check if this article has affiliate components
  if grep -Eql "AffiliateLink|InlineAffiliateCTA|VoiceAIDemoCard" "$mdx" 2>/dev/null; then
    CHECKED=$((CHECKED + 1))
    hidden=$(python3 -c "import json; d=json.load(open('$meta')); print(d.get('hiddenFromIndex', 'MISSING'))")
    image=$(python3 -c "import json; d=json.load(open('$meta')); print(d.get('image', ''))")

    if [ "$hidden" != "True" ]; then
      echo "❌ MISSING hiddenFromIndex: $meta (got: $hidden)"
      ERRORS=$((ERRORS + 1))
    fi

    if [ -z "$image" ] || ! echo "$image" | grep -q '^https://'; then
      echo "❌ BROKEN hero image: $meta (got: '$image')"
      ERRORS=$((ERRORS + 1))
    fi
  fi
done

echo ""
echo "Checked $CHECKED affiliate articles."

if [ $ERRORS -gt 0 ]; then
  echo "⚠️  $ERRORS errors found. Fix before pushing."
  exit 1
else
  echo "✅ All affiliate articles valid (hiddenFromIndex + hero image)"
  exit 0
fi
