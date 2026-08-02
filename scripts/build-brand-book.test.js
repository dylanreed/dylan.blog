// ABOUTME: Unit tests for the brand book generator and the integrity of brand/tokens.json.
// ABOUTME: Run with `npm test` (node --test). These guard against the drift the tokens file exists to prevent.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const {
  loadTokens,
  renderBrandBook,
  renderBrandBookHtml,
  categoryTable,
  modeTable,
  artPath,
} = require('./build-brand-book.js');

const tokens = loadTokens();

// ---------- tokens integrity ----------

test('every category has a header, a sprite and a glow colour', () => {
  for (const [name, cat] of Object.entries(tokens.categories)) {
    assert.ok(cat.header, `${name} is missing a header`);
    assert.ok(cat.sprite, `${name} is missing a sprite`);
    assert.match(cat.glow, /^#[0-9a-f]{6}$/, `${name} glow is not a hex colour`);
  }
});

test('every category glow is lowercase hex so comparisons are stable', () => {
  for (const [name, cat] of Object.entries(tokens.categories)) {
    assert.strictEqual(cat.glow, cat.glow.toLowerCase(), `${name} glow must be lowercase`);
  }
});

test('category art referenced by tokens actually exists on disk', () => {
  const root = path.resolve(__dirname, '..', 'theme-pixel-art', 'static');
  const missing = [];
  for (const [name, cat] of Object.entries(tokens.categories)) {
    if (!fs.existsSync(path.join(root, 'headers', cat.header))) {
      missing.push(`${name}: headers/${cat.header}`);
    }
    if (!fs.existsSync(path.join(root, 'sprites', cat.sprite))) {
      missing.push(`${name}: sprites/${cat.sprite}`);
    }
  }
  assert.deepStrictEqual(missing, [], `tokens point at art that is not there:\n${missing.join('\n')}`);
});

test('every mode declares a status the book knows how to render', () => {
  const allowed = new Set(['base', 'built', 'stub', 'variables']);
  for (const [name, mode] of Object.entries(tokens.modes)) {
    assert.ok(allowed.has(mode.status), `${name} has unknown status "${mode.status}"`);
  }
});

test('exactly one mode is the base', () => {
  const bases = Object.entries(tokens.modes).filter(([, m]) => m.status === 'base');
  assert.strictEqual(bases.length, 1, 'there must be exactly one base mode');
});

test('every social surface declares pixel dimensions', () => {
  for (const [name, s] of Object.entries(tokens.social)) {
    assert.ok(Number.isInteger(s.width) && s.width > 0, `${name} width`);
    assert.ok(Number.isInteger(s.height) && s.height > 0, `${name} height`);
  }
});

test('the reading category keeps the glow the review card was designed against', () => {
  assert.strictEqual(tokens.categories.reading.glow, '#8060c0');
});

// ---------- generator ----------

test('categoryTable emits one row per category plus a header row', () => {
  const rows = categoryTable(tokens).trim().split('\n');
  assert.strictEqual(rows.length, Object.keys(tokens.categories).length + 2); // header + separator
});

test('modeTable marks stub modes so they are not mistaken for finished work', () => {
  const out = modeTable(tokens);
  const stubs = Object.entries(tokens.modes).filter(([, m]) => m.status === 'stub');
  for (const [name] of stubs) {
    assert.match(out, new RegExp(`${name}[^\n]*stub`, 'i'), `${name} should be flagged as a stub`);
  }
});

test('renderBrandBook includes every mode and every category name', () => {
  const md = renderBrandBook(tokens);
  for (const name of Object.keys(tokens.modes)) {
    assert.ok(md.includes(name), `brand book omits mode ${name}`);
  }
  for (const name of Object.keys(tokens.categories)) {
    assert.ok(md.includes(name), `brand book omits category ${name}`);
  }
});

test('renderBrandBook is deterministic', () => {
  assert.strictEqual(renderBrandBook(tokens), renderBrandBook(tokens));
});

test('renderBrandBook carries the generated-file warning so nobody edits it by hand', () => {
  assert.match(renderBrandBook(tokens), /generated/i);
});

// ---------- html preview ----------

test('artPath url-encodes sprite filenames that contain spaces', () => {
  assert.strictEqual(artPath('sprites', 'clown - clown.png'),
    '../theme-pixel-art/static/sprites/clown%20-%20clown.png');
  assert.strictEqual(artPath('headers', 'reading.png'),
    '../theme-pixel-art/static/headers/reading.png');
});

test('every art path emitted by the html resolves to a real file', () => {
  const html = renderBrandBookHtml(tokens);
  const docsDir = path.resolve(__dirname, '..', 'docs');
  const srcs = [...html.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
  assert.ok(srcs.length > 0, 'expected the preview to reference art');
  const broken = srcs.filter(src =>
    !fs.existsSync(path.resolve(docsDir, decodeURIComponent(src))));
  assert.deepStrictEqual(broken, [], `broken image paths: ${broken.join(', ')}`);
});

test('html preview is self-contained apart from webfonts', () => {
  const html = renderBrandBookHtml(tokens);
  const remote = [...html.matchAll(/https?:\/\/[^"')\s]+/g)].map(m => m[0]);
  const offenders = remote.filter(u => !u.includes('fonts.googleapis.com') && !u.includes('fonts.gstatic.com'));
  assert.deepStrictEqual(offenders, [], `unexpected remote refs: ${offenders.join(', ')}`);
});

test('html preview loads every webfont the modes actually name', () => {
  const html = renderBrandBookHtml(tokens);
  const named = new Set();
  for (const mode of Object.values(tokens.modes)) {
    for (const f of Object.values(mode.type || {})) named.add(f);
  }
  for (const f of Object.values(tokens.type.base)) named.add(f);
  for (const family of named) {
    assert.ok(html.includes(family.replace(/ /g, '+')),
      `webfont "${family}" is named by a mode but never loaded`);
  }
});

test('html preview exposes a switcher entry for every mode', () => {
  const html = renderBrandBookHtml(tokens);
  for (const name of Object.keys(tokens.modes)) {
    assert.match(html, new RegExp(`data-mode="${name}"`), `no switcher entry for ${name}`);
  }
});

test('stub modes are marked in the html so a blank skin reads as broken, not as a style', () => {
  const html = renderBrandBookHtml(tokens);
  for (const [name, m] of Object.entries(tokens.modes)) {
    if (m.status !== 'stub') continue;
    assert.match(html, new RegExp(`data-mode="${name}"[^>]*data-status="stub"`),
      `${name} should be flagged as a stub in the switcher`);
  }
});

test('html preview escapes token text rather than injecting it raw', () => {
  const dirty = JSON.parse(JSON.stringify(tokens));
  dirty.identity.premise = 'a <script>alert(1)</script> premise';
  assert.ok(!renderBrandBookHtml(dirty).includes('<script>alert(1)</script>'));
});

test('html preview respects reduced motion', () => {
  assert.match(renderBrandBookHtml(tokens), /prefers-reduced-motion/);
});
