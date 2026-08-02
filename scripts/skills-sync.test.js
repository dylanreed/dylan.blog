// ABOUTME: Keeps the ~/.claude/skills copies of the category list and review format in sync with brand/tokens.json.
// ABOUTME: Skips cleanly when the skills are not installed, so the suite still runs on another machine.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SKILLS = path.join(os.homedir(), '.claude', 'skills');
const BLOG_SKILL = path.join(SKILLS, 'blog-writing', 'SKILL.md');
const REVIEW_SKILL = path.join(SKILLS, 'bookreview', 'SKILL.md');

const tokens = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'brand', 'tokens.json'), 'utf8')
);

const read = p => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null);

test('blog-writing skill lists exactly the categories the tokens declare', (t) => {
  const src = read(BLOG_SKILL);
  if (!src) return t.skip('blog-writing skill not installed');

  const listed = [...src.matchAll(/^\| `([a-z-]+)` \|/gm)].map(m => m[1]);
  assert.deepStrictEqual(
    listed.sort(),
    Object.keys(tokens.categories).sort(),
    'blog-writing/SKILL.md drifted from brand/tokens.json'
  );
});

test('blog-writing hands book reviews off rather than specifying them', (t) => {
  const src = read(BLOG_SKILL);
  if (!src) return t.skip('blog-writing skill not installed');

  assert.ok(src.includes('bookreview'), 'blog-writing should point at the bookreview skill');
  assert.ok(!/350-500 \| Book reviews/.test(src),
    'blog-writing still carries the pre-two-depth review length');
});

test('bookreview skill lists exactly the shelf tags the tokens declare', (t) => {
  const src = read(REVIEW_SKILL);
  if (!src) return t.skip('bookreview skill not installed');

  const expected = Object.keys(tokens.reviewCard.shelfTags)
    .filter(k => !k.startsWith('$'))
    .map(k => k.toUpperCase().replace(/-/g, ' '));

  for (const tag of expected) {
    const pattern = new RegExp('`' + tag.replace(/ /g, '[ -]') + '`');
    assert.match(src, pattern, `bookreview skill is missing the ${tag} shelf tag`);
  }
});

test('bookreview skill lists exactly the genre modes that can carry a card', (t) => {
  const src = read(REVIEW_SKILL);
  if (!src) return t.skip('bookreview skill not installed');

  for (const mode of Object.keys(tokens.genreThemes.map)) {
    assert.match(src, new RegExp('`' + mode + '`'), `bookreview skill is missing the ${mode} skin`);
  }
  for (const mode of Object.keys(tokens.genreThemes.unavailable)) {
    assert.ok(!new RegExp('\\| `' + mode + '` \\|').test(src),
      `${mode} has no reading art but the skill offers it as a skin`);
  }
});

test('bookreview skill names the same fallback skin the tokens do', (t) => {
  const src = read(REVIEW_SKILL);
  if (!src) return t.skip('bookreview skill not installed');

  const fallback = tokens.genreThemes.$fallback;
  assert.match(src, new RegExp('falls back to `' + fallback + '`'),
    `skill should fall back to ${fallback}`);

  for (const other of Object.keys(tokens.genreThemes.map)) {
    if (other === fallback) continue;
    assert.ok(!new RegExp('falls back to `' + other + '`').test(src),
      `skill still names ${other} as the fallback`);
  }
});

test('the fallback skin is one that actually owns reading art', () => {
  const fallback = tokens.genreThemes.$fallback;
  assert.ok(Object.keys(tokens.genreThemes.map).includes(fallback),
    `fallback "${fallback}" cannot carry a card — it has no reading art`);
});

test('bookreview skill does not resurrect DNF', (t) => {
  const src = read(REVIEW_SKILL);
  if (!src) return t.skip('bookreview skill not installed');

  const offers = /^\s*[-|]\s*`DNF`/m.test(src);
  assert.ok(!offers, 'DNF was retired 2026-08-02 — the skill must not offer it as a tag');
});

test('bookreview skill quotes the word counts the tokens layout note implies', (t) => {
  const src = read(REVIEW_SKILL);
  if (!src) return t.skip('bookreview skill not installed');

  assert.match(src, /250[–-]400/, 'shelf talker length missing');
  assert.match(src, /800[–-]1200/, 'full review length missing');
});
