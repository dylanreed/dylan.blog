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
