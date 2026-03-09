# Instagram Graphic Generator for Blog Posts

## Problem

After writing a blog post, Dylan needs a matching Instagram share image. Currently there's no automated way to generate a graphic that matches the blog's pixel art aesthetic.

## Solution

A script that generates a 1080x1080 Instagram graphic from a blog post title and category, plus Instagram caption and hashtags as part of the blog writing workflow.

## The Graphic

- **Background**: Category header image (health.png, tabletop.png, etc.) scaled/cropped to fill 1080x1080
- **Darkened overlay**: Semi-transparent dark layer so text reads over the pixel art
- **Post title**: MedievalSharp font, white/cream text, centered, with dark text-shadow
- **Category sprite**: Matching 96px animated sprite in one corner (skeleton for health, knight for tabletop, etc.)
- **Branding**: "dylan's blog" in Uncial Antiqua at the bottom
- **Category accent**: Category glow color used as subtle border or title highlight

## Technical Approach

- HTML template rendered via Puppeteer, screenshotted to PNG
- Script at `scripts/generate-og.js`
- CLI: `node scripts/generate-og.js --title "POST TITLE" --category health`
- Output: PNG file in `output/`

## Category → Asset Mapping

Uses existing theme assets:

| Category | Header | Sprite | Glow Color |
|----------|--------|--------|------------|
| health | health.png | skele-health.png | #5de2a3 |
| tabletop | tabletop.png | knight - tabletop.png | #40c8d8 |
| tech | tech.png | wizard-tech.png | #6cd9e8 |
| writing | writing.png | quill - Writing.png | #c4a060 |
| cooking | cooking.png | cauldren - cooking.png | #e07040 |
| music | music.png | banjo - music.png | #e8c546 |
| travel | travel.png | Adventure - Travel.png | #5a9e5a |
| reading | reading.png | book-reading.png | #8060c0 |
| crafting | crafting.png | Muse - Writing.png | #c4a060 |
| clowning | clown.png | clown - clown.png | #7050a0 |
| personal | home.png | clown - clown.png | #7050a0 |
| pets | home.png | Cat - Health.png | #e0a080 |
| adhd | home.png | Donkey - Travel.png | #5a9e5a |

## Workflow Integration

Added as the final step of the blog-writing skill:

1. Post is written and title is finalized
2. Script generates the Instagram graphic
3. Claude writes an Instagram caption (1-3 sentences, Dylan voice)
4. Claude generates relevant hashtags (topic + recurring)

## Dependencies

- puppeteer (npm)
- Google Fonts: MedievalSharp, Uncial Antiqua (loaded in HTML template)
