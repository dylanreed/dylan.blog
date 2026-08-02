// ABOUTME: Unit tests for the pure helper functions in generate-instagram.js.
// ABOUTME: Run with `npm test` (node --test); the puppeteer render is verified manually.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  CATEGORY_MAP,
  sanitizeFilename,
  parseStoryFrames,
  parseCarouselQuotes,
  stripQuotes,
  parsePostFile,
  storyOutputName,
  getStoryTextSizeClass,
  buildLinkMap,
} = require('./generate-instagram.js');

test('stripQuotes strips outer quotes and unescapes inner escaped quotes', () => {
  assert.strictEqual(stripQuotes('"\\"NOOOO\\": yes"'), '"NOOOO": yes');
  assert.strictEqual(stripQuotes('"plain"'), 'plain');
  assert.strictEqual(stripQuotes('unquoted'), 'unquoted');
});

test('parsePostFile returns a clean title (outer + escaped quotes removed)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ig-test-'));
  const p = path.join(dir, 'post.md');
  fs.writeFileSync(
    p,
    [
      '<!-- ABOUTME: note -->',
      '---',
      'title: "\\"NOOOO\\": I Got Diagnosed"',
      'categories:',
      '  - adhd',
      '---',
      '',
      '![h](IMAGE_URL)',
      'body',
    ].join('\n')
  );
  const fm = parsePostFile(p);
  assert.strictEqual(fm.title, '"NOOOO": I Got Diagnosed');
  assert.strictEqual(fm.category, 'adhd');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('sanitizeFilename lowercases and dashes non-alphanumerics', () => {
  assert.strictEqual(sanitizeFilename('Hello, World!'), 'hello-world');
});

test('sanitizeFilename caps length at 60', () => {
  const out = sanitizeFilename('a'.repeat(100));
  assert.ok(out.length <= 60);
});

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

test('parseCarouselQuotes returns [] when no block present', () => {
  const fm = 'title: Foo\ncategories:\n  - reading\n';
  assert.deepStrictEqual(parseCarouselQuotes(fm), []);
});

test('parseCarouselQuotes returns quotes with surrounding quotes stripped', () => {
  const fm = [
    'title: Foo',
    'instagram carousel:',
    '  - "First quote here"',
    '  - "Second quote"',
    'categories:',
    '  - reading',
  ].join('\n');
  assert.deepStrictEqual(parseCarouselQuotes(fm), [
    'First quote here',
    'Second quote',
  ]);
});

test('parseCarouselQuotes stops at the next top-level key', () => {
  const fm = [
    'instagram carousel:',
    '  - "Only quote"',
    'tags:',
    '  - foo',
  ].join('\n');
  assert.deepStrictEqual(parseCarouselQuotes(fm), ['Only quote']);
});

test('parseCarouselQuotes handles unquoted items', () => {
  const fm = [
    'instagram carousel:',
    '  - Plain text quote',
    '  - Another plain one',
  ].join('\n');
  assert.deepStrictEqual(parseCarouselQuotes(fm), [
    'Plain text quote',
    'Another plain one',
  ]);
});

test('parseCarouselQuotes skips blank lines within the block', () => {
  const fm = [
    'instagram carousel:',
    '  - "First"',
    '',
    '  - "Second"',
    'categories:',
  ].join('\n');
  assert.deepStrictEqual(parseCarouselQuotes(fm), ['First', 'Second']);
});

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

// ---------- category map comes from the tokens, not a second copy ----------

const TOKENS = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'brand', 'tokens.json'), 'utf8')
);

test('the category map is derived from brand/tokens.json, not duplicated', () => {
  assert.deepStrictEqual(
    Object.keys(CATEGORY_MAP).sort(),
    Object.keys(TOKENS.categories).sort()
  );
});

test('every category resolves to the header, sprite and glow the tokens declare', () => {
  for (const [name, tok] of Object.entries(TOKENS.categories)) {
    assert.deepStrictEqual(
      CATEGORY_MAP[name],
      { header: tok.header, sprite: tok.sprite, glow: tok.glow },
      `${name} drifted from the tokens`
    );
  }
});

test('generate-instagram.js contains no hand-written category table', () => {
  const src = fs.readFileSync(path.resolve(__dirname, 'generate-instagram.js'), 'utf8');
  // A literal map would spell out sprite filenames; the tokens should be the only place those live.
  assert.ok(!src.includes('skele-health.png'),
    'sprite filenames are hardcoded again — read them from brand/tokens.json');
  assert.ok(src.includes('tokens.json'),
    'the generator should load brand/tokens.json');
});

test('every category the generator offers points at art that exists', () => {
  const root = path.resolve(__dirname, '..', 'theme-pixel-art', 'static');
  const missing = [];
  for (const [name, c] of Object.entries(CATEGORY_MAP)) {
    if (!fs.existsSync(path.join(root, 'headers', c.header))) missing.push(`${name}: ${c.header}`);
    if (!fs.existsSync(path.join(root, 'sprites', c.sprite))) missing.push(`${name}: ${c.sprite}`);
  }
  assert.deepStrictEqual(missing, []);
});
