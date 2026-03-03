# Pixel Art Theme for Micro.blog

A whimsical pixel art blog theme with animated sprites, grass border tiles, and medieval styling.

## Features

- **Animated pixel sprites** for each post category (health, tabletop, gaming, music, etc.)
- **Custom pixel art cursors** - themed pointer and hand cursors
- **Dynamic category headers** - unique header images per category
- **Grass border tileset** framing content areas
- **Medieval typography** using MedievalSharp and Uncial Antiqua fonts
- **Category-based styling** with unique glow colors per category
- **Day/night mode toggle** with localStorage persistence
- **Clickable category tags** linking to category pages
- **Centered navigation** with pixel art signs
- **Responsive design**

## Installation

1. Go to **Posts → Design → Edit Custom Themes** in your Micro.blog dashboard
2. Click **New Theme** and give it a name
3. Upload the `theme-pixel-art.zip` file

Or install directly from the plugin directory if available.

## Categories

The theme supports these categories with unique sprites:

| Category | Sprite | Description |
|----------|--------|-------------|
| health | Skeleton | Health and wellness posts |
| tabletop | Knight | Board games and RPGs |
| gaming | Dragon | Video games |
| personal | Clown | Personal updates |
| writing | Quill | Writing and blogging |
| cooking | Cauldron | Recipes and food |
| music | Banjo | Music and instruments |
| travel | Adventurer | Travel stories |
| reading | Book | Book reviews |
| crafting | Muse | DIY and crafts |
| adhd | Donkey | ADHD-related posts |
| pets | Cat | Pet content |
| (default) | Wizard | Uncategorized posts |

## File Structure

```
theme-pixel-art/
├── layouts/
│   ├── _default/
│   ├── partials/
│   └── post/
├── static/
│   ├── background/    # Day/night backgrounds
│   ├── css/           # Stylesheets
│   ├── cursors/       # Custom cursors
│   ├── headers/       # Category header images
│   ├── sprites/       # Animated character sprites
│   └── tiles/         # Border tileset
└── config.json
```

## Credits

- Pixel art sprites generated with [PixelLab](https://pixellab.ai)
- Theme by Dylan

## License

MIT
