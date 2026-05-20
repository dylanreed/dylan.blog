// ABOUTME: Unit tests for the pure helper functions in generate-instagram.js.
// ABOUTME: Run with `npm test` (node --test); the puppeteer render is verified manually.

const { test } = require('node:test');
const assert = require('node:assert');

const {
  sanitizeFilename,
  parseStoryFrames,
  storyOutputName,
  getStoryTextSizeClass,
  buildLinkMap,
} = require('./generate-instagram.js');

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
