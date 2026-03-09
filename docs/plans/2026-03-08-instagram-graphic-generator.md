# Instagram Graphic Generator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Generate 1080x1080 Instagram share images that match the blog's pixel art aesthetic, using post title and category.

**Architecture:** An HTML template styled with the blog's fonts and assets, rendered to PNG via Puppeteer. A CLI script takes `--title` and `--category` flags, injects them into the template, screenshots it, and saves the output. The blog-writing skill is updated to include caption/hashtag generation as a final step.

**Tech Stack:** Node.js, Puppeteer, HTML/CSS template, Google Fonts (MedievalSharp, Uncial Antiqua)

---

### Task 1: Initialize Node.js Project

**Files:**
- Create: `package.json`
- Create: `.gitignore` update (add `node_modules/`, `output/`)

**Step 1: Init package.json**

Run:
```bash
cd /Users/nervous/Dev/dylan.blog
npm init -y
```

**Step 2: Install Puppeteer**

Run:
```bash
npm install puppeteer
```

**Step 3: Update .gitignore**

Add these lines to `.gitignore`:
```
node_modules/
output/
```

**Step 4: Create output directory**

Run:
```bash
mkdir -p output
```

**Step 5: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "feat: add Node.js setup for Instagram graphic generator"
```

---

### Task 2: Create the HTML Template

**Files:**
- Create: `scripts/instagram-template.html`

**Step 1: Create the HTML template**

This is the core visual design. The template:
- Loads MedievalSharp and Uncial Antiqua from Google Fonts
- Has a 1080x1080 container
- Background: category header image, scaled to cover
- Dark overlay: `rgba(0, 0, 0, 0.55)` for text legibility
- Title: MedievalSharp, white, centered, with text-shadow
- Category sprite: 96px in bottom-left corner
- Branding: "dylan's blog" in Uncial Antiqua at bottom center
- Accent: category glow color as a 4px top border

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=MedievalSharp&family=Uncial+Antiqua&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      width: 1080px;
      height: 1080px;
      overflow: hidden;
    }

    .container {
      width: 1080px;
      height: 1080px;
      position: relative;
      image-rendering: pixelated;
    }

    .background {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      image-rendering: pixelated;
    }

    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
    }

    .accent-border {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
    }

    .content {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 60px;
      text-align: center;
    }

    .title {
      font-family: 'MedievalSharp', cursive;
      color: #f5e6d3;
      font-size: 64px;
      line-height: 1.2;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5);
      max-width: 900px;
      word-wrap: break-word;
    }

    .sprite {
      position: absolute;
      bottom: 40px;
      left: 40px;
      width: 96px;
      height: 96px;
      image-rendering: pixelated;
      /* Show first frame of sprite sheet (top-left quadrant) */
      object-fit: none;
      object-position: 0 0;
    }

    .branding {
      position: absolute;
      bottom: 40px;
      left: 0;
      right: 0;
      text-align: center;
      font-family: 'Uncial Antiqua', cursive;
      color: rgba(245, 230, 211, 0.7);
      font-size: 28px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="background" id="background"></div>
    <div class="overlay"></div>
    <div class="accent-border" id="accent"></div>
    <div class="content">
      <h1 class="title" id="title"></h1>
    </div>
    <img class="sprite" id="sprite" />
    <div class="branding">dylan's blog</div>
  </div>
</body>
</html>
```

**Step 2: Commit**

```bash
git add scripts/instagram-template.html
git commit -m "feat: add Instagram graphic HTML template"
```

---

### Task 3: Create the Generator Script

**Files:**
- Create: `scripts/generate-instagram.js`

**Step 1: Write the generator script**

The script:
- Parses `--title` and `--category` CLI args
- Maps category to header image, sprite file, and glow color
- Loads the HTML template
- Injects title, background image path, sprite path, and accent color
- Launches Puppeteer, renders at 1080x1080, screenshots to PNG
- Saves to `output/instagram-{sanitized-title}.png`

```javascript
// ABOUTME: CLI script that generates 1080x1080 Instagram share images for blog posts.
// ABOUTME: Uses Puppeteer to render an HTML template with the blog's pixel art assets.

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const CATEGORY_MAP = {
  health:    { header: 'health.png',    sprite: 'skele-health.png',        glow: '#5de2a3' },
  tabletop:  { header: 'tabletop.png',  sprite: 'knight - tabletop.png',   glow: '#40c8d8' },
  gaming:    { header: 'tabletop.png',  sprite: 'Dragon - Tabletop.png',   glow: '#40c8d8' },
  tech:      { header: 'tech.png',      sprite: 'wizard-tech.png',         glow: '#6cd9e8' },
  writing:   { header: 'writing.png',   sprite: 'quill - Writing.png',     glow: '#c4a060' },
  cooking:   { header: 'cooking.png',   sprite: 'cauldren - cooking.png',  glow: '#e07040' },
  music:     { header: 'music.png',     sprite: 'banjo - music.png',       glow: '#e8c546' },
  travel:    { header: 'travel.png',    sprite: 'Adventure - Travel.png',  glow: '#5a9e5a' },
  reading:   { header: 'reading.png',   sprite: 'book-reading.png',        glow: '#8060c0' },
  crafting:  { header: 'crafting.png',  sprite: 'Muse - Writing.png',      glow: '#c4a060' },
  clowning:  { header: 'clown.png',     sprite: 'clown - clown.png',       glow: '#7050a0' },
  personal:  { header: 'home.png',      sprite: 'clown - clown.png',       glow: '#7050a0' },
  pets:      { header: 'home.png',      sprite: 'Cat - Health.png',        glow: '#e0a080' },
  adhd:      { header: 'home.png',      sprite: 'Donkey - Travel.png',     glow: '#5a9e5a' },
};

function parseArgs() {
  const args = process.argv.slice(2);
  let title = '';
  let category = 'personal';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--title' && args[i + 1]) {
      title = args[++i];
    } else if (args[i] === '--category' && args[i + 1]) {
      category = args[++i].toLowerCase();
    }
  }

  if (!title) {
    console.error('Usage: node generate-instagram.js --title "Post Title" --category health');
    process.exit(1);
  }

  if (!CATEGORY_MAP[category]) {
    console.error(`Unknown category: ${category}`);
    console.error(`Available: ${Object.keys(CATEGORY_MAP).join(', ')}`);
    process.exit(1);
  }

  return { title, category };
}

function sanitizeFilename(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

async function generateImage({ title, category }) {
  const themeDir = path.resolve(__dirname, '..', 'theme-pixel-art', 'static');
  const templatePath = path.resolve(__dirname, 'instagram-template.html');
  const outputDir = path.resolve(__dirname, '..', 'output');

  const cat = CATEGORY_MAP[category];
  const headerPath = `file://${path.join(themeDir, 'headers', cat.header)}`;
  const spritePath = `file://${path.join(themeDir, 'sprites', cat.sprite)}`;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf-8');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });

  await page.setContent(templateHtml, { waitUntil: 'networkidle0' });

  await page.evaluate(({ title, headerPath, spritePath, glow }) => {
    document.getElementById('title').textContent = title;
    document.getElementById('background').style.backgroundImage = `url(${headerPath})`;
    document.getElementById('sprite').src = spritePath;
    document.getElementById('accent').style.backgroundColor = glow;
  }, { title, headerPath, spritePath, glow: cat.glow });

  // Wait for fonts and images to load
  await page.evaluate(() => document.fonts.ready);
  await new Promise(resolve => setTimeout(resolve, 1000));

  const filename = `instagram-${sanitizeFilename(title)}.png`;
  const outputPath = path.join(outputDir, filename);

  await page.screenshot({ path: outputPath, type: 'png' });
  await browser.close();

  console.log(`Generated: ${outputPath}`);
  return outputPath;
}

async function main() {
  const { title, category } = parseArgs();
  await generateImage({ title, category });
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
```

**Step 2: Make sure the script runs**

Run:
```bash
node scripts/generate-instagram.js --title "TEST POST TITLE" --category personal
```

Expected: A file at `output/instagram-test-post-title.png` that shows the home.png header with "TEST POST TITLE" overlaid.

**Step 3: Visually verify the output**

Open the generated PNG and check:
- Title text is readable and centered
- Header image fills the background
- Dark overlay makes text pop
- Sprite visible in bottom-left
- "dylan's blog" branding at bottom
- Accent color border at top

**Step 4: Iterate on font sizing**

The title font size (64px) may need adjustment for very long titles. Test with a long title:
```bash
node scripts/generate-instagram.js --title "MILES VORKOSIGAN BROKE MY HEART SEVENTEEN TIMES AND I KEEP COMING BACK FOR MORE" --category reading
```

If the title overflows, add dynamic font sizing logic:
- Titles under 40 chars: 72px
- Titles 40-80 chars: 58px
- Titles 80-120 chars: 48px
- Titles 120+ chars: 38px

**Step 5: Commit**

```bash
git add scripts/generate-instagram.js
git commit -m "feat: add Instagram graphic generator script"
```

---

### Task 4: Add npm Script Shortcut

**Files:**
- Modify: `package.json`

**Step 1: Add convenience script to package.json**

Add to the scripts section:
```json
{
  "scripts": {
    "instagram": "node scripts/generate-instagram.js"
  }
}
```

Usage becomes: `npm run instagram -- --title "Post Title" --category health`

**Step 2: Commit**

```bash
git add package.json
git commit -m "feat: add npm instagram script shortcut"
```

---

### Task 5: Update Blog Writing Skill

**Files:**
- Modify: `docs/BLOG-WRITING-GUIDE.md`

**Step 1: Add Instagram generation section to the writing guide**

Add a new section after "Post Structure" that documents the Instagram workflow:

```markdown
## Instagram Share Image

After finalizing a blog post, generate the Instagram share graphic and copy.

### Generate the Graphic

Run:
\`\`\`bash
npm run instagram -- --title "YOUR POST TITLE" --category CATEGORY
\`\`\`

Output: `output/instagram-{slug}.png` — 1080x1080 pixel art graphic matching the blog theme.

### Caption Guidelines

Write 1-3 sentences in Dylan's blog voice:
- Hook the reader with the topic, not "new blog post!"
- Match the post's mood (playful, vulnerable, frustrated, etc.)
- End with "Link in bio" or similar CTA
- Keep it short — Instagram captions get truncated

### Hashtag Template

Mix topic-specific + recurring tags (10-15 total):

**Always include:** #dylansblog #blogging #pixelart #retrogaming

**Category-specific pools:**
- health: #chronicillness #spoonie #recovery #healthupdate
- tabletop: #tabletopgaming #bloodbowl #warhammer #minipainting #boardgames
- tech: #webdev #coding #indieweb #hugo
- writing: #amwriting #writingcommunity #nanowrimo
- cooking: #homecooking #foodblog
- music: #ukulele #musicproduction #synthwave
- reading: #bookrecommendations #scifibooks #romancebooks #bookstagram
- crafting: #puppetmaking #sewing #handmade
- clowning: #clownlife #circusarts #juggling
- personal: #lifeblog #personalgrowth #adhd
- pets: #catsofinstagram #catlife
```

**Step 2: Commit**

```bash
git add docs/BLOG-WRITING-GUIDE.md
git commit -m "docs: add Instagram generation workflow to blog writing guide"
```

---

### Task 6: End-to-End Test

**Step 1: Generate a graphic for each major category**

Run these and visually verify each:
```bash
node scripts/generate-instagram.js --title "My Dang Ol Derelict Ankle: The Sequel" --category health
node scripts/generate-instagram.js --title "A Measured and Reasonable Analysis of Blood Bowl" --category tabletop
node scripts/generate-instagram.js --title "SAVE EARLY SAVE OFTEN" --category tech
node scripts/generate-instagram.js --title "You Should Be Reading a Book Instead" --category reading
```

**Step 2: Verify each output**

Check that:
- Correct header background for each category
- Correct sprite in bottom-left
- Correct accent color at top
- Title readable at all lengths
- Fonts loaded correctly (MedievalSharp for title, Uncial Antiqua for branding)
- Overall vibe matches the blog

**Step 3: Fix any visual issues found during verification**

Adjust CSS in template as needed (overlay opacity, font sizes, spacing, sprite positioning).
