// ABOUTME: Tests for the Micro.blog Micropub publisher's pure logic — frontmatter
// ABOUTME: parsing, image classification/substitution, and Micropub form building.

const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  parseFrontmatter,
  isUploadableImagePath,
  replaceImageUrl,
  buildMicropubBody,
  findLocalImages,
  fillFirstImagePlaceholder,
  findUnresolvedPlaceholders,
} = require("./publish-microblog.js");

const SAMPLE = `---
title: "WE BUILT A 31-DAY YARN ADVENT (And It's Hallmark-Themed)"
date: 2026-06-21T14:30:00-0600
draft: true
categories:
  - crafting
tags:
  - yarn
  - advent
---

![a cozy squirrel](IMAGE_URL)

Body starts here. Advents!
`;

test("parseFrontmatter pulls title, date, lists, and body", () => {
  const { frontmatter, body } = parseFrontmatter(SAMPLE);
  assert.strictEqual(
    frontmatter.title,
    "WE BUILT A 31-DAY YARN ADVENT (And It's Hallmark-Themed)"
  );
  assert.strictEqual(frontmatter.date, "2026-06-21T14:30:00-0600");
  assert.deepStrictEqual(frontmatter.categories, ["crafting"]);
  assert.deepStrictEqual(frontmatter.tags, ["yarn", "advent"]);
  assert.ok(body.startsWith("![a cozy squirrel](IMAGE_URL)"));
  assert.ok(body.includes("Body starts here. Advents!"));
});

test("parseFrontmatter skips leading ABOUTME comments and reads real fields", () => {
  const md = [
    "<!-- ABOUTME: note one -->",
    "<!-- ABOUTME: note two -->",
    "---",
    'title: "Hello World"',
    "date: 2026-06-24T09:00:00-0600",
    "instagram caption: a caption: even with a colon",
    "instagram carousel:",
    '  - "quote one"',
    '  - "quote two"',
    "categories:",
    "  - adhd",
    "tags:",
    "  - health",
    "  - personal",
    "---",
    "",
    "![header](IMAGE_URL)",
    "Body.",
  ].join("\n");
  const { frontmatter, body } = parseFrontmatter(md);
  assert.strictEqual(frontmatter.title, "Hello World");
  assert.strictEqual(frontmatter.date, "2026-06-24T09:00:00-0600");
  // carousel quotes must NOT leak into categories/tags
  assert.deepStrictEqual(frontmatter.categories, ["adhd"]);
  assert.deepStrictEqual(frontmatter.tags, ["health", "personal"]);
  assert.ok(body.startsWith("![header](IMAGE_URL)"));
  assert.ok(!body.includes("ABOUTME"));
});

test("findUnresolvedPlaceholders reads the URL, not alt-text parens", () => {
  const body =
    '![a poster reading "YOU\'RE NOT LAZY (PROBABLY)"](https://x.com/a.png)\n\n![two](IMAGE_URL)';
  assert.deepStrictEqual(findUnresolvedPlaceholders(body), ["IMAGE_URL"]);
});

test("findUnresolvedPlaceholders returns [] when all URLs are real", () => {
  const body = '![alt with (CAPS) inside](https://x.com/a.png)';
  assert.deepStrictEqual(findUnresolvedPlaceholders(body), []);
});

test("parseFrontmatter unescapes quoted titles", () => {
  const md = `---\ntitle: "She said \\"hi\\""\n---\nbody`;
  const { frontmatter } = parseFrontmatter(md);
  assert.strictEqual(frontmatter.title, 'She said "hi"');
});

test("isUploadableImagePath: only real local paths, not URLs or placeholders", () => {
  assert.strictEqual(isUploadableImagePath("IMAGE_URL"), false);
  assert.strictEqual(isUploadableImagePath("PRODUCT_PAGE_URL"), false);
  assert.strictEqual(isUploadableImagePath("https://example.com/a.png"), false);
  assert.strictEqual(isUploadableImagePath("http://example.com/a.png"), false);
  assert.strictEqual(isUploadableImagePath("images/header.png"), true);
  assert.strictEqual(isUploadableImagePath("./output/foo.jpg"), true);
});

test("replaceImageUrl swaps a specific markdown image URL, leaving others", () => {
  const body =
    "![one](images/a.png)\n\ntext\n\n![two](https://x.com/b.png)";
  const out = replaceImageUrl(body, "images/a.png", "https://cdn.micro.blog/a.png");
  assert.ok(out.includes("![one](https://cdn.micro.blog/a.png)"));
  assert.ok(out.includes("![two](https://x.com/b.png)"));
});

test("findLocalImages returns only existing local files with absolute paths", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mb-test-"));
  const imgPath = path.join(dir, "header.png");
  fs.writeFileSync(imgPath, "fakepng");
  const body =
    "![local](header.png)\n![missing](nope.png)\n![remote](https://x.com/c.png)\n![ph](IMAGE_URL)";
  const found = findLocalImages(body, dir);
  assert.strictEqual(found.length, 1);
  assert.strictEqual(found[0].url, "header.png");
  assert.strictEqual(found[0].absPath, imgPath);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("fillFirstImagePlaceholder swaps the first ALL_CAPS placeholder, keeping alt", () => {
  const body = "![a cozy squirrel](IMAGE_URL)\n\ntext\n\n![two](https://x.com/b.png)";
  const out = fillFirstImagePlaceholder(body, "https://cdn.micro.blog/h.png");
  assert.ok(out.includes("![a cozy squirrel](https://cdn.micro.blog/h.png)"));
  assert.ok(out.includes("![two](https://x.com/b.png)"));
});

test("fillFirstImagePlaceholder only touches the FIRST placeholder", () => {
  const body = "![one](IMAGE_URL)\n![two](OTHER_URL)";
  const out = fillFirstImagePlaceholder(body, "https://cdn/x.png");
  assert.ok(out.includes("![one](https://cdn/x.png)"));
  assert.ok(out.includes("![two](OTHER_URL)"));
});

test("fillFirstImagePlaceholder prepends a header when no placeholder exists", () => {
  const body = "Just body text, no image.";
  const out = fillFirstImagePlaceholder(body, "https://cdn/x.png");
  assert.ok(out.startsWith("![](https://cdn/x.png)\n\n"));
  assert.ok(out.includes("Just body text"));
});

test("buildMicropubBody encodes Micropub fields, repeating categories", () => {
  const params = buildMicropubBody({
    title: "Hello & Goodbye",
    content: "Body with spaces",
    categories: ["crafting", "yarn"],
    published: "2026-06-21T14:30:00-0600",
    status: "draft",
    destination: "https://dylannotdylan.micro.blog/",
  });
  assert.strictEqual(params.get("h"), "entry");
  assert.strictEqual(params.get("name"), "Hello & Goodbye");
  assert.strictEqual(params.get("content"), "Body with spaces");
  assert.deepStrictEqual(params.getAll("category[]"), ["crafting", "yarn"]);
  assert.strictEqual(params.get("post-status"), "draft");
  assert.strictEqual(params.get("published"), "2026-06-21T14:30:00-0600");
  assert.strictEqual(params.get("mp-destination"), "https://dylannotdylan.micro.blog/");
});

test("buildMicropubBody omits empty optional fields", () => {
  const params = buildMicropubBody({
    title: "T",
    content: "C",
    categories: [],
    status: "published",
  });
  assert.strictEqual(params.getAll("category[]").length, 0);
  assert.strictEqual(params.has("published"), false);
  assert.strictEqual(params.has("mp-destination"), false);
  assert.strictEqual(params.get("post-status"), "published");
});
