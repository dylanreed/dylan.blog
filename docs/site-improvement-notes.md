# Dylan.blog Site Improvement Notes

Reviewed: 2026-01-20

## Summary

The site has strong personality and the pixel-art theming is genuinely delightful. The four themes (Fantasy, Underwater/Sci-fi, Cyberpunk, Cozy Cabin) are all visually distinct and well-executed. The EASY mode provides a clean fallback for accessibility. Below are opportunities to improve readability, navigation, and performance.

---

## 🐛 Bugs

### HTML Entity Encoding in EASY Mode
**Priority: High**

In EASY mode, apostrophes display as `&rsquo;` instead of proper characters. Example from homepage:
> "It&rsquo;s a five-string, open-back banjo"

This appears to be an encoding issue where HTML entities aren't being decoded in the simplified view.

---

## 🧭 Navigation Improvements

### 1. No Search Functionality
**Priority: High**

With 20+ years of content, there's no way to search the archive. Users can only browse chronologically or by category.

**Suggestions:**
- Add a simple search bar in the header or a dedicated search page
- Consider a static search solution like Pagefind or Lunr.js
- Even a "search this site via DuckDuckGo" link would help

### 2. No Previous/Next Post Navigation
**Priority: Medium**

Individual post pages have no way to navigate to the previous or next post. Users must go back to the homepage or archive to continue reading.

**Suggestion:** Add prev/next links at the bottom of posts, ideally with post titles.

### 3. No Category Navigation from Posts
**Priority: Medium**

When reading a post, clicking the category badge takes you to the category page, but there's no persistent category navigation. Users can't easily browse "all health posts" while reading one.

**Suggestion:** Consider a sidebar or footer section showing related posts in the same category.

### 4. RSS Feed Not Discoverable
**Priority: Low**

The RSS feed exists at `/feed.xml` but isn't linked anywhere visible in the UI. RSS readers will auto-discover it, but humans won't know it's there.

**Suggestion:** Add an RSS icon/link in the footer or header.

### 5. About Page Missing Contact Info
**Priority: Medium**

The "who is?" page says "email me" and "my inbox is open" but doesn't actually provide an email address or any contact links.

**Suggestion:** Add actual contact info - email, Mastodon, whatever you're comfortable sharing.

---

## 📱 Performance & Loading

### Archive Page Loads Everything
**Priority: High**

The archive page loads ALL posts at once - 749 images and 1106 links. This is likely slow on mobile and uses significant bandwidth.

**Suggestions:**
- Implement pagination (e.g., by year or chunks of 50 posts)
- Lazy-load images below the fold
- Consider a collapsed year-by-year view that expands on click

### Category Sprites on Every Post
**Priority: Low**

Each post listing includes an animated category sprite (576x288 or 384x192). With 20+ posts on the homepage, that's a lot of animated images.

**Suggestion:** Consider lazy-loading sprites or using smaller thumbnails for list views.

---

## 🎨 Theme-Specific Notes

### Fantasy Theme
- Works well, good contrast
- Navigation menu is clear

### Underwater/Sci-fi Theme
- Text contrast is good against the dark content area
- The lighter blue background is pleasant

### Cyberpunk Theme
- Neon pink title works
- Good use of the dark content area for contrast

### Cozy Cabin Theme
- Warmest and most inviting
- The fireplace/interior scene is charming
- Navigation buttons blend well with the wood aesthetic

### EASY Mode
- Excellent accessibility fallback
- Clean, fast, readable
- **Bug:** HTML entities not decoded (see above)

---

## 💡 Feature Ideas

### 1. "Random Post" Button
With 20+ years of content, a "surprise me" random post link could be fun and fits the chaos goblin energy.

### 2. Reading Time Estimates
For longer posts, showing estimated reading time (e.g., "5 min read") helps users decide when to dive in.

### 3. Series/Saga Navigation
Posts like "THE DERELICT ANKLE SAGA" are part of ongoing narratives. Consider tagging related posts as a "series" with easy navigation between entries.

### 4. Table of Contents for Long Posts
Epic-length posts could benefit from a floating or collapsible TOC for section navigation.

### 5. "Back to Top" in EASY Mode
The FANCY mode has a "↑ TOP" button, but EASY mode doesn't seem to have it visible.

---

## ✅ What's Working Well

- **Theme variety** - Four distinct themes all feel cohesive
- **EASY/FANCY toggle** - Great accessibility feature
- **Skip to main content** link - Good for keyboard navigation
- **Category sprites** - Adds personality and visual interest
- **Achievement system** - Fun gamification element
- **Weather/day-night effects** - Delightful details
- **Chaos mode** - Peak chaos goblin energy
- **Mobile hamburger menu** - Exists and works
- **RSS feed** - Auto-discoverable by readers

---

## 🔍 SEO Fixes (Feb 2026 Audit)

### Template Fixes (All done in ~/Dev/theme-pixel-art — need theme re-upload)

All SEO fixes are in the source of truth at `~/Dev/theme-pixel-art`. The live site is still running an older zip and won't reflect these until re-uploaded. The SEO logic lives in two files: `layouts/partials/head.html` (title tag) and `layouts/partials/seo.html` (meta tags, OG, Twitter, JSON-LD).

1. **Title tag duplication** — ✅ Fixed in `head.html`. Homepage no longer produces "dylan's blog - dylan's blog". Uses explicit `.IsHome` check.
2. **Meta description HTML stripping** — ✅ Fixed in `seo.html`. `plainify | htmlUnescape` pipeline strips HTML tags from micro.blog's site description and prevents double-encoded entities like `&amp;rsquo;` in post summaries. Applied to both `.Summary` and `.Site.Params.description`.
3. **OG/Twitter title cleanup** — ✅ Fixed in `seo.html`. `og:title` and `twitter:title` use just the page title (not "Post - Site Name") since `og:site_name` already provides site context.
4. **JSON-LD structured data** — ✅ Fixed in `seo.html`. Both BlogPosting (posts) and Blog (homepage) schemas are present with proper description handling.

### Platform Fixes (Need manual action in micro.blog admin)

These can only be fixed in micro.blog's dashboard, not in the theme files:

1. **robots.txt** — The live site serves just `User-agent: *` with no sitemap directive. The local `static/robots.txt` has the correct content (`Sitemap: https://dylan.blog/sitemap.xml`) but micro.blog overrides it.

   **How to fix via micro.blog plug-in (try in order):**

   **Attempt A — Static file in plugin:**
   1. Go to **Design → Edit Custom Themes → New Plug-in**
   2. Name it something like **"Custom robots.txt"** (URL can be blank)
   3. Create a new template named **`static/robots.txt`**
   4. Set the content to:
      ```
      User-agent: *
      Allow: /

      Sitemap: https://dylan.blog/sitemap.xml
      ```
   5. Verify at `https://dylan.blog/robots.txt` — if it still shows the old content, micro.blog is overriding at the platform level. Try Attempt B.

   **Attempt B — Hugo template override:**
   1. Same plug-in (or a new one)
   2. In `config.json`, add: `{ "enableRobotsTXT": true }`
   3. Create a template named **`layouts/robots.txt`** with the content:
      ```
      User-agent: *
      Allow: /

      Sitemap: {{ "https://dylan.blog/sitemap.xml" }}
      ```
   4. If this also doesn't work, robots.txt is handled at the platform level and you'd need to contact micro.blog support.

2. **Site description** — micro.blog is setting the site description to `Follow <a href="https://micro.blog/dylannotdylan">@dylannotdylan on Micro.blog</a>.` which contains HTML. After the template fix this will render as plain text ("Follow @dylannotdylan on Micro.blog."), but ideally update the description to something like: "A pixel art blog about gaming, health, tabletop, clowning, and life adventures."

   **How to fix via micro.blog plug-in:**
   micro.blog can merge multiple themes together, so a small plug-in can override just the description without touching the main theme.

   1. Go to **Design → Edit Custom Themes → New Plug-in**
   2. Name it something like **"Custom about text"** (URL can be blank)
   3. Create a new template in the plug-in named **`config.json`**
   4. Set the content to:
      ```json
      {
        "params": {
          "description": "A pixel art blog about gaming, health, tabletop, clowning, and life adventures.",
          "itunes_description": "Your 'about me' text here. Yes, it's named badly."
        }
      }
      ```
   The `params.description` overrides the site description used in meta tags. The `itunes_description` field is the about-me text (legacy naming from micro.blog's podcast roots).

3. **Default og:image** — The live site uses `/og/default.gif` which exists on micro.blog but isn't in the local repo. Consider creating category-specific OG images or a more compelling default image for social shares. Posts should also use `images:` frontmatter for per-post OG images.

### Theme Re-Upload Checklist

To deploy the SEO fixes:
1. Zip the `theme-pixel-art/` directory
2. Go to micro.blog → Posts → Design → Edit Custom Themes
3. Upload the new zip
4. Verify by viewing page source on a post and checking:
   - Homepage title is just "dylan's blog" (not doubled)
   - Post `og:title` doesn't include " - dylan's blog"
   - JSON-LD `<script type="application/ld+json">` block is present
   - Meta description doesn't have HTML tags or `&amp;rsquo;`

---

## 🎯 Prioritized Action Items

1. **Fix HTML entity encoding in EASY mode** (bug)
2. **Re-upload theme to micro.blog with SEO fixes** (SEO - see above)
3. **Update site description in micro.blog admin** (SEO)
4. **Add search functionality** (major UX improvement)
5. **Paginate or lazy-load archive page** (performance)
6. **Add prev/next navigation on posts** (navigation)
7. **Add actual contact info to about page** (completeness)
8. **Surface RSS feed link in UI** (discoverability)
