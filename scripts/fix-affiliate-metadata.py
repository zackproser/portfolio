#!/usr/bin/env python3
"""
Auto-fix affiliate articles: ensure hiddenFromIndex: true in metadata.json
for any article containing affiliate components.

Run AFTER generating content, BEFORE committing.
"""
import json, os, glob, sys

EDITORIAL_EXCLUSIONS = {
    'claude-cowork-workshop-anthropic',
    '2025-ai-engineer-setup',
    '2026-ai-engineer-setup',
}

fixed = 0
for mdx_path in sorted(glob.glob('src/content/blog/*/page.mdx')):
    meta_path = os.path.join(os.path.dirname(mdx_path), 'metadata.json')
    if not os.path.exists(meta_path):
        continue

    article_slug = os.path.basename(os.path.dirname(mdx_path))
    if article_slug in EDITORIAL_EXCLUSIONS:
        continue

    with open(mdx_path) as f:
        content = f.read()

    is_affiliate = any(k in content for k in ('AffiliateLink', 'InlineAffiliateCTA'))
    if not is_affiliate:
        continue

    with open(meta_path) as f:
        meta = json.load(f)

    if meta.get('hiddenFromIndex') is not True:
        meta['hiddenFromIndex'] = True
        with open(meta_path, 'w') as f:
            json.dump(meta, f, indent=2, ensure_ascii=False)
            f.write('\n')
        print(f'Fixed: {os.path.dirname(mdx_path)}')
        fixed += 1

if fixed:
    print(f'\nFixed {fixed} articles.')
else:
    print('All affiliate articles already have hiddenFromIndex: true.')

sys.exit(0)
