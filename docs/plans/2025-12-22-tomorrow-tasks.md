# Tasks for December 22, 2025

## Mobile & Responsiveness
- [x] Make the design more responsive for mobile
- [x] Fix the flash/flicker when loading on mobile (moved theme detection to <head>)

## Night Mode Improvements
- [x] Create night-specific sprites (different scenes/characters for night mode)
- [x] Create night-specific background tiles
- [x] Run contrast audit on dark mode for accessibility (WCAG compliance)
- [x] Fix readability issues in dark mode

## SEO & Meta
- [x] Audit and fix meta tags across the site
- [x] Check title, description, og:image, twitter:card tags
- [ ] Create Open Graph images for social sharing (see prompts below)

---

## OG Image Prompts (1200x630px, Midjourney)

**Format for all:** `[prompt], pixel art, 16-bit SNES style, warm earthy palette, --ar 1200:630 --v 6`

### Default (Dylan's Blog branding)
```
Cozy medieval fantasy desk scene with quill pen, open leather journal, scattered pixel art icons representing gaming dice, potion bottle, clown nose, musical notes, floating around a glowing crystal ball, warm candlelight, wooden frame border, pixel art, 16-bit SNES style, warm earthy palette --ar 1200:630 --v 6
```

### Gaming
```
Retro gaming setup on wooden tavern table, glowing CRT monitor showing pixel dungeon, scattered game cartridges, dragon figurine, dice and character sheets nearby, warm torchlight atmosphere, pixel art, 16-bit SNES style, warm earthy palette --ar 1200:630 --v 6
```

### Health
```
Cozy apothecary corner with bubbling cauldron of green wellness potion, hanging herbs and dried flowers, mortar and pestle, yoga mat rolled in corner, heart-shaped health pickup floating, warm sunlight through window, pixel art, 16-bit SNES style, warm earthy palette --ar 1200:630 --v 6
```

### Tabletop
```
Epic tabletop gaming scene, detailed battle map with miniature figures, polyhedral dice scattered on parchment, dragon miniature facing knight, spell cards and rulebooks, dramatic candlelight, pixel art, 16-bit SNES style, warm earthy palette --ar 1200:630 --v 6
```

### Clown
```
Whimsical circus performer's vanity table, red clown nose on stand, juggling balls and balloon animals, face paint palette, tiny unicycle, confetti and streamers, magical sparkles, warm spotlight glow, pixel art, 16-bit SNES style, warm earthy palette --ar 1200:630 --v 6
```

### Writing
```
Romantic writer's desk in tower study, quill in inkwell, stack of leather journals, scattered parchment with pixel text, floating story characters emerging from open book, starry window view, warm candlelight, pixel art, 16-bit SNES style, warm earthy palette --ar 1200:630 --v 6
```

### Cooking
```
Cozy medieval kitchen scene, bubbling cauldron over hearth fire, hanging copper pots, fresh vegetables and herbs on wooden counter, steaming pie cooling on windowsill, recipe scroll unfurled, warm firelight, pixel art, 16-bit SNES style, warm earthy palette --ar 1200:630 --v 6
```

### Music
```
Bard's corner in fantasy tavern, lute leaning against stool, sheet music scattered on barrel table, floating musical notes with sparkle effects, tambourine and flute nearby, warm amber stage lighting, pixel art, 16-bit SNES style, warm earthy palette --ar 1200:630 --v 6
```

### Travel
```
Adventurer's map table, unfurled world map with pixel locations marked, compass and sextant, packed leather satchel, walking staff, postcards and trinkets from journeys, warm sunset through porthole window, pixel art, 16-bit SNES style, warm earthy palette --ar 1200:630 --v 6
```

### Reading
```
Cozy reading nook in fantasy library, towering bookshelves, plush armchair with open book, floating book spirits, cup of tea steaming, cat curled on ottoman, warm fireplace glow, dust motes in light beams, pixel art, 16-bit SNES style, warm earthy palette --ar 1200:630 --v 6
```

### Crafting
```
Fantasy artisan's workshop, workbench with tools and materials, half-finished wooden toy, sewing project, paint palette, glowing enchanted needle and thread, creative sparkles, warm lantern light, pixel art, 16-bit SNES style, warm earthy palette --ar 1200:630 --v 6
```

### ADHD
```
Whimsical chaotic desk scene, multiple half-finished projects, floating thought bubbles with different ideas, squirrel with acorn, scattered colorful sticky notes, hourglass with sand swirling chaotically, warm but energetic lighting, pixel art, 16-bit SNES style, warm earthy palette --ar 1200:630 --v 6
```

### Pets
```
Cozy fantasy pet corner, sleeping pixel cat on cushion, playful dog with bone, hamster wheel, fish bowl with treasure chest, bird perch, scattered toys and treats, warm afternoon sunbeam, pixel art, 16-bit SNES style, warm earthy palette --ar 1200:630 --v 6
```

### Tech
```
Fantasy inventor's workshop meets modern tech, glowing crystal computer monitor, mechanical keyboard with runes, steampunk gadgets, floating code symbols, robot companion, warm amber desk lamp glow, pixel art, 16-bit SNES style, warm earthy palette --ar 1200:630 --v 6
```

### Personal/Home
```
Cozy fantasy cottage interior, warm hearth fire, comfortable armchair, family photos in pixel frames, houseplant on windowsill, steaming mug, welcoming doorway with warm light, pixel art, 16-bit SNES style, warm earthy palette --ar 1200:630 --v 6
```

---

## Notes
- OG images go in `/static/og/` as `default.png`, `gaming.png`, etc.
- All images should be 1200x630px for optimal social sharing
- After creating images, uncomment `ogImage` in hugo.toml
