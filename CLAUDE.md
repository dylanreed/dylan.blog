# Dylan.blog

Dylan's personal blog — 23+ years of writing about health, hobbies, tech, tabletop gaming, and life. Pixel art theme with point-and-click adventure game aesthetic.

## Hosting

Hosted on **micro.blog**. Content lives there, not in this repo. The custom Hugo theme (`theme-pixel-art`) lives in its own repo at `/Users/nervous/Dev/theme-pixel-art` and is uploaded to micro.blog as a zip via Design → Edit Custom Themes.

This repo is a workspace for drafting posts, captions, and supporting docs — not a buildable site.

## What's Here

- `content/` — local draft posts and scratch content (gitignored; micro.blog owns the canonical content)
- `output/` — generated Instagram share images and captions (gitignored)
- `docs/BLOG-WRITING-GUIDE.md` — voice, structure, tag system, and Instagram caption guidelines
- `unneeded/` — old Hugo tooling, themes, scripts, and docs no longer used since the move to micro.blog (gitignored)

## Writing a Post

See `docs/BLOG-WRITING-GUIDE.md` for voice and structure. Drafts can live in `content/drafts/` while you work on them, then get published through micro.blog.

## Instagram Share Images

```bash
npm run instagram -- --title "YOUR POST TITLE" --category CATEGORY
```

Generates a 1080x1080 PNG at `output/instagram-{slug}.png` using puppeteer + the pixel art template in `scripts/`. The caption and hashtags live in the post's frontmatter (`instagram caption:` / `instagram tags:`). See `docs/BLOG-WRITING-GUIDE.md` for caption voice and hashtag pools.

The script reads sprite/header art from `theme-pixel-art/static/` (gitignored — assets duplicated locally from the canonical theme repo at `/Users/nervous/Dev/theme-pixel-art`).

## Conventions

- Never use `--no-verify` on commits
- All code files start with a 2-line `ABOUTME:` comment
