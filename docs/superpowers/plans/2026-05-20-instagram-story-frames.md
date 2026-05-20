# Instagram Story Frames Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an opt-in `--story` flag to the blog's Instagram generator that produces vertical 1080×1920 Story frames (text baked in, bottom-third sticker safe zone) plus a link map, driven by an `instagram stories:` frontmatter block.

**Architecture:** Extend `scripts/generate-instagram.js` with small pure functions (frontmatter story-block parser, filename helper, text-size helper, link-map builder) that are unit-tested with `node --test`, plus a thin puppeteer render loop that reuses the existing background-resolution logic and a new vertical template `scripts/story-template.html`. The square feed-image path is unchanged.

**Tech Stack:** Node.js, Puppeteer, `node --test` (built-in, no new dependencies), HTML/CSS template rendered headless.

---

## File Structure

- **Modify** `scripts/generate-instagram.js` — add `parseStoryFrames`, `stripQuotes`, `storyOutputName`, `getStoryTextSizeClass`, `buildLinkMap`; attach parsed stories in `parsePostFile`; add `--story` arg + story render loop in `main()`; add `module.exports` and a `require.main` guard.
- **Create** `scripts/story-template.html` — vertical 9:16 render template (sibling of `instagram-template.html`).
- **Create** `scripts/generate-instagram.test.js` — `node --test` unit tests for the pure functions.
- **Modify** `package.json` — add `"test": "node --test scripts/"`.
- **Modify** `content/posts/2026-05-14-the-bookshop-is-imaginary-the-book-club-is-real.md` — add the `instagram stories:` block (deliverable + manual verification; this file is gitignored).
- **Modify** `docs/BLOG-WRITING-GUIDE.md` and `CLAUDE.md` (repo root) — document the flag and frontmatter shape.

---

## Task 1: Test harness + make pure functions importable

**Files:**
- Modify: `scripts/generate-instagram.js` (bottom of file)
- Modify: `package.json`
- Create: `scripts/generate-instagram.test.js`

- [ ] **Step 1: Write the failing test**

Create `scripts/generate-instagram.test.js`:

```js
// ABOUTME: Unit tests for the pure helper functions in generate-instagram.js.
// ABOUTME: Run with `npm test` (node --test); the puppeteer render is verified manually.

const { test } = require('node:test');
const assert = require('node:assert');

const { sanitizeFilename } = require('./generate-instagram.js');

test('sanitizeFilename lowercases and dashes non-alphanumerics', () => {
  assert.strictEqual(sanitizeFilename('Hello, World!'), 'hello-world');
});

test('sanitizeFilename caps length at 60', () => {
  const out = sanitizeFilename('a'.repeat(100));
  assert.ok(out.length <= 60);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `sanitizeFilename` is `undefined` (the script has no exports yet), so the first assertion throws `TypeError: sanitizeFilename is not a function`. (Requiring the file currently also runs `main()` and exits; the guard added in Step 3 fixes both.)

- [ ] **Step 3: Add the test script, export guard, and exports**

In `package.json`, add a `test` script alongside the existing scripts:

```json
    "test": "node --test scripts/"
```

In `scripts/generate-instagram.js`, replace the trailing call:

```js
main().catch(err => {
  console.error('Error generating image:', err.message);
  process.exit(1);
});
```

with:

```js
if (require.main === module) {
  main().catch(err => {
    console.error('Error generating image:', err.message);
    process.exit(1);
  });
}

module.exports = {
  sanitizeFilename,
  getTitleSizeClass,
  parseStoryFrames,
  stripQuotes,
  storyOutputName,
  getStoryTextSizeClass,
  buildLinkMap,
};
```

Note: `parseStoryFrames`, `stripQuotes`, `storyOutputName`, `getStoryTextSizeClass`, and `buildLinkMap` are added in later tasks. They are function declarations (hoisted), so listing them in `module.exports` now is fine — they resolve to `undefined` until defined, and no test references them yet.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS — 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-instagram.js scripts/generate-instagram.test.js package.json
git commit -m "test: add node --test harness and export instagram helpers"
```

---

## Task 2: parseStoryFrames + stripQuotes

**Files:**
- Modify: `scripts/generate-instagram.js`
- Modify: `scripts/generate-instagram.test.js`

- [ ] **Step 1: Write the failing tests**

Update the require line at the top of `scripts/generate-instagram.test.js` to:

```js
const { sanitizeFilename, parseStoryFrames } = require('./generate-instagram.js');
```

Append these tests:

```js
test('parseStoryFrames returns [] when no block present', () => {
  const fm = 'title: Foo\ncategories:\n  - reading\n';
  assert.deepStrictEqual(parseStoryFrames(fm), []);
});

test('parseStoryFrames parses multiple frames with text and link', () => {
  const fm = [
    'title: Foo',
    'instagram stories:',
    '  - text: The book club is real.',
    '    link: https://dylan.blog/post',
    '  - text: "First book: Damsels and Dinosaurs"',
    '    link: https://wrenjones.net/d',
    'categories:',
    '  - reading',
  ].join('\n');
  assert.deepStrictEqual(parseStoryFrames(fm), [
    { text: 'The book club is real.', link: 'https://dylan.blog/post' },
    { text: 'First book: Damsels and Dinosaurs', link: 'https://wrenjones.net/d' },
  ]);
});

test('parseStoryFrames stops at the next top-level key', () => {
  const fm = [
    'instagram stories:',
    '  - text: Only frame',
    '    link: https://x.test',
    'tags:',
    '  - foo',
  ].join('\n');
  assert.deepStrictEqual(parseStoryFrames(fm), [
    { text: 'Only frame', link: 'https://x.test' },
  ]);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `parseStoryFrames is not a function`.

- [ ] **Step 3: Implement the functions**

In `scripts/generate-instagram.js`, add these function declarations (place them just above `function parsePostFile(` so the parser helpers sit together):

```js
function stripQuotes(value) {
  if (
    value.length >= 2 &&
    ((value[0] === '"' && value[value.length - 1] === '"') ||
      (value[0] === "'" && value[value.length - 1] === "'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

// Parses an `instagram stories:` block from raw frontmatter into [{ text, link }].
// Each frame is `- text: ...` followed by an indented `link: ...`. Returns [] when absent.
function parseStoryFrames(frontmatterRaw) {
  const lines = frontmatterRaw.split('\n');
  const start = lines.findIndex((l) => /^instagram stories:\s*$/.test(l));
  if (start === -1) return [];

  const frames = [];
  let current = null;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^\S/.test(line)) break; // dedent to a new top-level key ends the block
    if (line.trim() === '') continue;

    const itemMatch = line.match(/^\s*-\s*text:\s*(.*)$/);
    if (itemMatch) {
      if (current) frames.push(current);
      current = { text: stripQuotes(itemMatch[1].trim()), link: '' };
      continue;
    }
    const linkMatch = line.match(/^\s*link:\s*(.*)$/);
    if (linkMatch && current) {
      current.link = stripQuotes(linkMatch[1].trim());
      continue;
    }
    const textMatch = line.match(/^\s*text:\s*(.*)$/);
    if (textMatch && current) {
      current.text = stripQuotes(textMatch[1].trim());
    }
  }
  if (current) frames.push(current);
  return frames;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — all parseStoryFrames tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-instagram.js scripts/generate-instagram.test.js
git commit -m "feat: parse instagram stories frontmatter block"
```

---

## Task 3: storyOutputName + getStoryTextSizeClass

**Files:**
- Modify: `scripts/generate-instagram.js`
- Modify: `scripts/generate-instagram.test.js`

- [ ] **Step 1: Write the failing tests**

Update the require line in `scripts/generate-instagram.test.js` to:

```js
const {
  sanitizeFilename,
  parseStoryFrames,
  storyOutputName,
  getStoryTextSizeClass,
} = require('./generate-instagram.js');
```

Append these tests:

```js
test('storyOutputName builds a 1-based png name sharing the slug stem', () => {
  assert.strictEqual(storyOutputName('my-post', 1), 'instagram-my-post-story-1.png');
  assert.strictEqual(storyOutputName('my-post', 3), 'instagram-my-post-story-3.png');
});

test('getStoryTextSizeClass scales by text length', () => {
  assert.strictEqual(getStoryTextSizeClass('short'), 'size-xl');
  assert.strictEqual(getStoryTextSizeClass('x'.repeat(70)), 'size-lg');
  assert.strictEqual(getStoryTextSizeClass('x'.repeat(130)), 'size-md');
  assert.strictEqual(getStoryTextSizeClass('x'.repeat(200)), 'size-sm');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `storyOutputName is not a function`.

- [ ] **Step 3: Implement the functions**

In `scripts/generate-instagram.js`, add just below `getTitleSizeClass`:

```js
function storyOutputName(slug, index) {
  return `instagram-${slug}-story-${index}.png`;
}

function getStoryTextSizeClass(text) {
  const len = text.length;
  if (len < 50) return 'size-xl';
  if (len < 100) return 'size-lg';
  if (len < 160) return 'size-md';
  return 'size-sm';
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-instagram.js scripts/generate-instagram.test.js
git commit -m "feat: add story filename and text-size helpers"
```

---

## Task 4: buildLinkMap

**Files:**
- Modify: `scripts/generate-instagram.js`
- Modify: `scripts/generate-instagram.test.js`

- [ ] **Step 1: Write the failing test**

Update the require line in `scripts/generate-instagram.test.js` to:

```js
const {
  sanitizeFilename,
  parseStoryFrames,
  storyOutputName,
  getStoryTextSizeClass,
  buildLinkMap,
} = require('./generate-instagram.js');
```

Append this test:

```js
test('buildLinkMap lists every frame, its png, link, and the in-app reminder', () => {
  const frames = [
    { text: 'Frame one', link: 'https://a.test' },
    { text: 'Frame two', link: 'https://b.test' },
  ];
  const md = buildLinkMap('my-post', frames);
  assert.match(md, /Link sticker/);
  assert.match(md, /Frame 1 — instagram-my-post-story-1\.png/);
  assert.match(md, /Frame 2 — instagram-my-post-story-2\.png/);
  assert.match(md, /Text: Frame one/);
  assert.match(md, /https:\/\/a\.test/);
  assert.match(md, /https:\/\/b\.test/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `buildLinkMap is not a function`.

- [ ] **Step 3: Implement the function**

In `scripts/generate-instagram.js`, add below `getStoryTextSizeClass`:

```js
// Builds the markdown link map that tells you which URL to sticker on each frame.
function buildLinkMap(slug, frames) {
  const header = [
    '# Instagram Stories — link map',
    '',
    'Add each link in the Instagram app: Stories → upload the frame → Link sticker → paste the URL → drag it into the clear band at the bottom of the frame.',
    '',
  ];
  const blocks = frames.map((frame, i) => {
    const n = i + 1;
    return [
      `## Frame ${n} — ${storyOutputName(slug, n)}`,
      `Text: ${frame.text}`,
      `Link: ${frame.link}`,
      '',
    ].join('\n');
  });
  return header.concat(blocks).join('\n');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-instagram.js scripts/generate-instagram.test.js
git commit -m "feat: build instagram story link map"
```

---

## Task 5: Vertical Story template

**Files:**
- Create: `scripts/story-template.html`

- [ ] **Step 1: Create the template**

Create `scripts/story-template.html`:

```html
<!-- ABOUTME: HTML template for generating 1080x1920 Instagram Story frames for blog posts. -->
<!-- ABOUTME: Vertical sibling of instagram-template.html; reserves the bottom ~600px as a link-sticker safe zone. -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080, height=1920">
  <link href="https://fonts.googleapis.com/css2?family=MedievalSharp&family=Uncial+Antiqua&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      font-family: 'MedievalSharp', cursive;
    }

    #background {
      position: absolute;
      top: 0;
      left: 0;
      width: 1080px;
      height: 1920px;
      background-size: cover;
      background-position: center;
      image-rendering: pixelated;
    }

    #overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 1080px;
      height: 1920px;
      background: rgba(0, 0, 0, 0.55);
    }

    #accent {
      position: absolute;
      top: 0;
      left: 0;
      width: 1080px;
      height: 8px;
    }

    /* Text sits in the top region; the bottom 600px stays clear for the link sticker. */
    #title-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 1080px;
      height: 1320px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 120px 80px;
    }

    #title {
      color: #f5e6d3;
      text-align: center;
      max-width: 920px;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5);
      line-height: 1.3;
      font-family: 'MedievalSharp', cursive;
      font-weight: normal;
    }

    #title.size-xl { font-size: 84px; }
    #title.size-lg { font-size: 68px; }
    #title.size-md { font-size: 56px; }
    #title.size-sm { font-size: 44px; }

    #sprite {
      position: absolute;
      bottom: 640px;
      left: 60px;
      width: 110px;
      height: 110px;
      background-size: 200% 200%;
      background-position: 0 0;
      image-rendering: pixelated;
    }

    #branding {
      position: absolute;
      bottom: 660px;
      left: 0;
      width: 1080px;
      text-align: center;
      font-family: 'Uncial Antiqua', cursive;
      font-size: 34px;
      color: rgba(245, 230, 211, 0.7);
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    }
  </style>
</head>
<body>
  <div id="background"></div>
  <div id="overlay"></div>
  <div id="accent"></div>
  <div id="title-container">
    <h1 id="title" class="size-xl"></h1>
  </div>
  <div id="sprite"></div>
  <div id="branding">dylan's blog</div>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add scripts/story-template.html
git commit -m "feat: add vertical 1080x1920 story template"
```

---

## Task 6: Wire `--story` into the generator

**Files:**
- Modify: `scripts/generate-instagram.js` (`parseArgs`, `parsePostFile`, `main`)

- [ ] **Step 1: Add `--story` to parseArgs**

In `scripts/generate-instagram.js`, in `parseArgs`, add a branch after the `--post` branch:

```js
    } else if (argv[i] === '--post' && argv[i + 1]) {
      args.post = argv[++i];
    } else if (argv[i] === '--story') {
      args.story = true;
    }
```

- [ ] **Step 2: Attach parsed stories in parsePostFile**

In `parsePostFile`, just before `return out;`, add:

```js
  out.stories = parseStoryFrames(fmRaw);
```

- [ ] **Step 3: Hoist the parsed frontmatter and validate `--story` early in main**

In `main`, change the `--post` block so the parsed frontmatter is reachable later. Replace:

```js
  let postHeaderImage;
  if (args.post) {
    const postPath = path.resolve(args.post);
    if (!fs.existsSync(postPath)) {
      console.error(`Post file not found: ${postPath}`);
      process.exit(1);
    }
    const fm = parsePostFile(postPath);
    if (!args.title && fm.title) args.title = fm.title;
    if (!args.category && fm.category) args.category = fm.category;
    postHeaderImage = fm.headerImage;
  }
```

with:

```js
  let postHeaderImage;
  let postFm;
  if (args.post) {
    const postPath = path.resolve(args.post);
    if (!fs.existsSync(postPath)) {
      console.error(`Post file not found: ${postPath}`);
      process.exit(1);
    }
    postFm = parsePostFile(postPath);
    if (!args.title && postFm.title) args.title = postFm.title;
    if (!args.category && postFm.category) args.category = postFm.category;
    postHeaderImage = postFm.headerImage;
  }

  if (args.story) {
    if (!args.post) {
      console.error('--story requires --post (story frames are read from the post frontmatter)');
      process.exit(1);
    }
    const frames = postFm && postFm.stories ? postFm.stories : [];
    if (frames.length === 0) {
      console.error(`No "instagram stories:" block found in ${args.post}`);
      process.exit(1);
    }
    frames.forEach((frame, i) => {
      if (!frame.text || !frame.link) {
        console.error(`Story frame ${i + 1} is missing text or link`);
        process.exit(1);
      }
    });
  }
```

- [ ] **Step 4: Add the story render loop in main**

In `main`, locate the feed-image screenshot near the end:

```js
  await page.screenshot({ path: outputPath, type: 'png' });
  await browser.close();

  console.log(`Generated: ${outputPath}`);
```

Replace it with (insert the story loop before `browser.close()`):

```js
  await page.screenshot({ path: outputPath, type: 'png' });
  console.log(`Generated: ${outputPath}`);

  if (args.story) {
    const storyTemplatePath = path.resolve(__dirname, 'story-template.html');
    if (!fs.existsSync(storyTemplatePath)) {
      console.error(`Story template not found: ${storyTemplatePath}`);
      await browser.close();
      process.exit(1);
    }
    const storyTemplateFileUrl = `file://${storyTemplatePath}`;
    const frames = postFm.stories;
    await page.setViewport({ width: 1080, height: 1920 });
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      await page.goto(storyTemplateFileUrl, { waitUntil: 'networkidle0' });
      const storySizeClass = getStoryTextSizeClass(frame.text);
      await page.evaluate(({ text, headerUrl, spriteUrl, glowColor, sizeClass }) => {
        document.getElementById('title').textContent = text;
        document.getElementById('title').className = sizeClass;
        document.getElementById('background').style.backgroundImage = `url('${headerUrl}')`;
        document.getElementById('sprite').style.backgroundImage = `url('${spriteUrl}')`;
        document.getElementById('accent').style.backgroundColor = glowColor;
      }, {
        text: frame.text,
        headerUrl: headerFileUrl,
        spriteUrl: spriteFileUrl,
        glowColor: catConfig.glow,
        sizeClass: storySizeClass,
      });
      await page.evaluate(() => document.fonts.ready);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const storyPath = path.resolve(outputDir, storyOutputName(sanitized, i + 1));
      await page.screenshot({ path: storyPath, type: 'png' });
      console.log(`Generated: ${storyPath}`);
    }
    const linkMapPath = path.resolve(outputDir, `instagram-${sanitized}-stories.md`);
    fs.writeFileSync(linkMapPath, buildLinkMap(sanitized, frames));
    console.log(`Generated: ${linkMapPath}`);
  }

  await browser.close();
```

- [ ] **Step 5: Verify pure-function tests still pass and `--story` guards work**

Run: `npm test`
Expected: PASS — no regressions (the new code in `main` is not unit-tested; guards are checked manually next).

Run: `npm run instagram -- --title "No Post" --story`
Expected: prints `--story requires --post (story frames are read from the post frontmatter)` and exits non-zero.

- [ ] **Step 6: Commit**

```bash
git add scripts/generate-instagram.js
git commit -m "feat: generate story frames and link map with --story"
```

---

## Task 7: Add the stories block to the launch post and verify the render

**Files:**
- Modify: `content/posts/2026-05-14-the-bookshop-is-imaginary-the-book-club-is-real.md` (gitignored — not committed)

- [ ] **Step 1: Add the `instagram stories:` block to the post frontmatter**

In the post's frontmatter, directly after the `instagram tags:` line and before `categories:`, add:

```yaml
instagram stories:
  - text: The book club is real. The bookshop is still imaginary.
    link: https://dylan.blog/2026/05/20/the-bookshop-is-imaginary-the.html
  - text: "First book: Damsels and Dinosaurs — a sapphic regency romance with dinosaurs. Reading opens June 3."
    link: https://www.wrenjones.net/damsels-and-dinosaurs
  - text: Can't buy it? Read it free. Find it at your library.
    link: https://www.worldcat.org/search?q=damsels+and+dinosaurs+wren+jones
```

- [ ] **Step 2: Generate the frames**

Run: `npm run instagram -- --post content/posts/2026-05-14-the-bookshop-is-imaginary-the-book-club-is-real.md --story`
Expected: logs the feed image, then `...-story-1.png`, `...-story-2.png`, `...-story-3.png`, then `...-stories.md`, all under `output/`.

- [ ] **Step 3: Verify visually (eyeball the renders)**

Open the three `output/instagram-...-story-N.png` files. Confirm: vertical 1080×1920, text legible in the upper/middle, the bottom ~600px is clear (no text/branding/sprite in it), pixel-art brand consistent with the feed image. Then open `output/instagram-...-stories.md` and confirm all three URLs are listed against the right frames with the in-app reminder line.

(No commit — `content/` and `output/` are gitignored.)

---

## Task 8: Document the flag

**Files:**
- Modify: `docs/BLOG-WRITING-GUIDE.md`
- Modify: `CLAUDE.md` (repo root)

- [ ] **Step 1: Add a Story Frames subsection to the writing guide**

In `docs/BLOG-WRITING-GUIDE.md`, immediately after the `### Caption Guidelines` / `### Hashtag Template` Instagram material and before the `---` that closes the Instagram section, add:

```markdown
### Story Frames (optional)

Instagram feed captions can't carry clickable links — only Story link stickers can. To generate vertical Story frames for a post, add an `instagram stories:` block to the frontmatter (one `text` + `link` per frame) and pass `--story`:

```yaml
instagram stories:
  - text: The hook for frame one.
    link: https://dylan.blog/the-post
  - text: The second frame's line.
    link: https://example.com/buy
```

```bash
npm run instagram -- --post content/posts/YYYY-MM-DD-slug.md --story
```

Output: `output/instagram-{slug}-story-1.png`, `-story-2.png`, … (vertical 1080×1920, text baked in, bottom third left clear) plus `output/instagram-{slug}-stories.md` — the link map listing which URL to sticker on each frame. The link sticker itself is added in the Instagram app (Stories → upload the frame → Link sticker → paste the URL → drag it into the clear bottom band); a link can't be baked into an uploaded image.
```

- [ ] **Step 2: Add the flag to the root CLAUDE.md Instagram block**

In `CLAUDE.md` (repo root), in the `## Instagram Share Images` section, after the existing paragraph, add:

```markdown
For Story frames, add an `instagram stories:` block (one `text` + `link` per frame) to the post frontmatter and run with `--story`:

```bash
npm run instagram -- --post content/posts/YYYY-MM-DD-slug.md --story
```

This writes vertical 1080x1920 frames (`output/instagram-{slug}-story-N.png`) plus a link map (`output/instagram-{slug}-stories.md`). Link stickers are added in the Instagram app — they can't be baked into the image.
```

- [ ] **Step 3: Commit**

```bash
git add docs/BLOG-WRITING-GUIDE.md CLAUDE.md
git commit -m "docs: document --story flag and instagram stories frontmatter"
```

---

## Self-Review

**Spec coverage:**
- Opt-in `--story`, feed flow unchanged → Task 6 (parseArgs branch; feed render untouched).
- `instagram stories:` frontmatter list → Task 2 (`parseStoryFrames`), Task 7 (real usage).
- Vertical 1080×1920 PNGs, text baked in, bottom-third safe zone → Task 5 (template), Task 6 (render loop).
- Link map `.md` with in-app reminder → Task 4 (`buildLinkMap`), Task 6 (write).
- Background reuse → Task 6 (loop reuses `headerFileUrl`/`spriteFileUrl`/`catConfig`).
- New `story-template.html`, square template untouched → Task 5.
- Errors (no `--post`, no block, frame missing text/link, missing template) → Task 6 Step 3 + Step 4.
- Tests: pure functions via `node --test`, render eyeballed → Tasks 1–4, Task 7 Step 3.
- Docs (guide + CLAUDE.md) → Task 8.

**Placeholder scan:** none — every code step shows complete code; every run step shows the command and expected result.

**Type/name consistency:** `parseStoryFrames` → `[{ text, link }]` used identically in `parsePostFile` (`out.stories`), `main` validation/loop, and `buildLinkMap`. `storyOutputName(slug, index)` is 1-based in Task 3, Task 4 (`buildLinkMap`), and Task 6 (`storyOutputName(sanitized, i + 1)`). Size classes `size-xl/lg/md/sm` match between `getStoryTextSizeClass` (Task 3) and `story-template.html` (Task 5). Template element IDs `background`/`overlay`/`accent`/`title`/`sprite` match between Task 5 and the `page.evaluate` in Task 6.
