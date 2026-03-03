#!/usr/bin/env python3
import os, re, glob
from datetime import datetime

# Sprite pairs for each tag (alternates between the two)
# Format: tag -> [(sprite_class, sprite_file), (sprite_class, sprite_file)]
SPRITE_PAIRS = {
    'health': [('cat', 'Cat - Health.png'), ('skele', 'Skele - Health.png')],
    'tabletop': [('dragon', 'Dragon - Tabletop.png'), ('knight', 'knight - tabletop.png')],
    'clowning': [('clown', 'clown - clown.png'), ('balloon', 'balloon dog - clown.png')],
    'tech': [('golem', 'golem - tech.png'), ('wizard', 'wizard-tech.png')],
    'writing': [('quill', 'quill - Writing.png'), ('muse', 'Muse - Writing.png')],
    'cooking': [('imp', 'imp - cooking.png'), ('cauldron', 'cauldren - cooking.png')],
    'music': [('bard', 'bard - music.png'), ('banjo', 'banjo - music.png')],
    'travel': [('adventure', 'Adventure - Travel.png'), ('donkey', 'Donkey - Travel.png')],
    'reading': [('book', 'book-reading.png'), ('quill', 'quill - Writing.png')],
    'personal': [('clem', 'clem-personal.png')],
    'crafting': [('muse', 'Muse - Writing.png'), ('quill', 'quill - Writing.png')],
    'gaming': [('knight', 'knight - tabletop.png'), ('dragon', 'Dragon - Tabletop.png')],
    'pets': [('cat', 'Cat - Health.png')],
    'adhd': [('adventure', 'Adventure - Travel.png'), ('donkey', 'Donkey - Travel.png')],
}

# Track alternation index per tag
tag_counters = {}

def get_sprite_info(tag):
    """Get the next sprite for this tag, alternating between options."""
    if tag not in SPRITE_PAIRS or not SPRITE_PAIRS[tag]:
        return None, None

    if tag not in tag_counters:
        tag_counters[tag] = 0

    sprites = SPRITE_PAIRS[tag]
    idx = tag_counters[tag] % len(sprites)
    tag_counters[tag] += 1

    return sprites[idx]

def extract_frontmatter(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    date_match = re.match(r'(\d{4}-\d{2}-\d{2})', os.path.basename(filepath))
    date = date_match.group(1) if date_match else ''

    title_match = re.search(r'^title:\s*["\']?(.+?)["\']?\s*$', content, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else 'Untitled'
    title = title.replace('"', '').replace("'", "")
    title = title.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

    tags_match = re.search(r'^tags:\s*\n((?:- .+\n?)+)', content, re.MULTILINE)
    if tags_match:
        first_tag = re.search(r'^- (.+)', tags_match.group(1), re.MULTILINE)
        tag = first_tag.group(1).strip().lower() if first_tag else 'personal'
    else:
        tag = 'personal'

    return date, title, tag

def format_date(date_str):
    try:
        dt = datetime.strptime(date_str, '%Y-%m-%d')
        return dt.strftime('%b %d')
    except:
        return date_str

os.chdir('/Users/nervous/Dropbox/Github/dylan.blog/posts')

html_sections = []

# Sample 2025 and 2024 posts (mockup data)
sample_2025 = """                <!-- 2025 -->
                <section class="year-section">
                    <h2 class="year-header">2025</h2>
                    <ul class="archive-list">
                        <li class="archive-entry tag-health">
                            <div class="archive-sprite sprite-cat">
                                <img src="sprites/Cat - Health.png" alt="" />
                            </div>
                            <span class="archive-date">Nov 11</span>
                            <a href="#" class="archive-title">My Dang Ol' Derelict Ankle</a>
                            <span class="archive-tag">health</span>
                        </li>
                        <li class="archive-entry tag-personal">
                            <div class="archive-sprite sprite-clem">
                                <img src="sprites/clem-personal.png" alt="" />
                            </div>
                            <span class="archive-date">Sep 13</span>
                            <a href="#" class="archive-title">Are s'mores paninis? Discuss</a>
                            <span class="archive-tag">personal</span>
                        </li>
                        <li class="archive-entry tag-reading">
                            <div class="archive-sprite sprite-book">
                                <img src="sprites/book-reading.png" alt="" />
                            </div>
                            <span class="archive-date">Sep 01</span>
                            <a href="#" class="archive-title">you should be reading a book instead</a>
                            <span class="archive-tag">reading</span>
                        </li>
                    </ul>
                </section>"""

sample_2024 = """                <!-- 2024 -->
                <section class="year-section">
                    <h2 class="year-header">2024</h2>
                    <ul class="archive-list">
                        <li class="archive-entry tag-tabletop">
                            <div class="archive-sprite sprite-dragon">
                                <img src="sprites/Dragon - Tabletop.png" alt="" />
                            </div>
                            <span class="archive-date">Dec 12</span>
                            <a href="#" class="archive-title">Our D&amp;D Campaign Finally Has a Dragon</a>
                            <span class="archive-tag">tabletop</span>
                        </li>
                        <li class="archive-entry tag-clowning">
                            <div class="archive-sprite sprite-clown">
                                <img src="sprites/clown - clown.png" alt="" />
                            </div>
                            <span class="archive-date">Dec 08</span>
                            <a href="#" class="archive-title">Learning to Juggle Fire (Badly)</a>
                            <span class="archive-tag">clowning</span>
                        </li>
                        <li class="archive-entry tag-tech">
                            <div class="archive-sprite sprite-golem">
                                <img src="sprites/golem - tech.png" alt="" />
                            </div>
                            <span class="archive-date">Dec 05</span>
                            <a href="#" class="archive-title">Why I Rewrote My Blog in Rust (Again)</a>
                            <span class="archive-tag">tech</span>
                        </li>
                    </ul>
                </section>"""

html_sections.append(sample_2025)
html_sections.append(sample_2024)

# Generate real data for 2019-2002
for year in range(2019, 2001, -1):
    posts = glob.glob(f'{year}-*.md') + glob.glob(f'{year}-*.markdown')
    posts.sort(reverse=True)

    if not posts:
        continue

    entries = []
    for p in posts:
        date, title, tag = extract_frontmatter(p)
        formatted_date = format_date(date)
        sprite_info = get_sprite_info(tag)

        if sprite_info[0] is not None:
            # Has sprite
            sprite_class, sprite_file = sprite_info
            entry = f'''                        <li class="archive-entry tag-{tag}">
                            <div class="archive-sprite sprite-{sprite_class}">
                                <img src="sprites/{sprite_file}" alt="" />
                            </div>
                            <span class="archive-date">{formatted_date}</span>
                            <a href="#" class="archive-title">{title}</a>
                            <span class="archive-tag">{tag}</span>
                        </li>'''
        else:
            # No sprite (personal)
            entry = f'''                        <li class="archive-entry tag-{tag}">
                            <span class="archive-date">{formatted_date}</span>
                            <a href="#" class="archive-title">{title}</a>
                            <span class="archive-tag">{tag}</span>
                        </li>'''
        entries.append(entry)

    section = f'''                <!-- {year} -->
                <section class="year-section">
                    <h2 class="year-header">{year}</h2>
                    <ul class="archive-list">
{chr(10).join(entries)}
                    </ul>
                </section>'''

    html_sections.append(section)

# Read the template and extract header/footer
with open('/Users/nervous/Dropbox/Github/dylan.blog/public/archive-mockup.html', 'r') as f:
    template = f.read()

# Split at the archive-container div
parts = template.split('<div class="archive-container">')
if len(parts) != 2:
    print("ERROR: Could not find archive-container")
    exit(1)

header = parts[0] + '<div class="archive-container">\n'

# Find the closing for archive-container
rest = parts[1]
footer_start = rest.find('</div>\n        </main>')
if footer_start == -1:
    footer_start = rest.find('</div>\n            </main>')
if footer_start == -1:
    print("ERROR: Could not find end of archive-container")
    exit(1)

footer = rest[footer_start:]

# Combine everything
full_html = header + '\n'.join(html_sections) + '\n            ' + footer

# Write the output
with open('/Users/nervous/Dropbox/Github/dylan.blog/public/archive-mockup.html', 'w') as f:
    f.write(full_html)

print(f"Generated archive with {len(html_sections)} year sections")
print("Sprites alternate between pairs for each tag")
print("Personal entries have no sprite")
