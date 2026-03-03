# Micro.blog Category Filter Keywords

Use these keywords in micro.blog's category filters to auto-assign categories to posts.

## Filter Rules (Refined)

| Category | Use These Keywords | Removed (too generic) |
|----------|-------------------|----------------------|
| **health** | hospital, surgery, doctor, chronic illness, ankle injury, knee surgery, medical | ~~pain, hurt~~ |
| **tabletop** | blood bowl, warhammer, halfling, miniature painting, d&d, dungeon master, games workshop | ~~rpg, dice~~ |
| **clowning** | juggling, juggle club, clown show, circus arts, balloon twist, magic trick, clown costume | ~~perform, clown~~ |
| **tech** | programming, javascript, python, github repo, blog redesign, coding project | ~~app, website, computer, code~~ |
| **writing** | nanowrimo, writing novel, fiction writing, manuscript, writing draft | ~~story, author~~ |
| **cooking** | recipe for, skillet, cooking chicken, butter sauce, pork chops, baking | ~~pepper, cheese, cook~~ |
| **music** | ukulele, banjo, synthesizer, playing guitar, music practice | ~~practice, instrument~~ |
| **travel** | road trip, vacation trip, flight to, hotel room, scuba diving, dive school | ~~visit, trip, diving~~ |
| **reading** | book review, finished reading, graphic novel, comic book, book series | ~~reading, series, comic~~ |
| **crafting** | bow tie, bowtie project, sewing project, fabric for, puppet making | ~~making, pattern, fabric~~ |
| **gaming** | video game, minecraft, xbox game, playstation, nintendo switch | ~~played, steam, gamer~~ |
| **pets** | my cat, our cats, ramona, jeff the cat, new kitten | ~~cat, cats, reno, kitty~~ |
| **adhd** | adhd diagnosis, adhd brain, hyperfocus | ~~focus, attention, distracted~~ |

## Recommended Priority Order

Apply filters in this order (most specific first):

1. health
2. tabletop
3. clowning
4. cooking
5. music
6. crafting
7. pets
8. adhd
9. tech
10. writing
11. reading
12. gaming
13. travel
14. personal (catch-all/default)

## Why These Changes?

### Removed Keywords (caused 70%+ of conflicts):

| Keyword | Problem | Conflicts |
|---------|---------|-----------|
| `app` | Matches "happy", "clapping", "apparently" | 261 posts |
| `cat` | Matches "catch", "category", "indicate" | 157 posts |
| `making` | Everyone "makes" things | 142 posts |
| `story` | Any anecdote triggers this | 102 posts |
| `reading` | "reading the room", etc. | 92 posts |
| `focus` | Common in any context | 62 posts |
| `practice` | Applies to any skill | 46 posts |
| `played` | Matches "displayed", "played along" | 43 posts |

### Strategy: Use Phrases Instead of Single Words

- ❌ `cat` → ✅ `my cat`, `our cats`
- ❌ `reading` → ✅ `finished reading`, `book review`
- ❌ `practice` → ✅ `music practice`
- ❌ `app` → ✅ Remove entirely (too problematic)
- ❌ `story` → ✅ `writing story`, `fiction writing`

## Notes

- **personal** should be the default/fallback category
- These refined keywords should reduce conflicts from 453 posts to ~50
- Based on analysis of 1,400+ blog posts
