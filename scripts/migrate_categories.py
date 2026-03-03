# ABOUTME: Bulk migrates blog posts from tags to categories
# ABOUTME: Uses keyword matching and flags ambiguous posts for review

import os
import re
import yaml
from pathlib import Path
from dataclasses import dataclass
from typing import Optional

# Valid categories (from build_archive.py sprite mapping)
VALID_CATEGORIES = {
    'health', 'tabletop', 'clowning', 'tech', 'writing',
    'cooking', 'music', 'travel', 'reading', 'personal',
    'crafting', 'gaming', 'pets', 'adhd'
}

# Category priority (more specific > less specific)
# When a post has multiple valid tags, prefer the more specific one
CATEGORY_PRIORITY = [
    'health',      # Medical content is distinct
    'tabletop',    # Blood Bowl, Warhammer, D&D
    'clowning',    # Performance, circus
    'tech',        # Programming, gadgets
    'writing',     # Fiction, NaNoWriMo
    'cooking',     # Food, recipes
    'music',       # Instruments, production
    'travel',      # Trips, places
    'reading',     # Book reviews
    'crafting',    # Bow ties, puppets, sewing
    'gaming',      # Video games
    'pets',        # Cats
    'adhd',        # ADHD specific
    'personal',    # Fallback - general life stuff
]

# Keyword patterns to help categorize posts without matching tags
KEYWORD_PATTERNS = {
    'health': [
        r'\bhospital\b', r'\bsurgery\b', r'\bdoctor\b', r'\bpain\b',
        r'\bchronic\b', r'\bmedic', r'\bhealth\b', r'\binjury\b',
        r'\brecovery\b', r'\bankle\b', r'\bfoot\b', r'\bleg\b',
    ],
    'tabletop': [
        r'\bblood bowl\b', r'\bwarhammer\b', r'\bd&d\b', r'\bdungeon',
        r'\bminiature', r'\bhalfling', r'\bgames workshop\b', r'\bdice\b',
        r'\brpg\b', r'\btabletop\b',
    ],
    'clowning': [
        r'\bjuggl', r'\bclown', r'\bcircus\b', r'\bballoon', r'\bmagic\b',
        r'\bperform', r'\bshow\b', r'\bact\b', r'\bstage\b',
    ],
    'tech': [
        r'\bcode\b', r'\bprogram', r'\bjavascript\b', r'\bpython\b',
        r'\bblog.*update\b', r'\bwebsite\b', r'\bgithub\b', r'\bapp\b',
        r'\bgadget\b', r'\bphone\b', r'\bcomputer\b',
    ],
    'writing': [
        r'\bnanowrimo\b', r'\bnovel\b', r'\bfiction\b', r'\bstory\b',
        r'\bwriting\b', r'\bauthor\b', r'\bmanuscript\b', r'\bdraft\b',
    ],
    'cooking': [
        r'\brecipe\b', r'\bcook', r'\bfood\b', r'\beat\b', r'\bmeal\b',
        r'\bkitchen\b', r'\bbak', r'\bdinner\b',
    ],
    'music': [
        r'\bukulele\b', r'\bbanjo\b', r'\bsynth', r'\bmusic\b',
        r'\bguitar\b', r'\bsong\b', r'\bplay.*instrument',
    ],
    'travel': [
        r'\btrip\b', r'\btravel', r'\bvacation\b', r'\bflight\b',
        r'\bhotel\b', r'\bvisit', r'\btourist\b',
    ],
    'reading': [
        r'\bbook\b', r'\bread\b', r'\breview\b', r'\bnovel\b',
        r'\bauthor\b', r'\bfinished reading\b', r'\bcomic\b',
    ],
    'crafting': [
        r'\bbow tie\b', r'\bbowtie\b', r'\bsew', r'\bfabric\b',
        r'\bpuppet\b', r'\bcraft', r'\bmake\b', r'\bhandmade\b',
    ],
    'gaming': [
        r'\bvideo game\b', r'\bminecraft\b', r'\bxbox\b', r'\bplaystation\b',
        r'\bnintendo\b', r'\bgaming\b', r'\bsteam\b',
    ],
    'pets': [
        r'\bcat\b', r'\bramona\b', r'\bjeff\b', r'\bkitty\b', r'\bfeline\b',
        r'\breno\b',  # Previous cat
    ],
    'adhd': [
        r'\badhd\b', r'\battention\b', r'\bfocus\b', r'\bhyperfocus\b',
    ],
}


@dataclass
class PostResult:
    filepath: Path
    original_tags: list
    new_category: Optional[str]
    confidence: str  # 'high', 'medium', 'low', 'none'
    reason: str


def extract_frontmatter(content: str) -> tuple[dict, str, str]:
    """Extract YAML frontmatter from markdown content.
    Returns (frontmatter_dict, frontmatter_raw, body)
    """
    if not content.startswith('---'):
        return {}, '', content

    parts = content.split('---', 2)
    if len(parts) < 3:
        return {}, '', content

    frontmatter_raw = parts[1]
    body = '---'.join(parts[2:])

    try:
        frontmatter = yaml.safe_load(frontmatter_raw) or {}
    except yaml.YAMLError:
        frontmatter = {}

    return frontmatter, frontmatter_raw, body


def categorize_post(filepath: Path, frontmatter: dict, body: str) -> PostResult:
    """Determine the best category for a post."""
    original_tags = frontmatter.get('tags', []) or []
    if isinstance(original_tags, str):
        original_tags = [original_tags]

    # Filter out non-string tags (e.g., id: X dicts from old imports)
    original_tags = [t for t in original_tags if isinstance(t, str)]

    # Already has categories? Keep it
    if 'categories' in frontmatter:
        cats = frontmatter['categories']
        if isinstance(cats, str):
            cats = [cats]
        if cats and cats[0] in VALID_CATEGORIES:
            return PostResult(
                filepath=filepath,
                original_tags=original_tags,
                new_category=cats[0],
                confidence='high',
                reason='Already has valid category'
            )

    # Filter to valid tags only
    valid_tags = [t for t in original_tags if t in VALID_CATEGORIES]

    # Single valid tag? Easy choice
    if len(valid_tags) == 1:
        return PostResult(
            filepath=filepath,
            original_tags=original_tags,
            new_category=valid_tags[0],
            confidence='high',
            reason='Single valid tag'
        )

    # Multiple valid tags? Pick by priority
    if len(valid_tags) > 1:
        for cat in CATEGORY_PRIORITY:
            if cat in valid_tags:
                return PostResult(
                    filepath=filepath,
                    original_tags=original_tags,
                    new_category=cat,
                    confidence='medium',
                    reason=f'Multiple tags ({valid_tags}), picked by priority'
                )

    # No valid tags - try keyword matching
    title = frontmatter.get('title', '')
    text_to_search = f"{title}\n{body}".lower()

    keyword_matches = {}
    for cat, patterns in KEYWORD_PATTERNS.items():
        count = 0
        for pattern in patterns:
            if re.search(pattern, text_to_search, re.IGNORECASE):
                count += 1
        if count > 0:
            keyword_matches[cat] = count

    if keyword_matches:
        # Sort by match count, then by priority
        best_cat = max(keyword_matches.keys(),
                      key=lambda c: (keyword_matches[c], -CATEGORY_PRIORITY.index(c)))
        match_count = keyword_matches[best_cat]

        if match_count >= 2:
            return PostResult(
                filepath=filepath,
                original_tags=original_tags,
                new_category=best_cat,
                confidence='medium',
                reason=f'Keyword match ({match_count} patterns for {best_cat})'
            )
        else:
            return PostResult(
                filepath=filepath,
                original_tags=original_tags,
                new_category=best_cat,
                confidence='low',
                reason=f'Weak keyword match ({match_count} pattern for {best_cat})'
            )

    # Fallback to personal if we have any tags at all
    if original_tags:
        return PostResult(
            filepath=filepath,
            original_tags=original_tags,
            new_category='personal',
            confidence='low',
            reason=f'No valid tags or keywords, defaulting to personal (had: {original_tags})'
        )

    # No tags at all
    return PostResult(
        filepath=filepath,
        original_tags=[],
        new_category=None,
        confidence='none',
        reason='No tags and no keyword matches - needs review'
    )


def update_frontmatter(content: str, new_category: str) -> str:
    """Replace tags with categories in frontmatter."""
    frontmatter, frontmatter_raw, body = extract_frontmatter(content)

    if not frontmatter_raw:
        return content

    # Build new frontmatter
    new_fm = {}
    for key, value in frontmatter.items():
        if key == 'tags':
            continue  # Skip tags, we're replacing with categories
        if key == 'categories':
            continue  # We'll add our own
        new_fm[key] = value

    new_fm['categories'] = [new_category]

    # Serialize
    new_frontmatter_raw = yaml.dump(new_fm, default_flow_style=False, allow_unicode=True, sort_keys=False)

    return f"---\n{new_frontmatter_raw}---{body}"


def process_directory(directory: Path, dry_run: bool = True) -> list[PostResult]:
    """Process all markdown files in a directory."""
    results = []

    # Handle both .md and .markdown extensions
    for filepath in list(directory.glob('*.md')) + list(directory.glob('*.markdown')):
        content = filepath.read_text(encoding='utf-8')
        frontmatter, _, body = extract_frontmatter(content)

        result = categorize_post(filepath, frontmatter, body)
        results.append(result)

        if not dry_run and result.new_category and result.confidence != 'none':
            new_content = update_frontmatter(content, result.new_category)
            filepath.write_text(new_content, encoding='utf-8')

    return results


def main():
    import argparse

    parser = argparse.ArgumentParser(description='Migrate blog tags to categories')
    parser.add_argument('directory', help='Directory containing markdown posts')
    parser.add_argument('--apply', action='store_true', help='Actually apply changes (default is dry run)')
    parser.add_argument('--review-file', default='needs_review.md', help='Output file for posts needing review')
    parser.add_argument('--categories-file', default='categories.md', help='Output file for all post categories')
    args = parser.parse_args()

    directory = Path(args.directory)
    if not directory.exists():
        print(f"Error: Directory {directory} does not exist")
        return 1

    dry_run = not args.apply

    print(f"{'DRY RUN - ' if dry_run else ''}Processing {directory}")
    print("=" * 60)

    results = process_directory(directory, dry_run=dry_run)

    # Group by confidence
    high = [r for r in results if r.confidence == 'high']
    medium = [r for r in results if r.confidence == 'medium']
    low = [r for r in results if r.confidence == 'low']
    none = [r for r in results if r.confidence == 'none']

    print(f"\nResults:")
    print(f"  High confidence:   {len(high)} posts")
    print(f"  Medium confidence: {len(medium)} posts")
    print(f"  Low confidence:    {len(low)} posts (flagged for review)")
    print(f"  No match:          {len(none)} posts (needs manual review)")

    # Write review file for low confidence posts
    needs_review = low + none
    if needs_review:
        review_path = Path(args.review_file)
        with open(review_path, 'w') as f:
            f.write("# Posts Needing Category Review\n\n")
            f.write("These posts had low confidence categorization or no match.\n")
            f.write("Review and update manually.\n\n")

            for r in sorted(needs_review, key=lambda x: x.filepath.name):
                f.write(f"## {r.filepath.name}\n")
                f.write(f"- **Suggested category**: {r.new_category or 'NONE'}\n")
                f.write(f"- **Original tags**: {r.original_tags}\n")
                f.write(f"- **Reason**: {r.reason}\n\n")

        print(f"\nReview file written to: {review_path}")

    # Write full categories list
    categories_path = Path(args.categories_file)
    with open(categories_path, 'w') as f:
        f.write("# Post Categories\n\n")
        f.write("| Title | Category | Confidence |\n")
        f.write("|-------|----------|------------|\n")

        for r in sorted(results, key=lambda x: x.filepath.name):
            # Get title from frontmatter
            content = r.filepath.read_text(encoding='utf-8')
            fm, _, _ = extract_frontmatter(content)
            title = fm.get('title', r.filepath.stem)
            # Escape pipes in title
            title = str(title).replace('|', '\\|')
            category = r.new_category or 'NONE'
            f.write(f"| {title} | {category} | {r.confidence} |\n")

    print(f"Categories file written to: {categories_path}")

    if dry_run:
        print("\nThis was a dry run. Use --apply to make changes.")
    else:
        print(f"\n{len(high) + len(medium)} posts updated.")

    return 0


if __name__ == '__main__':
    exit(main())
