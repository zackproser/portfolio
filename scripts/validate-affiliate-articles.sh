#!/bin/bash
# Validate affiliate articles before pushing
# Usage: ./scripts/validate-affiliate-articles.sh [branch]
# Checks articles changed vs main for common issues

set -e

BRANCH="${1:-HEAD}"
ERRORS=0

echo "🔍 Validating affiliate articles on $BRANCH..."

# Get changed MDX files
CHANGED=$(git diff $BRANCH --name-only | grep "page.mdx" || true)

if [ -z "$CHANGED" ]; then
  echo "No changed MDX files found."
  exit 0
fi

for f in $CHANGED; do
  echo ""
  echo "📄 $f"
  FILE_ERRORS=0
  
  # Check: no VoiceAIDemoCard imported from StickyAffiliateCTA
  if grep -q "VoiceAIDemoCard.*from.*StickyAffiliateCTA" "$f" 2>/dev/null; then
    echo "  ❌ VoiceAIDemoCard imported from wrong module (should be @/components/VoiceAIDemoCard)"
    ERRORS=$((ERRORS + 1))
    FILE_ERRORS=$((FILE_ERRORS + 1))
  fi
  
  # Check: campaign tracking exists
  if ! grep -q "export const campaign" "$f" 2>/dev/null; then
    echo "  ❌ Missing 'export const campaign' declaration"
    ERRORS=$((ERRORS + 1))
    FILE_ERRORS=$((FILE_ERRORS + 1))
  fi
  
  # Check: campaign prop on affiliate components
  if grep -q "InlineAffiliateCTA\|AffiliateLink" "$f" 2>/dev/null; then
    if grep "InlineAffiliateCTA\|AffiliateLink" "$f" | grep -v "campaign=" | grep -q "product="; then
      echo "  ❌ Affiliate components missing campaign={campaign} prop"
      ERRORS=$((ERRORS + 1))
      FILE_ERRORS=$((FILE_ERRORS + 1))
    fi
  fi
  
  # Check: corresponding metadata.json has hiddenFromIndex: true
  META=$(echo "$f" | sed 's/page.mdx/metadata.json/')
  if [ -f "$META" ]; then
    if grep -q '"hiddenFromIndex": false' "$META"; then
      echo "  ❌ hiddenFromIndex is false (should be true for affiliate content)"
      ERRORS=$((ERRORS + 1))
      FILE_ERRORS=$((FILE_ERRORS + 1))
    fi
  fi
  
  if [ $FILE_ERRORS -eq 0 ]; then
    echo "  ✅ Passed checks"
  fi
done

echo ""
if [ $ERRORS -gt 0 ]; then
  echo "❌ $ERRORS validation errors found. Fix before pushing."
  exit 1
else
  echo "✅ All affiliate article validations passed."
fi
