// ABOUTME: Unit tests for the brand book generator and the integrity of brand/tokens.json.
// ABOUTME: Run with `npm test` (node --test). These guard against the drift the tokens file exists to prevent.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const {
  loadTokens,
  renderBrandBook,
  categoryTable,
  modeTable,
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
