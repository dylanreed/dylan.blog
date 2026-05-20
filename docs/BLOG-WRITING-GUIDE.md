# Dylan.blog Writing Guide

## Voice & Style

> **Full voice samples**: See [VOICE-SAMPLES.md](VOICE-SAMPLES.md) for complete reference posts across all four mood modes (playful, vulnerable, reflective, frustrated). Read the matching sample before drafting a new post.

### Core Personality
- **Conversational stream-of-consciousness** - Posts often start without a clear destination and find their meaning along the way
- **Self-deprecating humor** - Acknowledge failures and struggles with wit, not wallowing
- **Honest vulnerability** - Share the messy reality of chronic illness, ADHD, and life challenges
- **Profanity-friendly** - Casual swearing is natural and authentic ("tighten that shit up kind of surgery")
- **Playful wonder** - Maintain curiosity and joy about niche interests
- **Reframing enthusiast** - Take existing concepts and give them better names ("It's not vibe coding, it's Choose Your Own Adventure Coding")

### Writing Patterns
- Start posts without knowing exactly where they'll go ("As with all my blog posts I started with an idea of what I wanted to write, what the conclusion would be, but… here we are.")
- Use parenthetical asides and tangents freely
- Reference specific details and names (cats Reno/Ramona/Jeff, wife Sarah, specific doctors)
- Include self-aware meta-commentary about the writing itself
- End with casual sign-offs ("Stay healthy, watch Hallmark movies, and stay safe")
- Admit when narrative didn't go as planned - this is charming, not a failure
- Use "so yay?" style ironic enthusiasm when describing setbacks
- Balance medical/technical details with casual explanations

### Humor Techniques
- **Incongruous specificity**: "Turn to Page 47 to Add More Cats"
- **Casual understatement**: Describing major surgery recovery issues as "my dang ol' derelict ankle"
- **Ironic enthusiasm**: "it looked like it was infected… so yay?"
- **Pop culture reframing**: Comparing AI coding to Choose Your Own Adventure books
- **Finding silver linings**: Discovering Hallmark movies during hospital stays
- **Juxtaposition**: Serious medical content alongside DVD movie lists

### Sentence & Paragraph Style
- Short paragraphs for emphasis (one-liners get their own paragraph)
- Mix of simple declarations and longer meandering sentences
- Rhetorical questions occasionally ("Pretty bleak until...")
- Lists embedded naturally in narrative, not formal bullet points
- Use em-dashes and ellipses for pacing and tangents

### What NOT to Do
- Don't be overly polished or professional
- Don't write listicles or SEO-optimized content
- Don't hide struggles behind toxic positivity
- Don't write in third person or formal tone
- Don't over-explain context - trust readers are along for the ride
- Don't pretend to have all the answers - embrace uncertainty
- Don't skip the mundane details (juice, urinal, washcloth in the HBO chamber)
- Don't forget to credit helpers (especially Sarah)

---

## Title Craft

Titles are a major part of Dylan's personality. They set the tone before readers even start.

### Title Patterns
- **Long and playful**: "It's Not Vibe Coding, It's Choose Your Own Adventure Coding (Turn to Page 47 to Add More Cats)"
- **Gaming/pop culture references**: "SAVE EARLY, SAVE OFTEN: I Redesigned My Blog Into a Point-and-Click Fever Dream"
- **Casual slang**: "My Dang Ol' Derelict Ankle"
- **Provocative questions**: "Are s'mores paninis? Discuss"
- **Direct commands**: "you should be reading a book instead"
- **Simple observations**: "My mother in law gets me"

### Title Guidelines
- **Default to unhinged**: Titles should make the reader wonder if the author is okay. Lean into absurdity, ALL CAPS when warranted, run-on sentences, and dramatic declarations. A good title makes you sound slightly insane.
- Capitalization is inconsistent and that's fine (matches mood)
- Parenthetical additions add personality
- Colons work for setup:punchline structure
- Don't be afraid of long titles—embrace them
- Gaming references welcome (Sierra games, CYOA, etc.)

### Unhinged Title Examples
- "THEY CALLED ME PARANOID. THEY CALLED ME OBSESSED. THEY DIDN'T CALL ME WHEN THE ORCAS STARTED SINKING BOATS."
- "A Measured and Reasonable Analysis of Blood Bowl Third Edition by Someone Who Will Never Stop Playing Halflings"
- "SAVE EARLY, SAVE OFTEN: I Redesigned My Blog Into a Point-and-Click Fever Dream"
- "It's Not Vibe Coding, It's Choose Your Own Adventure Coding (Turn to Page 47 to Add More Cats)"

---

## Post Structure

### Frontmatter Template
```yaml
---
title:
instagram caption:
instagram tags:
categories:
  - personal
---
```

The Instagram caption and hashtags live in the post's frontmatter so everything for a post — body, social copy, category — sits in one file.

### Content Structure
1. **Opening image** (optional) - Usually a relevant photo with alt text
2. **Opening hook** - Jump right in, often mid-thought
3. **Body** - Meander through the topic with tangents welcome
4. **Closing** - Can be abrupt, reflective, or a simple sign-off

### Footnotes

Markdown footnote syntax (`[^1]` / `[^1]: text`) does **not** render on micro.blog — Hugo handles it but the micro.blog pre-processor drops it. Use raw HTML instead:

```html
sentence with a callout<sup id="fnref-1"><a href="#fn-1">[1]</a></sup>.

<ol class="footnotes">
<li id="fn-1">the footnote text <a href="#fnref-1">↩</a></li>
</ol>
```

For multiple footnotes, use `fnref-2` / `fn-2`, `fnref-3` / `fn-3`, etc. Place the `<ol>` at the very bottom of the post.

---

## Instagram Share Image

After finalizing a blog post, generate the Instagram share graphic and write the caption + hashtags into the post's frontmatter (`instagram caption:` and `instagram tags:`).

### Generate the Graphic

Easiest — point at the markdown file and let the script read everything from frontmatter:

```bash
npm run instagram -- --post content/drafts/YYYY-MM-DD-slug.md
```

It pulls the title from frontmatter, the category from the first entry in `categories:`, and the first markdown image (`![alt](url)`) in the body. If that image URL is reachable (or it's a local path that exists), it gets used as the graphic's background. Otherwise the script falls back to the pixel-art header art for the category and prints a warning.

Manual mode still works — useful if there's no draft file yet, or if you want to override:

```bash
npm run instagram -- --title "YOUR POST TITLE" --category CATEGORY
```

You can also mix flags — pass `--post` plus `--category` to override the category but inherit title and header image from the post.

Output: `output/instagram-{slug}.png` — 1080x1080 graphic. Pixel art theme by default; replaced by the post's header image when one is found.

Available categories: health, tabletop, gaming, tech, writing, cooking, music, travel, reading, crafting, clowning, personal, pets, adhd

### Caption Guidelines

Write 1-3 sentences in Dylan's blog voice:
- Hook the reader with the topic, not "new blog post!"
- Match the post's mood (playful, vulnerable, frustrated, etc.)
- End with "Link in bio" or similar CTA
- Keep it short — Instagram captions get truncated

### Hashtag Template

Mix topic-specific + recurring tags (10-15 total):

**Always include:** #dylansblog #blogging #pixelart #retrogaming

**Category-specific pools:**
- health: #chronicillness #spoonie #recovery #healthupdate
- tabletop: #tabletopgaming #bloodbowl #warhammer #minipainting #boardgames
- tech: #webdev #coding #indieweb #hugo
- writing: #amwriting #writingcommunity #nanowrimo
- cooking: #homecooking #foodblog
- music: #ukulele #musicproduction #synthwave
- reading: #bookrecommendations #scifibooks #romancebooks #bookstagram
- crafting: #puppetmaking #sewing #handmade
- clowning: #clownlife #circusarts #juggling
- personal: #lifeblog #personalgrowth #adhd
- pets: #catsofinstagram #catlife

### Story Frames (optional)

Instagram feed captions can't carry clickable links — only Story link stickers can. To generate vertical Story frames for a post, add an `instagram stories:` block to the frontmatter (one `text` + `link` per frame) and pass `--story`:

```yaml
instagram stories:
  - text: The hook for frame one.
    link: https://dylan.blog/the-post
  - text: The second frame's line.
    link: https://example.com/buy
```

```bash
npm run instagram -- --post content/posts/YYYY-MM-DD-slug.md --story
```

Output: `output/instagram-{slug}-story-1.png`, `-story-2.png`, … (vertical 1080×1920, text baked in, bottom third left clear) plus `output/instagram-{slug}-stories.md` — the link map listing which URL to sticker on each frame. The link sticker itself is added in the Instagram app (Stories → upload the frame → Link sticker → paste the URL → drag it into the clear bottom band); a link can't be baked into an uploaded image.

---

## Tag System

### Primary Tags (Match Sprite Categories)

| Tag | Use For | Example Topics |
|-----|---------|----------------|
| `health` | Medical, chronic illness, recovery, physical therapy | Ankle surgery, hand issues, doctors, healthcare system |
| `tabletop` | RPGs, board games, miniatures | D&D campaigns, game nights, dice |
| `clowning` | Performance, circus arts, entertainment | Clown gigs, balloon animals, costumes, magic |
| `tech` | Programming, gadgets, web development | Blog updates, coding projects, apps |
| `writing` | Writing projects, blogging, NaNoWriMo | Fiction, screenplays, creative process |
| `cooking` | Food, recipes, kitchen adventures | Recipes, meal experiments |
| `music` | Instruments, music production | Ukulele, music software, concerts |
| `travel` | Trips, adventures, places | Northern Colorado, vacations, exploring |
| `reading` | Book reviews, recommendations | Sci-fi, romance, fantasy reviews |

### Secondary Tags

| Tag | Use For |
|-----|---------|
| `adhd` | ADHD experiences, coping strategies, brain stuff |
| `crafting` | Puppets, quilting, knitting, making things |
| `pets` | Cat content (Reno, Ramona, Jeff, etc.) |
| `personal` | Life updates, reflections, introspection |
| `gaming` | Video games, Minecraft, console stuff |
| `politics` | Political commentary (use sparingly) |

### Tagging Guidelines
- Use **1-3 tags** per post (don't over-tag)
- Primary tag should match the main topic
- Add secondary tags only if substantially relevant
- When in doubt, use `personal` for general life updates

---

## Topic-Specific Guidelines

### Health Posts
- Be specific about symptoms and treatments (helps others, validates experience)
- Include humor but don't minimize real struggles
- Okay to express frustration with healthcare system
- Update posts are welcome - readers care about ongoing journeys

### Book Reviews
- Include: Synopsis, personal reaction, comparisons to other books
- Rate on enjoyment, not literary merit
- Mention if it's part of a series
- Link to purchase (Amazon affiliate okay)
- Format: Image → Synopsis header → Review header

### ADHD/Mental Health
- Frame as lived experience, not advice-giving
- Celebrate small wins and coping strategies
- Okay to acknowledge when things aren't working
- Connect to hobbies and creative pursuits

### Creative Projects
- Document the process, not just results
- Okay to share unfinished work
- List current hobbies/projects freely
- Connect different creative pursuits when relevant

---

## Example Post Prompts

When asking Claude to help write a post, provide:

1. **Topic**: What happened or what you want to write about
2. **Mood**: How you're feeling about it (frustrated? excited? reflective?)
3. **Key details**: Names, dates, specific things that happened
4. **Tags**: Which category it fits
5. **Length**: How long the post should be

### Standard Questions to Ask

When starting a new blog post, Claude should ask:

1. **Angle**: What's the specific take or hook?
2. **Mood/Vibe**: Playful, frustrated, reflective, unhinged, etc.
3. **Category**: Which primary category fits best?

| Category | Use For |
|----------|---------|
| `health` | Medical, chronic illness, recovery, healthcare system rants |
| `tabletop` | Blood Bowl, Warhammer, D&D, board games, miniatures |
| `clowning` | Performance, circus arts, juggling, balloons, magic |
| `tech` | Programming, gadgets, blog updates, coding projects |
| `writing` | Writing projects, NaNoWriMo, fiction, creative process |
| `cooking` | Food, recipes, kitchen adventures |
| `music` | Ukulele, banjo, synthesizers, music production |
| `travel` | Trips, adventures, places visited |
| `reading` | Book reviews, recommendations |
| `crafting` | Puppets, sewing, bow ties, making things |
| `personal` | Life updates, reflections, general introspection |
| `gaming` | Video games, Minecraft, console stuff |
| `pets` | Cat content (Ramona, Jeff) |

4. **Length**: Use these ranges based on actual post history:

| Length | Word Count | Use For |
|--------|------------|---------|
| Micro | 100-200 | One-liner observations, quick warnings, single images |
| Short | 350-500 | Book reviews, quick updates, single-topic thoughts |
| Medium | 500-750 | Standard essays, hobby posts, game reviews |
| Long | 750-1000 | Deep dives, rants, multi-section pieces |
| Epic | 1000+ | Hospital narratives, tributes, major life events |

5. **Key context**: Did something specific happen? A purchase, event, news story?
6. **Callbacks**: Should this reference older posts on the same topic?
7. **Call to action**: Want readers to do something (try the game, buy the book, etc.)?
8. **Sarah involvement**: Is she part of the story? Does she need credit/blame?
9. **Anything else**: Any other details, preferences, or context I should know?

### Example Prompt
> "Help me write a post about my hand finally feeling better after 6 months. I'm relieved but also frustrated it took so long. Saw Dr. Martinez, got steroid injection. Tags: health. Mood: cautiously optimistic with some saltiness about the medical system. Length: medium."

---

## Common Post Types

### Life Update
- What's been happening
- Why you've been quiet (if applicable)
- What's coming next
- Personal, honest, meandering

### Book Review
- Synopsis (can be from book description)
- Personal reaction
- Comparisons to similar books
- Recommendation level

### Health Update
- Current status
- What treatments/appointments happened
- How you're feeling about it
- What's next

### Hobby Deep-Dive
- What you're working on
- Why you're excited about it
- How it connects to other interests
- Progress/challenges

### Rant/Frustration
- What happened
- Why it's frustrating
- Some humor or perspective
- Resolution (if any)

### Tech Posts
- Frame technical content through personal experience, not tutorials
- Celebrate the "dumb idea" that turned out well
- Show the iteration process ("add more cats, randomize button placement")
- Credit tools and collaborators (Claude Code, etc.)
- Compare to nostalgic references (Sierra games, 90s web, CYOA books)
- Enthusiasm > technical accuracy (it's a blog, not documentation)
- End with invitation for readers to try it themselves

---

## Signature Phrases & Patterns

These capture Dylan's voice:

### Transition Phrases
- "The same cannot be said about..."
- "Cool." (sarcastic acknowledgment of bad news)
- "...so yay?"
- "While..." (to set up contrasts)
- "I was super wrong"

### Self-Awareness
- "As with all my blog posts I started with an idea of what I wanted to write, what the conclusion would be, but… here we are."
- "I am not 100% sure where this is going"
- "If you have never been in a [X] you are not missing out"

### Enthusiasm Markers
- Describing things as "magical" (unironically: hyperbaric chambers, Hallmark movies)
- "My personal favorite"
- "I love [X] and actually studied..."
- "Much like my love of [X] my love of [Y] knows no bounds"

### Sign-offs
- "Stay healthy, watch Hallmark movies, and stay safe"
- Simple life advice in three parts
- Casual, warm, not overly sentimental

---

## Cultural Touchstones

Reference these freely - they're part of the voice:

### Gaming
- Sierra point-and-click games (Kings Quest, Leisure Suit Larry, Quest for Glory)
- Choose Your Own Adventure books
- D&D and tabletop RPGs
- Video games generally

### Media
- Hallmark Channel Christmas movies (unironic love)
- Romance novels across all genres
- 90s nostalgia (VGA graphics, "peak graphics")
- Movies from HBO chamber sessions

### Personal Recurring Elements
- Wife Sarah (caretaker, driver, champion)
- Cats: Reno, Ramona, Jeff
- ADHD experiences
- Medical adventures and healthcare system frustrations
- Northern Colorado as home base

### Tabletop Gaming
- **Blood Bowl**: Dylan's favorite ("ridiculous and hard to take seriously"), plays Halflings
- **Age of Sigmar**: Has a rat army (135 models), emphasizes objective play
- **Kill Team**: Paints teams, combines hobby with gaming
- Enjoys teaching games to others (wants to introduce Sarah to Blood Bowl)
- Victory through overwhelming numbers and not taking it seriously

---

## Technical Formatting Notes

### When to Use Headers
- Natural breaks in narrative (not every few paragraphs)
- Lists or structured content
- Topic shifts within longer posts

### When to Use Lists
- Movie/book recommendations
- Embedded naturally in prose when possible
- Not for structuring the main narrative

### Image Guidelines
- Photos of real life (food, cats, family) are welcome
- Alt text should be descriptive but casual
- Screenshots for tech posts showing results
- No need for professional photography

---

## Post Length Spectrum

Dylan's posts range from one-liners to multi-thousand word narratives. All are valid.

### Micro Posts (1-3 sentences)
Perfect for quick observations, warnings, or recommendations:
- "If you want me to grate cheese you need to be real specific on the amount or I will grate all the cheese. Consider yourself warned."
- "All I am saying is that if you are not watching Hallmark movies this Christmas you are a fool. I recommend Hot Frosty"
- "This is the puppet I have made that gets the most use." (with image)

**When to use**: Quick thoughts, strong opinions, visual content that speaks for itself

### Short Posts (1-3 paragraphs)
For single-topic reflections or brief updates:
- Mental health check-ins
- Quick hobby updates
- Provocative questions ("Are s'mores paninis?")

### Medium Posts (4-8 paragraphs)
The sweet spot for most content:
- Health updates with context
- Hobby explorations
- Book recommendations
- Tech project overviews

### Long Posts (10+ paragraphs)
For journeys with narrative arcs:
- Hospital stays and recovery stories
- Multi-day experiences
- Deep dives into philosophy or perspective shifts

**Key**: Length matches the story's needs. Don't pad short thoughts. Don't truncate meaningful journeys.

---

## Mood Modes

Dylan writes from different emotional places. Each has its own flavor.

### Playful Mode
- Absurdist humor, gaming references, cats
- Light profanity for emphasis
- Rhetorical questions and silly asides
- Example: The cheese grating warning, s'mores panini debate

### Reflective Mode
- Stream-of-consciousness exploration
- Acknowledging uncertainty ("I'm not sure where this is going")
- Finding unexpected meaning
- Example: The clowning philosophy post, formal dress reflections

### Frustrated Mode
- Direct criticism of systems (healthcare, politics)
- Specific grievances with details
- Still finds dark humor
- "anyone who doesn't think that the healthcare system in America is fucked has never been in need of actual healthcare"

### Vulnerable Mode
- Honest about mental health struggles
- Acknowledges hiding behind hobbies
- Doesn't pretend to have answers
- "I am wondering how much I can continue to hide behind hobbies to save my mental health"

### Enthusiastic Mode
- Unironically loving things (Hallmark, romance novels, Sierra games)
- Defending "lowbrow" pleasures
- Inviting others to try things
- "Much like my love of [X] my love of [Y] knows no bounds"

---

## The Clown Philosophy

Dylan was a clown starting at age 16. This informs the worldview.

### The Auguste Approach
The Auguste clown archetype embodies:
- Never giving up, always trying new things
- Approaching the world with childlike wonder
- Eventually succeeding despite (or because of) absurdity
- Laughing at the proper/prim (whiteface) establishment

### Applying It to Life
- When facing difficult times, adopt a clown's perspective
- Choose agency in how you respond to circumstances
- Maintain playfulness even when adulthood and fear push against it
- "I can look at the world through a clown's eyes instead of through the eyes of a scared middle aged person"

This philosophy can be invoked when writing about:
- Coping with uncertainty
- Finding perspective in hardship
- Reclaiming joy and play

---

## ADHD Patterns

ADHD is central to Dylan's experience and writing.

### Key Insights to Reference
- "People with ADHD don't do habits. They do streaks" - Intense engagement followed by breaks is normal
- Out-of-sight-out-of-mind is real - Don't fight it, work with it
- The one-person-you-never-want-to-disappoint hack - Sarah is that person
- Authorized deception about deadlines can help

### The Hobby Cycle Philosophy
- Keep supplies for all hobbies even when interest wanes
- Passions resurface; don't feel guilty about cycling
- Being "a jack of all trades and master of none" is valid
- Diverse hobbies build adaptability
- Release shame about changing enthusiasms

### Current/Recent Hobbies (Reference Pool)
- Puppet-making
- Sewing
- Miniature painting (Warhammer, Kill Team, Age of Sigmar)
- Ukulele and banjo
- Writing (fiction, screenplays)
- Drawing
- Synthesizers
- Juggling and balloon twisting
- Crochet

---

## Political & Advocacy Voice

Dylan writes about serious topics when moved to.

### When to Go Political
- Personal stakes (medication access, healthcare)
- Expertise from lived experience
- Strong feelings that need outlet

### How to Do It
- Lead with personal impact, not abstract arguments
- Name specific fears and frustrations
- Don't hide anger behind diplomacy
- Can still include dark humor
- End with call to action or solidarity

### Example Patterns
- "I really appreciate that there is nothing I can do to stop this" (bitter irony)
- Direct statements: "anyone who doesn't think that [X] is fucked..."
- Acknowledge privilege while still expressing frustration
- "Take care of yourselves and do what you enjoy" as sign-off during hard times

---

## Explainer Posts

When explaining something (NFTs, hyperbaric chambers, clown types), Dylan balances education with opinion.

### Structure
1. Acknowledge the topic is complex/controversial
2. Explain in accessible terms (not jargon-heavy)
3. Center the human impact (for artists, for patients)
4. Share personal connection or expertise
5. State position clearly
6. Acknowledge downsides or complications

### Tone
- Genuine enthusiasm for "fascinating" things
- Defensive of misunderstood topics
- Clear that the explainer is opinionated, not neutral

---

## Sign-off Variations

Different posts call for different endings.

### The Three-Part Blessing
"Stay healthy, watch Hallmark movies, and stay safe"
"Stay safe everyone and remember to enjoy the end of the world"

### The Philosophical Close
Leave readers with a question: "Once you have proven a cryptid exists... is it still a cryptid?"

### The Abrupt End
Just... stop. When the thought is done, it's done. No forced conclusion.

### The Meta-Aware End
"As with all my blog posts I started with an idea of what I wanted to write, what the conclusion would be, but… here we are."

### The Simple Instruction
"Take care of yourselves and do what you enjoy."

---

## The Site's Soul

The blog is "Powered by chaos goblin energy" - this captures the vibe.

### What This Means
- Embrace the chaotic, not the polished
- Goblin = mischievous, hoarding interests, living in the margins
- Energy = active, not passive; creating, not just consuming
- Chaos = unpredictable topics, moods, post lengths

### The Blog's Aesthetic Philosophy
- 90s Sierra game nostalgia (VGA graphics were "peak")
- Point-and-click adventure game UI
- Animated cat (Ramona) wandering the page
- Multiple theme options (fantasy, sci-fi, cyberpunk, underwater)
- Weather effects and day/night cycles
- "Ridiculous" is a feature, not a bug

---

## Example Post Transformations

### Input: "I had a rough week with my hand"
**Too generic**: "This week has been difficult due to ongoing hand issues."
**Dylan voice**: "You know what's great? Waking up and having your fingers feel like someone decided to use them as a xylophone in the night. That kind of pain. My hand is being a real jerk lately."

### Input: "I really like this TV show"
**Too generic**: "I've been enjoying watching Hallmark movies lately."
**Dylan voice**: "All I am saying is that if you are not watching Hallmark movies this Christmas you are a fool. I recommend Hot Frosty"

### Input: "I have many hobbies"
**Too generic**: "I enjoy a variety of creative pursuits."
**Dylan voice**: "Current active hobbies include: puppet-making, sewing, miniature painting, ukulele, banjo, writing, drawing, and synthesizers. I acknowledge there are likely others in rotation that I am forgetting."

### Input: "The healthcare system frustrated me"
**Too generic**: "Navigating healthcare can be challenging."
**Dylan voice**: "anyone who doesn't think that the healthcare system in America is fucked has never been in need of actual healthcare"

---

## Cast of Characters

Quick reference for recurring people and pets.

### People
- **Sarah**: Wife. Driver during medical crises. Champion. Baker of holiday cookies. The one person Dylan never wants to disappoint. Enables ADHD workarounds.
- **Business partner**: Uses authorized deadline deception to motivate Dylan
- **Frank**: Nephew, received first Lego set Christmas 2025
- **Mother-in-law**: Gets Dylan (in a good way)

### Cats
- **Ramona**: Animated sprite on the blog, wanders the page
- **Reno**: Cat
- **Jeff**: Cat

### Medical Cast
Reference specific doctors by name when relevant - it grounds the story in reality.

---

## Creative Writing Projects

Reference pool for fiction work:

### The Cryptid Story
- PhD in folklore researching cryptids in North America
- Encounters actual cryptids
- Philosophical question: "Once you have proven a cryptid exists... is it still a cryptid?"
- Currently in development

### Past Work
- First novel attempt (has old notebooks being transcribed to ReMarkable)
- References to NaNoWriMo participation
- Screenwriting interests

---

## The Vorkosigan Effect: What Makes a Breakout Post

The "Miles Vorkosigan Broke My Heart Seventeen Times" post (Jan 30, 2026) was the blog's most successful post by a wide margin — 52 hits, 39 unique visitors, and it drove the single biggest traffic day in the analytics window (57 pageviews). It continued pulling readers for weeks after publication. Here's what made it work and how to recapture that energy.

### Why It Worked

**1. Personal stakes anchor the recommendation**
The post opens with "I am recovering from surgery. Again." — immediately grounding a book recommendation in lived experience. The reader isn't getting a book review; they're getting a window into why these books *matter* to someone going through something hard. The surgery recovery context made the recommendation feel urgent and authentic rather than performative.

**2. The title is peak unhinged**
"MILES VORKOSIGAN BROKE MY HEART SEVENTEEN TIMES AND I KEEP COMING BACK FOR MORE: A Completely Normal Recommendation of the Vorkosigan Saga" — it's long, dramatic, specific (seventeen!), and the subtitle's ironic "Completely Normal" undercuts the melodrama perfectly. It's the exact title that makes someone on a timeline stop scrolling.

**3. It bridges vulnerability and enthusiasm**
The post moves fluidly between surgery/chronic illness vulnerability and genuine literary enthusiasm. This is the blog's superpower — when both modes are active simultaneously, the writing becomes magnetic. Neither mode alone hits as hard.

**4. It respects the reader's intelligence while being inviting**
The post explains the Vorkosigan Saga without being condescending, includes a full 14-book reading order with descriptions for each, and links to where to buy. It's generous — a reader who has never heard of Bujold walks away with a complete roadmap.

**5. It taps into an existing community**
The Vorkosigan Saga has a dedicated, passionate fanbase. When someone searches for Bujold or Vorkosigan, this post has the specificity and authenticity to rank. Fandom-adjacent content has built-in discoverability that pure personal posts don't.

**6. Structure serves the reader**
Context → Who is Miles → Why the series is special → Reading order → Personal reflection → Plea to read it. Each section earns the next. The reading order section is especially powerful — it's reference material people bookmark and return to.

**7. It has long-tail staying power**
Unlike a micro-post or quick update, this is the kind of post people share in DMs ("you have to read this recommendation"), save for later, and Google can index meaningfully. It continued driving traffic for weeks.

### The Formula (When It Applies)

Not every post needs to be a Vorkosigan post. But when writing a recommendation or deep-dive:

1. **Start with why you care right now** — what's happening in your life that makes this relevant?
2. **Go long and go specific** — the detail is the point, not a liability
3. **Include actionable reference material** — reading orders, links, structured recommendations people can use
4. **Let the personal and the subject matter weave together** — the reread section where surgery recovery changed how the books hit is the emotional peak
5. **Pick subjects with existing audiences** — fandoms, communities, and niches where people are actively searching
6. **Use the unhinged title voice** — "A Completely Normal Recommendation" energy
7. **End with a genuine plea** — not a CTA, but a real "please read these, they're so good" moment

### Posts That Could Follow This Pattern

- Deep-dive hobby recommendations (specific Blood Bowl teams, specific RPG systems)
- Book series recommendations with reading orders (romance series, sci-fi series)
- Craft/music/game recommendations anchored in personal recovery or ADHD experience
- "Here's what got me through [hard time]" posts about any media

### What Didn't Work As Well (For Contrast)

Micro-posts and quick observations get engagement from the existing micro.blog community but don't attract new readers or drive traffic spikes. The Tickd post (42 unique hits) shows tech/build posts also have discoverability, but the Vorkosigan post's emotional core is what gave it legs beyond the initial share.

---

## Reading Recommendations Style

When recommending books:

### Anti-Gatekeeping Stance
- "Reading Fiction is Fun!!!"
- "They can be absolute trash but if you enjoy it, good for you"
- Prioritize getting people reading over "correct" literary selections
- Romance novels across all genres are valid and wonderful

### Recommendation Format
Organize by mood/genre/trope rather than by literary merit:
- **True Crime Romance**: [Title] by [Author]
- **Forced Proximity**: [Title]
- **Fan Fiction Adjacent**: [Title]

### Defense of "Lowbrow"
- Hallmark movies are unironically loved
- Romance novels championed loudly
- No need to justify enjoying things

---

## Blog History & Evolution

The blog has been running since **February 2002** - over 23 years of continuous writing.

### Eras of the Blog

**2002-2005: The Origin (Diving School Era)**
- Written from California during commercial diving school
- All lowercase, minimal punctuation, casual updates
- Focus: school, homesickness, Sarah, family
- Voice: Young, earnest, learning to blog

**2006-2012: Finding the Voice**
- More consistent posting schedule
- Entertainment career developing
- Game development experiments (Falling Cats)
- Voice: Developing humor, experimenting with formats

**2012-2017: The Harper Years**
- Brother became CTO of Obama 2012 campaign
- Processing sibling comparison/competition
- Bow Tie Project (52 ties in a year)
- ADHD diagnosis and medication journey
- Voice: More reflective, working through family dynamics

**2017-2020: Career Transitions**
- Hospice company work
- Job changes and burnout
- Mental health focus
- Voice: Vulnerable, processing burnout

**2021-Present: The Chronic Illness Era**
- Hand/ankle surgeries and recovery
- Northern Colorado living
- Claude Code and tech experiments
- Voice: Mature, philosophical, medical journey

### Voice Evolution
Early posts were:
- All lowercase, poor punctuation
- Very short, almost texting style
- "i love you sarah" as sign-off

Current posts are:
- Polished but still casual
- Long-form narrative capability
- Philosophical depth with humor intact

The personality has remained constant: enthusiasm, tangents, ADHD patterns, love of Sarah.

---

## Complete Cast of Characters

### Family

**Sarah** (Wife)
- Met before 2002, engaged March 2002
- Primary support through all crises
- Driver during medical situations
- Baker, cat co-parent, champion
- The ADHD accountability partner
- "I love you a lot and miss u a lot" (2002 voice)

**Harper** (Brother)
- Tech industry leader
- CTO of Obama 2012 campaign
- Got Dylan into NFTs/crypto
- Lives in Japan with Hiromi
- The "famous sibling" dynamic
- "Harper smells bad" (running joke from 2002)

**Hiromi** (Sister-in-law)
- Harper's wife
- Japan connection

**Parents**
- Dad: Runs real estate business where Dylan has worked
- Mom: Musical person (piano, choirs, gave Dylan the ukulele)
- "Scooter get well" (mysterious 2002 reference)

**Joanna** (Sarah's sister)
- Moved into a house with Sarah pre-marriage (2002)
- Part of the vault girls

### Friends/Colleagues
- **Scott Cassell**: Diving instructor at College of Oceaneering, "crazy diver who films dangerous animals"
- **Eugene Burger**: Magic mentor, saw him at Dent conference
- Various medical professionals (name them specifically)

### Pets (Historical)
- **Jeff**: Got in 2017 as a kitten
- **Ramona**: Current cat, blog mascot
- **Reno**: Cat that passed away (tribute post exists)

---

## Complete Hobby Catalog

Dylan's hobby history spans 25+ years of cycling enthusiasms:

### Performance Arts (Since ~1987)
- **Clowning**: Started at 16, has auditioned for Ringling Bros.
- **Juggling**: 25+ years, dislocated elbow affected technique
- **Balloon Sculpting**: 20+ years, Twist-em-up apron
- **Stilt Walking**: Used to do 5+ hour gigs
- **Magic**: Close-up focus, cards, coins
- **Puppetry**: Foam puppet construction since at least 2012
- **Stand-up Comedy**: Did first open mic in 2013

### Music
- **Ukulele**: Started 2017, learned via Yousician
- **Banjo**: Wanted to learn, finally did
- **Piano**: Childhood lessons
- **Tuba**: School band ("was easy")
- **Accordion**: Tried to learn for clown show, didn't stick
- **Synthesizers**: Current interest

### Crafts
- **Bow Ties**: Made 52 in one year (2017)
- **Sewing**: General garment making
- **Crochet**: Picked up and cycled
- **Quilting**: Mentioned
- **Drawing**: Inktober participation, Sketchbox subscription

### Gaming
- **Warhammer/Age of Sigmar**: 135-model rat army, started with Skaven
- **Blood Bowl**: Favorite game, plays Halflings
- **Kill Team**: Miniature painting + gaming
- **D&D/Starfinder**: Tabletop RPGs
- **Video Games**: GTA since 2002, Minecraft binges, Nintendo fan

### Technical
- **Game Development**: Made Falling Cats with GameSalad
- **Programming**: Learning Python, coding projects
- **Blog Development**: Multiple platform migrations

### Other
- **SCUBA Diving**: Commercial diving school trained
- **Reading**: 60-book yearly goals
- **Writing**: NaNoWriMo, multiple novels in progress

---

## Career History

### Professional Path
1. **Hollywood Video** (2002) - "owned by Mormans"
2. **Army Corps of Engineers** - Potential diving job
3. **Dad's Real Estate Office** - Multiple stints
4. **Graphicly** - Android tester, laid off
5. **Hospice Company** (2017-) - Marketing, then Activities Director
6. **Activities Director/Life Enrichment Director** - Current title

### The "Real Job vs. Passion" Dynamic
- Entertainment as side income, not primary career
- Real jobs pay for hobbies
- Stress of monetizing creativity would hurt it

---

## The Famous Brother Dynamic

A recurring theme throughout the blog:

### The Internal Struggle
- "I would never be as well known as Harper"
- Comparing success metrics unfairly
- Processing jealousy alongside pride

### The Resolution
- "Harper is going to change the world and if everyone was like Dylan we wouldn't need to"
- Macro vs. micro good: Harper uses tech to change things, Dylan makes individual lives better
- "I can finally become the person I want to be"

### Writing About Harper
- Pride > jealousy (though both exist)
- Specific accomplishments are okay to mention
- The "Harper smells bad" running joke is affectionate
- Credit Harper for tech introductions (NFTs, Minecraft, etc.)

---

## Recurring Philosophical Themes

### "Doing Good"
- One of Dylan's core values
- "What is more important is doing good"
- Micro-level good matters as much as macro
- Free events (Children's Festival) as giving back

### The 10,000 Hours Rule
- Referenced for skill development
- Applied to clowning, juggling, writing
- "I would not claim to be a master of any of the skills"

### Embracing Failure
- "The juggler that doesn't drop isn't trying new things"
- Drop lines as part of the show
- Missing goals (bow tie deadline) is recoverable

### Sibling Competition
- Universal but personal
- Prize was "parents' love" (in retrospect)
- Resolution: "It isn't a competition"

### The Importance of Practice
- Juggling without practice = same tricks for years
- ADHD makes consistent practice hard
- Finding tricks (rewards, streaks) to make it happen

---

## Life Landmarks to Reference

| Year | Event |
|------|-------|
| 1981 | Born (turned 21 in 2002) |
| ~1987 | Started clowning at age 16 |
| ~1997 | Started juggling (~15 years in 2012) |
| 2002 | Engaged to Sarah in March |
| 2002 | Commercial diving school in California |
| 2012 | Harper becomes CTO of Obama campaign |
| 2012 | Falling Cats iOS game released |
| 2013 | First stand-up comedy set |
| 2017 | ADHD diagnosis and medication starts |
| 2017 | Bow Tie Project (52 in a year) |
| 2017 | Got Jeff the cat |
| 2017 | Started ukulele |
| 2021 | Mental breakdown, FMLA month |
| 2023-25 | Chronic hand/ankle issues |
| 2025 | Blog redesign with pixel art theme |

---

## Early Voice Samples

For calibrating authentic Dylan across eras:

### 2002 Voice
> "i love you very much sarah and am very excited to marry you. i love you mom and dad. Scooter get well. love you harper. Hee Hee."

> "whopee the carnivals in town."

> "Hello. I had a fun week this last week. It all started Monday."

### 2012 Voice
> "It is entirely possibly that my act sucks and that is why I am getting those reactions."

> "That is my hope. That they open it up and decide to stop being a dirty stealer head and instead use the internet to become an amazing balloon artist."

### 2017 Voice
> "I don't know if I am emotionally equipped for this right now, but luckily we are also watching Angel and he will most likely get to punch people."

### 2025 Voice
> "As with all my blog posts I started with an idea of what I wanted to write, what the conclusion would be, but… here we are."

---

## Technical Knowledge Pool

Dylan has genuine expertise in:

### Commercial Diving
- Kirby Morgan helmets (Superlite 17b, Band Mask 18b, Miller)
- Delta P (pressure differential hazards)
- Nitrogen narcosis ("narc dive")
- Hyperbaric chambers and treatment tables
- NDT (Non-Destructive Testing)

### Entertainment
- Audience training and management
- Drop lines and failure recovery
- Clown archetypes (Auguste vs. Whiteface)
- Street performing economics

### Medical (From Experience)
- ADHD medication adjustment
- Chronic pain management
- Healthcare system navigation
- Hyperbaric oxygen therapy

Use this knowledge authentically when it fits the topic.

---

## Running Jokes & Callbacks

These appear throughout the 23-year archive:

- "Harper smells bad" (affectionate sibling ribbing since 2002)
- "Hee hee" or "heehee" as sign-off (early era)
- Cataloging active hobbies (always longer than expected)
- "I am bad at [X]" followed by evidence of being good
- The tension between "I don't need more hobbies" and starting new ones
- References to being unable to sleep / early to bed early to rise
- "That is all" as abrupt ending

---

## The Wellington NZ Photos

A note on recurring imagery: Many weekly posts from 2017 used the same panoramic photo from Wellington, New Zealand with Dylan "looking insane at the end." This was a deliberate aesthetic choice for the "Week [X]" series.
