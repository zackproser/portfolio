#!/usr/bin/env bash
# scripts/verify-blog-post.sh
#
# Deterministic verification gate for blog posts on zackproser.com.
# Usage:
#   scripts/verify-blog-post.sh <slug> [pr-number]
#
# Exits 0 iff every check passes. The agent (Hermes or Claude) MUST NOT
# report a blog post as "done" until this script exits 0.
#
# Designed to run both on Hermes (Ubuntu EC2) and on Zack's Mac.
# Requires: bash 3.2+, jq, curl, git, python3. gh is optional (only for the
# Vercel preview check when pr-number is supplied).
#
# Checks:
#   1. page.mdx + metadata.json exist
#   2. Image count meets the minimum for the post type
#      (affiliate=1, standard=2, flagship 2000+ words=4; warn at <3 over 1000 words)
#   3. Hero image returns HTTP 200 on Bunny CDN
#   4. Every inline b-cdn.net image returns HTTP 200
#   5. Every src="/images/..." local image exists on disk
#   6. Every /blog/<slug> internal link exists on origin/main
#   7. No banned phrases (Anthropic-LLM tells) in MDX
#   8. OG image exists at https://zackproser.b-cdn.net/images/og-images/<slug>.png
#   9. If pr-number supplied: Vercel preview returns 200 + rendered HTML refs each CDN image

set -o pipefail

SLUG="${1:?usage: verify-blog-post.sh <slug> [pr-number]}"
PR_NUMBER="${2:-}"

BLOG_DIR="src/content/blog/$SLUG"
MDX="$BLOG_DIR/page.mdx"
META="$BLOG_DIR/metadata.json"

if [[ -t 1 ]]; then
  RED=$'\e[31m'; GREEN=$'\e[32m'; YELLOW=$'\e[33m'; RESET=$'\e[0m'
else
  RED=""; GREEN=""; YELLOW=""; RESET=""
fi

FAILURES=()
fail() { FAILURES+=("$1"); printf "%s[FAIL]%s %s\n" "$RED" "$RESET" "$1"; }
pass() { printf "%s[ ok ]%s %s\n" "$GREEN" "$RESET" "$1"; }
warn() { printf "%s[warn]%s %s\n" "$YELLOW" "$RESET" "$1"; }
sec()  { printf "\n%s== %s ==%s\n" "$YELLOW" "$1" "$RESET"; }

echo "=== verify-blog-post.sh ==="
echo "slug: $SLUG"
[[ -n "$PR_NUMBER" ]] && echo "pr:   #$PR_NUMBER"

# 1. Files present
sec "files"
if [[ ! -f "$MDX" ]]; then
  fail "MDX missing: $MDX"
  printf "\n%s=== BAILING — post does not exist on disk ===%s\n" "$RED" "$RESET"
  exit 1
fi
pass "MDX present: $MDX"
if [[ ! -f "$META" ]]; then
  fail "metadata.json missing: $META"
else
  pass "metadata.json present"
fi

# 2. Image count
sec "image count"
IS_AFFILIATE=0
if grep -qE 'AffiliateLink|InlineAffiliateCTA|VoiceAIDemoCard' "$MDX"; then
  IS_AFFILIATE=1
fi
# Count only prose: strip imports, exports, code blocks, JSX tags
WORD_COUNT=$(sed -e '/^import /d' \
                 -e '/^export /d' \
                 -e '/^```/,/^```/d' \
                 -e 's/<[^>]*>//g' \
                 "$MDX" | wc -w | tr -d ' ')
IMG_COUNT=$(grep -oE '<Image([[:space:]]|$)|!\[[^]]*\]\(' "$MDX" 2>/dev/null | wc -l | tr -d ' ')
# Interactive widgets (three.js scenes, simulators) count toward the post-type
# minimum since they carry the visual weight in interactive/demo-poem posts.
# Matches components named *Wrapper plus a handful of known interactive
# components used directly without a Wrapper suffix.
WIDGET_COUNT=$(grep -oE '<[A-Z][A-Za-z0-9_]*(Wrapper|3D|Simulator|Scene|DemoCard)[[:space:]/>]' "$MDX" 2>/dev/null | wc -l | tr -d ' ')
EFFECTIVE_COUNT=$((IMG_COUNT + WIDGET_COUNT))

if [[ "$IS_AFFILIATE" -eq 1 ]]; then
  MIN_IMG=1
  TYPE="affiliate"
elif [[ "$WORD_COUNT" -gt 2000 ]]; then
  MIN_IMG=4
  TYPE="flagship (${WORD_COUNT}w)"
else
  MIN_IMG=2
  TYPE="standard (${WORD_COUNT}w)"
fi

if [[ "$EFFECTIVE_COUNT" -lt "$MIN_IMG" ]]; then
  fail "Effective visual count $EFFECTIVE_COUNT (images=$IMG_COUNT + interactive widgets=$WIDGET_COUNT) < min $MIN_IMG for $TYPE post"
else
  pass "Effective visual count $EFFECTIVE_COUNT (images=$IMG_COUNT + interactive widgets=$WIDGET_COUNT) meets min $MIN_IMG for $TYPE post"
fi

if [[ "$IS_AFFILIATE" -eq 0 && "$WORD_COUNT" -gt 1000 && "$EFFECTIVE_COUNT" -lt 3 ]]; then
  warn "Standard post >1000 words with only $EFFECTIVE_COUNT visual(s) — consider 1-2 more inline images or widgets"
fi

# 3. Hero image returns 200
sec "hero image"
if [[ -f "$META" ]]; then
  HERO=$(jq -r '.image // empty' "$META")
  if [[ -z "$HERO" ]]; then
    fail "metadata.json missing 'image' field"
  else
    CODE=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "$HERO" 2>/dev/null)
    if [[ "$CODE" == "200" ]]; then
      pass "Hero image: $HERO"
    else
      fail "Hero image HTTP $CODE: $HERO"
    fi
  fi
fi

# 4. All b-cdn.net image URLs in MDX return 200
sec "cdn images in mdx"
CDN_URLS=()
while IFS= read -r line; do
  [[ -n "$line" ]] && CDN_URLS+=("$line")
done < <(sed -e '/^```/,/^```/d' "$MDX" | grep -oE 'https://zackproser\.b-cdn\.net/[^")[:space:]]+\.(webp|png|jpg|jpeg|gif)' 2>/dev/null | sort -u)
if [[ ${#CDN_URLS[@]} -eq 0 ]]; then
  warn "No b-cdn.net image URLs found in MDX (post may rely entirely on /images/ local refs)"
else
  for URL in "${CDN_URLS[@]}"; do
    CODE=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "$URL" 2>/dev/null)
    if [[ "$CODE" == "200" ]]; then
      pass "CDN: $URL"
    else
      fail "CDN HTTP $CODE: $URL"
    fi
  done
fi

# 5. Local image refs exist on disk
sec "local image refs"
LOCAL_IMGS=()
while IFS= read -r line; do
  [[ -n "$line" ]] && LOCAL_IMGS+=("$line")
done < <(sed -e '/^```/,/^```/d' "$MDX" | grep -oE 'src="/images/[^"]+' 2>/dev/null | sed 's|src="||' | sort -u)
if [[ ${#LOCAL_IMGS[@]} -gt 0 ]]; then
  for IMG in "${LOCAL_IMGS[@]}"; do
    if [[ -f "public${IMG}" ]]; then
      pass "Local image: ${IMG}"
    else
      fail "Local image missing on disk: public${IMG}"
    fi
  done
else
  warn "No /images/ local refs (this is normal for fully-CDN posts)"
fi

# 6. Internal /blog/<slug> links exist on origin/main
sec "internal links"
git fetch origin main --quiet 2>/dev/null || warn "git fetch failed — internal link check may be stale"
LINKS=()
while IFS= read -r line; do
  [[ -n "$line" ]] && LINKS+=("$line")
done < <(sed -e '/^```/,/^```/d' "$MDX" | grep -oE '/blog/[a-z0-9-]+' 2>/dev/null | sed 's|/blog/||' | sort -u)
if [[ ${#LINKS[@]} -gt 0 ]]; then
  for L in "${LINKS[@]}"; do
    [[ "$L" == "$SLUG" ]] && continue
    if git ls-tree origin/main --name-only "src/content/blog/$L" 2>/dev/null | grep -q .; then
      pass "Internal link: /blog/$L"
    else
      fail "Internal link not on origin/main: /blog/$L"
    fi
  done
else
  pass "No internal /blog/ links to verify"
fi

# 7. Banned phrases (Anthropic LLM tells)
sec "banned phrases"
BANNED_RE='not just [^,]+, it.?s|isn.?t just [^,]+, it.?s|doesn.?t just [^—]+—|This isn.?t .+[—].*it.?s|What I didn.?t expect|Here.?s what surprised me|\bdelve\b|\bharness\b|\bleverage\b|game-?changer|level up|deep dive|seamless|robust|paradigm shift|transformative|revolutionary|unprecedented|holistic\b|synergy|actionable insights|thought leadership|furthermore|moreover|\bcrucially\b|\bnotably\b|tapestry|\bmyriad\b|plethora|at the end of the day|in conclusion'
HITS=$(sed -e '/^```/,/^```/d' "$MDX" | grep -inE "$BANNED_RE" 2>/dev/null || true)
if [[ -z "$HITS" ]]; then
  pass "No banned phrases"
else
  fail "Banned phrases found (rewrite directly without contrastive setup):"
  echo "$HITS" | sed 's/^/    /'
fi

# 8. OG image on CDN
sec "og image"
OG_URL="https://zackproser.b-cdn.net/images/og-images/$SLUG.png"
CODE=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "$OG_URL" 2>/dev/null)
if [[ "$CODE" == "200" ]]; then
  pass "OG image: $OG_URL"
else
  fail "OG image not on CDN (HTTP $CODE): $OG_URL"
  echo "    Fix: npm run og:generate-for -- --slug $SLUG --overwrite"
  echo "         then upload public/og-images/$SLUG.png to Bunny CDN at /images/og-images/$SLUG.png"
fi

# 9. Vercel preview (only if pr-number supplied)
if [[ -n "$PR_NUMBER" ]]; then
  sec "vercel preview"
  if ! command -v gh >/dev/null 2>&1; then
    warn "gh CLI not available — skipping preview check"
  else
    PREVIEW=$(gh pr view "$PR_NUMBER" --json comments --jq '.comments[].body' 2>/dev/null \
      | grep -oE 'https://portfolio[^ "<)]*\.vercel\.app' | head -1 || true)
    if [[ -z "$PREVIEW" ]]; then
      warn "No Vercel preview URL in PR #$PR_NUMBER comments yet (still deploying?). Re-run when the preview comment appears."
    else
      POST_URL="${PREVIEW%/}/blog/$SLUG"
      CODE=$(curl -sS -L -o /dev/null -w '%{http_code}' --max-time 30 "$POST_URL" 2>/dev/null || echo "000")
      if [[ "$CODE" != "200" ]]; then
        fail "Vercel preview HTTP $CODE: $POST_URL"
      else
        pass "Vercel preview renders: $POST_URL"
        HTML=$(curl -sS -L --max-time 30 "$POST_URL" 2>/dev/null || true)
        if [[ ${#CDN_URLS[@]} -gt 0 ]]; then
          for URL in "${CDN_URLS[@]}"; do
            if echo "$HTML" | grep -qF "$URL"; then
              pass "Preview HTML refs (raw): $(basename "$URL")"
            else
              ENC=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1], safe=''))" "$URL" 2>/dev/null || echo "")
              if [[ -n "$ENC" ]] && echo "$HTML" | grep -qF "$ENC"; then
                pass "Preview HTML refs (encoded): $(basename "$URL")"
              else
                fail "Preview HTML missing reference to: $URL"
              fi
            fi
          done
        fi
      fi
    fi
  fi
fi

echo ""
if [[ ${#FAILURES[@]} -eq 0 ]]; then
  printf "%s=== ALL CHECKS PASSED. Safe to report done. ===%s\n" "$GREEN" "$RESET"
  exit 0
else
  printf "%s=== %d FAILURE(S). DO NOT report done. ===%s\n" "$RED" "${#FAILURES[@]}" "$RESET"
  for F in "${FAILURES[@]}"; do
    printf "%s - %s%s\n" "$RED" "$F" "$RESET"
  done
  exit 1
fi
