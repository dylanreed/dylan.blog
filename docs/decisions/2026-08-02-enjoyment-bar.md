<!-- ABOUTME: Decision record for the ENJOYMENT bar on the book review card — chose the hatched barber-pole treatment. -->
<!-- ABOUTME: Companion to scripts/review-card-calibration.html, which holds the live comparison of all four candidates. -->

# Decision: the ENJOYMENT bar

**Date:** 2026-08-02
**Status:** decided
**Scope:** the enjoyment rating on the book review card. Card layout and the wider review format are still open.

## What was decided

The enjoyment rating is a **loading bar**, not a count of icons. Variant **C — hatched** wins: a diagonal dither fill in reading-purple `#8060c0` inside a dark well, crawling barber-pole style when animated.

## Why a bar rather than five icons

- **Width agnostic.** Five sprites carry a fixed intrinsic width and have to be re-fit for each aspect ratio. A bar fills whatever box it is given, so one treatment serves the square card, the story frame and the in-post embed.
- **Legible small.** One shape with one fill boundary survives downscaling better than five shapes a reader has to count. Verified: rendered at 540px, downscaled to 300px (Instagram feed size), the stripes stay crisp and read as texture rather than mush.
- **DNF stops being an exception.** With an icon count, "did not finish" is a rating that shows no rating. With a bar it is simply a load that did not complete, which is what a DNF is. The metaphor carries it.
- **No new art.** A bar is CSS. Floppy or magpie icons would each need a sprite drawn plus a half-state.

## Why C over A, B and D

All four were built and compared side by side, animated, at full size and downscaled. A (segmented chunks), B (glossy solid inset) and D (terminal text) all work. C was chosen on look. It also happens to hold texture best at thumbnail size, and the barber-pole crawl is the most legible "still going" signal of the four.

The losing variants stay in `scripts/review-card-calibration.html` on purpose — they are the record of what was considered, and the page doubles as the styling harness if the choice is ever revisited.

## Rules that follow from this

- **No number on the enjoyment bar.** Fill only. A printed percentage on a book card reads as reading progress — Kindle, StoryGraph and Goodreads all use `%` that way — and a number also reintroduces the "is it 70 or 75" dithering the bar exists to avoid.
- **The one place a number appears is DNF**, where `%` correctly means progress: `CONNECTION LOST AT 34%`.
- **Label states:** `COMPLETE` at 100, `CONNECTION LOST AT n%` for a DNF, nothing otherwise.
- **The bar is not the whole rating.** It pairs with a shelf tag, and the two measure different things: the tag is breadth (who is this for), the bar is enjoyment (how much did Dylan like it). Because they are orthogonal they cannot contradict each other — 5/5 with `RIGHT READER` means "I adored this niche thing and you might not."

## Known consequence to handle later

The bar renders in two places: animated CSS in the blog post body, and a frozen frame inside the puppeteer-rendered PNG for Instagram. Animation cannot survive a static PNG. Those two renderings must share one source of truth for colors, geometry and label states, or they will drift. An animated Instagram card would mean rendering to MP4, which is a separate build and not planned.

## See also

- `scripts/review-card-calibration.html` — live comparison, drag the fill and toggle animation
- `scripts/generate-instagram.js:19` — where `reading` maps to `#8060c0`
- Dev-40d — brand book for dylan.blog, which should absorb the palette rules above
