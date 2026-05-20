# Instagram Story Frames — Design

**Date:** 2026-05-20
**Status:** Approved (design)
**Area:** `scripts/generate-instagram.js`, blog Instagram tooling

## Problem

The blog's Instagram flow generates one 1080×1080 feed image per post (`npm run instagram -- --post <path>`), pulling the caption and hashtags from the post's frontmatter. Instagram feed captions can't carry clickable links — the only place a tappable link works is a **Story link sticker**. There's no tooling for Stories today, so driving readers from Instagram straight to the post (or to a book's buy/library link) means hand-building frames from scratch every time.

## Goal

Add Story-frame generation as an **opt-in option** to the existing flow. One command produces a set of vertical, on-brand frames plus a map of which link to sticker on each — leaving only the in-app sticker step (which Instagram requires; a link can't be baked into an uploaded image).

## Non-goals

- Posting to Instagram (manual, in-app).
- Baking link stickers into the image (impossible — the sticker is added in the IG app).
- Changing the existing feed-image behavior in any way.
- A pixel-diff/snapshot test of the rendered image.

## Behavior

### Trigger

```bash
npm run instagram -- --post <path>            # feed image only — UNCHANGED
npm run instagram -- --post <path> --story    # ALSO generates story frames + link map
```

`--story` is opt-in. Without it, behavior is identical to today. `--story` requires `--post` (the frame content lives in frontmatter); if `--story` is passed without a resolvable `instagram stories:` block, the script prints a clear error and exits non-zero.

### Frontmatter shape

A new `instagram stories:` list in the post frontmatter, alongside `instagram caption:` / `instagram tags:`. Each entry is a `text` (on-screen copy) + `link` (URL to sticker) pair. Variable length.

```yaml
instagram stories:
  - text: The book club is real. The bookshop is still imaginary.
    link: https://dylan.blog/2026/05/20/the-bookshop-is-imaginary-the.html
  - text: "First book: Damsels and Dinosaurs — a sapphic regency romance with dinosaurs. Reading opens June 3."
    link: https://www.wrenjones.net/damsels-and-dinosaurs
  - text: Can't buy it? Read it free. Find it at your library.
    link: https://www.worldcat.org/search?q=damsels+and+dinosaurs+wren+jones
```

### Output

For a post whose feed image is `instagram-{slug}.png`:

- `output/instagram-{slug}-story-1.png`, `-story-2.png`, … — one vertical **1080×1920** PNG per frame. Pixel-art brand styling consistent with the feed template. The frame's `text` is rendered in the upper/middle region; the **bottom third is kept clear** as a link-sticker safe zone.
- `output/instagram-{slug}-stories.md` — the **link map**. For each frame: frame number, the on-screen text, and the URL to place as a link sticker, plus a one-line reminder that the sticker is added in the Instagram app (Stories → upload frame → Link sticker → paste URL → drag into the safe zone).

`{slug}` is derived from the post title with the existing `sanitizeFilename` logic, so feed and story outputs share a stem.

### Background image

Reuses the existing resolution logic unchanged: the post's first body image if reachable (HTTP) or present (local), otherwise the category header art. Same `checkUrlReachable` path as the feed image.

## Architecture

The current `scripts/generate-instagram.js` mixes frontmatter parsing, asset resolution, and rendering in `main()`. To add Stories cleanly and make the logic testable, extract the pure pieces into small, named functions and keep the puppeteer render thin.

### New template

`scripts/story-template.html` — a 9:16 sibling of `scripts/instagram-template.html`. Separate file because the layout differs materially (vertical, text reflow, reserved bottom-third sticker band). The existing square template is left untouched.

### Functions to extract (pure, unit-tested)

- `parseStoryFrames(frontmatterRaw)` → array of `{ text, link }`. Parses the indented `instagram stories:` block (a small dedicated parser; no new YAML dependency, consistent with the existing hand-rolled frontmatter parsing). Returns `[]` when the block is absent.
- `storyOutputName(slug, index)` → `instagram-{slug}-story-{index}.png` (1-based).
- `buildLinkMap(slug, frames)` → the markdown string for the `-stories.md` link map.
- `getStoryTextSizeClass(text)` → size class by length, mirroring the existing `getTitleSizeClass` approach for the square image.

`main()` keeps orchestration: parse args, resolve background, and — when `--story` is set — loop frames, render each through `story-template.html`, write PNGs, then write the link map.

### Data flow (`--story`)

1. Parse args; require `--post`.
2. `parsePostFile` → frontmatter (existing) + `parseStoryFrames` → frames.
3. Resolve background image (existing logic).
4. For each frame: load `story-template.html`, inject background + `text` + size class, screenshot to `output/instagram-{slug}-story-{n}.png`.
5. `buildLinkMap` → write `output/instagram-{slug}-stories.md`.
6. Log each generated path.

## Errors

- `--story` without `--post`: error, exit non-zero.
- `--story` with no `instagram stories:` block (or empty list): error naming the post and the expected frontmatter key, exit non-zero.
- A frame missing `text` or `link`: error naming the frame index, exit non-zero (don't render a half-frame).
- Background/template/asset-missing cases reuse the existing error handling.

## Testing

Per CLAUDE.md, with the render treated as manual visual verification (puppeteer needs headless Chrome + asset files — same eyeball check used for the feed image).

- **Unit (`node --test`, no new dependencies):**
  - `parseStoryFrames` — multi-frame block, single frame, absent block (`[]`), `text` containing colons/quotes, links preserved verbatim.
  - `storyOutputName` — 1-based indexing, slug stem matches feed image.
  - `buildLinkMap` — frame count, text and links present, in-app reminder line present.
  - `getStoryTextSizeClass` — boundary lengths.
- **Manual verification:** run `--story` on the launch post, open the generated PNGs, confirm text legibility, brand consistency, and that the bottom third is clear for the sticker. Confirm the link map lists every frame's URL.

A `test` script is added to `package.json` (`node --test`). This is the repo's first test runner; `node --test` keeps it dependency-free.

## Docs

Update `docs/BLOG-WRITING-GUIDE.md` (Instagram section) and the root `CLAUDE.md` Instagram block to document the `--story` flag, the `instagram stories:` frontmatter shape, and the link-sticker-is-in-app step.
