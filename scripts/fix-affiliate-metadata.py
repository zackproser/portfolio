#!/usr/bin/env python3
"""
Fix affiliate article metadata by ensuring hiddenFromIndex: true for all affiliate content
"""

import json
import os
import re
from pathlib import Path

def has_affiliate_content(mdx_file):
    """Check if MDX file contains affiliate components"""
    if not os.path.exists(mdx_file):
        return False
    
    with open(mdx_file, 'r', encoding='utf-8') as f:
        content = f.read()
        return 'InlineAffiliateCTA' in content or 'AffiliateLink' in content

def fix_metadata(metadata_file):
    """Ensure metadata has hiddenFromIndex: true if article has affiliate content"""
    if not os.path.exists(metadata_file):
        return False
    
    # Check corresponding MDX file
    directory = os.path.dirname(metadata_file)
    mdx_file = os.path.join(directory, 'page.mdx')
    
    if not has_affiliate_content(mdx_file):
        return False
    
    # Read and update metadata
    with open(metadata_file, 'r', encoding='utf-8') as f:
        metadata = json.load(f)
    
    # Only hide batch-generated affiliate articles that have keywords arrays (SEO-focused)
    # Skip articles without keywords - these are editorial content with affiliate CTAs added
    if 'keywords' not in metadata or not isinstance(metadata.get('keywords'), list) or len(metadata.get('keywords', [])) == 0:
        return False
    
    changed = False
    if metadata.get('hiddenFromIndex') != True:
        metadata['hiddenFromIndex'] = True
        changed = True
        print(f"✅ Fixed {metadata_file}")
    
    if changed:
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
    
    return changed

def main():
    """Process all blog metadata.json files"""
    blog_dir = Path('src/content/blog')
    if not blog_dir.exists():
        print("❌ Blog directory not found: src/content/blog")
        return
    
    fixed_count = 0
    total_count = 0
    
    for metadata_file in blog_dir.glob('*/metadata.json'):
        total_count += 1
        if fix_metadata(str(metadata_file)):
            fixed_count += 1
    
    print(f"\n📊 Processed {total_count} metadata files")
    if fixed_count > 0:
        print(f"🔧 Fixed {fixed_count} affiliate articles")
    else:
        print("✅ All affiliate articles already have correct metadata")

if __name__ == '__main__':
    main()