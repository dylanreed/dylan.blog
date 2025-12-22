# Dylan.blog Pixel Art Redesign

## Overview

A complete visual redesign transforming dylan.blog into a "chaos goblin VGA craftsman" aesthetic - late-era Sierra adventure game polish (King's Quest V/VI, Quest for Glory) with whimsical, personal sprite characters that reveal personality and humor.

## Core Visual Identity

### The Aesthetic
- **Style**: Late VGA Sierra adventure games - ornate, painterly pixel art with rich dithering
- **Personality**: Polished craftsmanship as foundation, chaos goblin energy in the details
- **Frame approach**: Decorative pixel art borders surround clean, readable content

### Two Worlds (Light/Dark Mode)

**Light Mode (Golden Afternoon)**
- Warm yellows, forest greens, honey-colored wood frames
- Blue sky peeking through decorative elements
- Lively sprites: birds, butterflies, sunny wizards

**Dark Mode (Candlelit Night)**
- Deep blues and purples, warm orange candlelight
- Stars in corner details, glowing gems
- Mysterious sprites: bats, owls, ghosts, wizards with lanterns

## Header System

### Home Page Header
A pixel art scene featuring an avatar in a cozy setting - at a desk with a quill, in a cluttered study, or tavern corner. The scene shifts with light/dark mode:
- **Day**: Sunlight streaming through window, warm and inviting
- **Night**: Candlelit, books casting shadows, stars visible through window

"Dylan.blog" title rendered as pixel art lettering integrated into scene.

### Post-Specific Headers
Headers transform based on post tags:

| Tag | Scene |
|-----|-------|
| Health/medical | Cluttered apothecary, potion bottles, skeleton anatomy chart |
| Tabletop gaming | Tavern table with dice, maps, tankards |
| Clowning/performance | Stage or dressing room with costumes and props |
| Tech/coding | Wizard's workshop with glowing runes and arcane machinery |
| Writing/creativity | Scriptorium with quills, ink wells, scattered manuscripts |
| Food/cooking | Fantasy kitchen with bubbling cauldrons and hanging herbs |
| Music | Bardic corner with instruments, sheet music, candles |
| Travel | Explorer's study with maps, compass, travel journals |
| Reading/books | Towering library with ladders, floating tomes, cozy chair |
| Garden/nature | Greenhouse or cottage garden with magical plants |
| Craft/DIY | Craftsman's workshop with tools, gears, works in progress |
| Default | Cozy reading nook or writing desk |

Each scene has day/night variants.

### Navigation
Nav items styled as pixel art elements - wooden signs, scroll tabs, or carved stone buttons. Hover states have subtle animations (sign swinging, gem glowing).

## Ambient Sprite System

### Behavior
- Sprites drift slowly across screen at random intervals
- Move behind content (low z-index) - never obstruct reading
- 1-3 sprites visible at any time
- New sprites enter every 30-60 seconds
- Respects `prefers-reduced-motion`

### Movement Patterns
- **Horizontal drifters**: Birds, wizards walking, clouds
- **Diagonal floaters**: Butterflies, fairies, falling leaves
- **Occasional vertical**: Bats descending, bubbles rising

### Contextual Sprite Pools

| Post Tag | Sprite Pool |
|----------|-------------|
| Health | Skeletons, potion bottles, bandaged creatures, apothecary cats |
| Tabletop | Rolling dice, miniature knights, dragons, floating spell effects |
| Clowning | Clowns, juggling balls, honking horns, balloon animals |
| Tech/coding | Wizards with laptops, magical runes, golems, enchanted tools |
| Writing | Floating quill pens, ink bottles, manuscript pages, tiny muses |
| Food | Animated cookpots, floating ingredients, chef imps, enchanted utensils |
| Music | Walking instruments, dancing music notes, tiny bards, singing birds |
| Travel | Floating maps, spinning compasses, miniature adventurers, pack mules |
| Reading | Floating tomes, bookworms, reading ghosts, library sprites |
| Garden | Walking plants, garden sprites, butterflies, magical bugs |
| Craft | Animated tools, spinning gears, crafting sprites, enchanted hammers |
| Default | Birds, bats, wandering wizards, knights, fairies |

Sprite pool combines tag-context AND time-of-day (e.g., health post at night = skeleton with candle).

## Typography & Content Area

### Philosophy
The frame is ornate, the content is readable. Chaos goblin lives in borders and sprites - blog posts stay clean.

### Typography
- **Headings**: Pixel art-style font (e.g., "Press Start 2P" or Sierra-inspired face)
- **Body text**: Clean, readable font - modern system font or pixel-friendly serif
- **Links**: Adventure game interactive styling - subtle glow, palette-appropriate colors (gold/amber day, cyan/purple night)

### Content Container
- Sits inside decorative border with comfortable padding
- Background: parchment-toned (day) or dark slate (night)
- Subtle muted texture (paper grain, stone)

### Special Elements
- **Images**: Lightbox with pixel art frame treatment
- **Blockquotes**: Styled as scrolls or stone tablets
- **Code blocks**: Magical tome pages or fantasy terminal

## Technical Implementation

### Asset Structure
- **Border frames**: 9-slice PNG sprites (corners + edges + fill) for responsive scaling
- **Headers**: Full illustrations at fixed aspect ratio
- **Sprites**: Animated GIFs or sprite sheets via canvas/CSS
- **Two complete asset sets**: Day and night variants

### Sprite Engine
Lightweight JavaScript:
- Maintains sprite object pool
- Spawns at random intervals (configurable)
- Reads post tags from page metadata
- Respects `prefers-reduced-motion`
- Pauses when tab not visible

### Theme Switching
- Respects `prefers-color-scheme` by default
- Manual toggle (pixel art sun/moon icon)
- Stores preference in localStorage
- Swaps CSS custom properties + asset URLs

### Performance
- Small sprite GIFs or CSS sprite sheets
- Border images cached
- Header images lazy-loaded
- Target: under 500KB additional page weight

### Platform
Micro.blog with custom CSS + JavaScript via theme customization. Assets on CDN or static files.

## Asset Requirements

| Asset Type | Day | Night | Notes |
|------------|-----|-------|-------|
| Home header scene | 1 | 1 | Avatar at desk/study |
| Post headers | ~12 | ~12 | All tag categories + default |
| Border frame (9-slice) | 1 set | 1 set | Corners, edges, fills |
| Nav elements | 1 set | 1 set | Buttons, hover states |
| Sprites (default) | 6-8 | 6-8 | Birds, wizards, knights, etc. |
| Sprites (health) | 4-5 | 4-5 | Skeletons, potions, etc. |
| Sprites (tabletop) | 4-5 | 4-5 | Dice, dragons, etc. |
| Sprites (clowning) | 4-5 | 4-5 | Clowns, props, etc. |
| Sprites (tech) | 4-5 | 4-5 | Wizard hackers, runes, etc. |
| Sprites (writing) | 4-5 | 4-5 | Quills, ink, muses, etc. |
| Sprites (food) | 4-5 | 4-5 | Cookpots, ingredients, chef imps |
| Sprites (music) | 4-5 | 4-5 | Instruments, bards, notes |
| Sprites (travel) | 4-5 | 4-5 | Maps, compasses, adventurers |
| Sprites (reading) | 4-5 | 4-5 | Tomes, bookworms, ghosts |
| Sprites (garden) | 4-5 | 4-5 | Plants, garden sprites, bugs |
| Sprites (craft) | 4-5 | 4-5 | Tools, gears, crafting sprites |
| UI elements | 1 set | 1 set | Toggle, lightbox frame, icons |

**Estimated total: 120-150 pixel art assets**

## Next Steps

1. Create/commission pixel art assets (can be phased - start with borders, home header, default sprites)
2. Build sprite engine JavaScript
3. Implement CSS theming system with custom properties
4. Create 9-slice border system
5. Integrate with Micro.blog theme
6. Add contextual header/sprite logic based on post tags
