#!/bin/bash
# Validates ALL affiliate articles:
# 1. hiddenFromIndex: true in metadata.json
# 2. Hero image URL is valid HTTPS
# 3. Hero image URL actually resolves (HTTP 200)
#
# Scans the ENTIRE repo, not just new files.

set -euo pipefail

ERRORS=0
CHECKED=0
CHECK_HTTP="${CHECK_HTTP:-1}"  # set CHECK_HTTP=0 to skip HTTP checks (offline/fast mode)

for mdx in src/content/blog/*/page.mdx; do
  [ -f "$mdx" ] || continue
  dir=$(dirname "$mdx")
  meta="$dir/metadata.json"
  [ -f "$meta" ] || continue

  if grep -Eql "AffiliateLink|InlineAffiliateCTA" "$mdx" 2>/dev/null; then
    CHECKED=$((CHECKED + 1))
    slug=$(basename "$dir")
    hidden=$(python3 -c "import json; d=json.load(open('$meta')); print(d.get('hiddenFromIndex', 'MISSING'))")
    image=$(python3 -c "import json; d=json.load(open('$meta')); print(d.get('image', ''))")

    if [ "$hidden" != "True" ]; then
      echo "❌ MISSING hiddenFromIndex: $slug (got: $hidden)"
      ERRORS=$((ERRORS + 1))
    fi

    if [ -z "$image" ] || ! echo "$image" | grep -q '^https://'; then
      echo "❌ BAD hero image URL: $slug (got: '$image')"
      ERRORS=$((ERRORS + 1))
    elif [ "$CHECK_HTTP" = "1" ]; then
      code=$(curl -sI -o /dev/null -w "%{http_code}" --max-time 5 "$image" 2>/dev/null || echo "000")
      if [ "$code" != "200" ]; then
        echo "❌ BROKEN hero image (HTTP $code): $slug -> $image"
        ERRORS=$((ERRORS + 1))
      fi
    fi
  fi
done

echo ""
echo "Checked $CHECKED affiliate articles."

if [ $ERRORS -gt 0 ]; then
  echo "⚠️  $ERRORS errors found. Fix before pushing."
  exit 1
else
  echo "✅ All affiliate articles valid (hiddenFromIndex + hero images resolve)"
  exit 0
fi
