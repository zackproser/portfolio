#!/bin/bash
# Validates affiliate articles that should be hidden have hiddenFromIndex: true
# Only checks NEW files (not in main) to avoid flagging intentionally visible articles

ERRORS=0

# Get files changed vs main
CHANGED=$(git diff --name-only origin/main -- 'src/content/blog/*/metadata.json' 2>/dev/null)

if [ -z "$CHANGED" ]; then
  echo "No new metadata.json files vs origin/main. Nothing to check."
  exit 0
fi

for f in $CHANGED; do
  if [ ! -f "$f" ]; then continue; fi
  hidden=$(python3 -c "import json; d=json.load(open('$f')); print(d.get('hiddenFromIndex', 'MISSING'))")
  if [ "$hidden" != "True" ]; then
    dir=$(dirname "$f")
    if grep -ql "AffiliateLink\|InlineAffiliateCTA" "$dir/page.mdx" 2>/dev/null; then
      echo "❌ MISSING hiddenFromIndex: $f"
      ERRORS=$((ERRORS + 1))
    fi
  fi
done

if [ $ERRORS -gt 0 ]; then
  echo ""
  echo "⚠️  $ERRORS NEW affiliate articles missing hiddenFromIndex: true"
  echo "Add hiddenFromIndex: true to metadata.json or these will show in the blog index."
  exit 1
else
  echo "✅ All new affiliate articles have hiddenFromIndex set"
fi
