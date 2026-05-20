// ABOUTME: CLI tool that generates 1080x1080 Instagram share images for blog posts using Puppeteer.
// ABOUTME: Takes a post title and category (or --post path) and renders the pixel art template; uses the post's first image as background when present and reachable.

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

const CATEGORY_MAP = {
  health:    { header: 'health.png',    sprite: 'skele-health.png',        glow: '#5de2a3' },
  tabletop:  { header: 'tabletop.png',  sprite: 'knight - tabletop.png',   glow: '#40c8d8' },
  gaming:    { header: 'tabletop.png',  sprite: 'Dragon - Tabletop.png',   glow: '#40c8d8' },
  tech:      { header: 'tech.png',      sprite: 'wizard-tech.png',         glow: '#6cd9e8' },
  writing:   { header: 'writing.png',   sprite: 'quill - Writing.png',     glow: '#c4a060' },
  cooking:   { header: 'cooking.png',   sprite: 'cauldren - cooking.png',  glow: '#e07040' },
  music:     { header: 'music.png',     sprite: 'banjo - music.png',       glow: '#e8c546' },
  travel:    { header: 'travel.png',    sprite: 'Adventure - Travel.png',  glow: '#5a9e5a' },
  reading:   { header: 'reading.png',   sprite: 'book-reading.png',        glow: '#8060c0' },
  crafting:  { header: 'crafting.png',  sprite: 'Muse - Writing.png',      glow: '#c4a060' },
  clowning:  { header: 'clown.png',     sprite: 'clown - clown.png',       glow: '#7050a0' },
  personal:  { header: 'home.png',      sprite: 'clown - clown.png',       glow: '#7050a0' },
  pets:      { header: 'home.png',      sprite: 'Cat - Health.png',        glow: '#e0a080' },
  adhd:      { header: 'home.png',      sprite: 'Donkey - Travel.png',     glow: '#5a9e5a' },
};

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--title' && argv[i + 1]) {
      args.title = argv[++i];
    } else if (argv[i] === '--category' && argv[i + 1]) {
      args.category = argv[++i];
    } else if (argv[i] === '--post' && argv[i + 1]) {
      args.post = argv[++i];
    }
  }
  return args;
}

function parsePostFile(postPath) {
  const raw = fs.readFileSync(postPath, 'utf8');
  // Skip leading HTML comments (e.g. ABOUTME headers) and blank lines before the frontmatter block.
  const content = raw.replace(/^(?:\s*<!--[\s\S]*?-->\s*)*/, '');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    throw new Error(`No frontmatter found in ${postPath}`);
  }
  const fmRaw = fmMatch[1];
  const out = {};

  for (const line of fmRaw.split('\n')) {
    const m = line.match(/^([^:\s][^:]*):\s*(.*)$/);
    if (m) out[m[1].trim()] = m[2].trim();
  }

  const catMatch = fmRaw.match(/^categories:\s*\n((?:\s*-\s*\S+\n?)+)/m);
  if (catMatch) {
    const first = catMatch[1].match(/-\s*(\S+)/);
    if (first) out.category = first[1];
  }

  const body = content.slice(fmMatch[0].length);
  const imgMatch = body.match(/!\[[^\]]*\]\(([^)\s]+)/);
  if (imgMatch) out.headerImage = imgMatch[1];

  return out;
}

function checkUrlReachable(url) {
  return new Promise((resolve) => {
    try {
      const lib = url.startsWith('https://') ? https : http;
      const req = lib.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          checkUrlReachable(res.headers.location).then(resolve);
          return;
        }
        resolve(res.statusCode >= 200 && res.statusCode < 300);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

function sanitizeFilename(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function getTitleSizeClass(title) {
  const len = title.length;
  if (len < 40) return 'size-xl';
  if (len < 80) return 'size-lg';
  if (len < 120) return 'size-md';
  return 'size-sm';
}

async function main() {
  const args = parseArgs(process.argv);

  let postHeaderImage;
  if (args.post) {
    const postPath = path.resolve(args.post);
    if (!fs.existsSync(postPath)) {
      console.error(`Post file not found: ${postPath}`);
      process.exit(1);
    }
    const fm = parsePostFile(postPath);
    if (!args.title && fm.title) args.title = fm.title;
    if (!args.category && fm.category) args.category = fm.category;
    postHeaderImage = fm.headerImage;
  }

  if (!args.title) {
    console.error('Usage: node generate-instagram.js --title "Post Title" --category <category>');
    console.error('   or: node generate-instagram.js --post path/to/post.md');
    console.error('  --title     The blog post title (required unless --post is provided).');
    console.error('  --category  Optional. Defaults to "personal".');
    console.error('  --post      Path to a markdown post; reads title/category from frontmatter and uses the first image as background if reachable.');
    console.error(`\nAvailable categories: ${Object.keys(CATEGORY_MAP).join(', ')}`);
    process.exit(1);
  }

  const category = args.category || 'personal';
  if (!CATEGORY_MAP[category]) {
    console.error(`Unknown category: "${category}"`);
    console.error(`Available categories: ${Object.keys(CATEGORY_MAP).join(', ')}`);
    process.exit(1);
  }

  const catConfig = CATEGORY_MAP[category];
  const projectRoot = path.resolve(__dirname, '..');
  const templatePath = path.resolve(__dirname, 'instagram-template.html');
  const headerPath = path.resolve(projectRoot, 'theme-pixel-art', 'static', 'headers', catConfig.header);
  const spritePath = path.resolve(projectRoot, 'theme-pixel-art', 'static', 'sprites', catConfig.sprite);
  const outputDir = path.resolve(projectRoot, 'output');

  if (!fs.existsSync(headerPath)) {
    console.error(`Header image not found: ${headerPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(spritePath)) {
    console.error(`Sprite image not found: ${spritePath}`);
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fallbackHeaderUrl = `file://${headerPath}`;
  let headerFileUrl = fallbackHeaderUrl;

  if (postHeaderImage) {
    if (postHeaderImage.startsWith('http://') || postHeaderImage.startsWith('https://')) {
      const reachable = await checkUrlReachable(postHeaderImage);
      if (reachable) {
        headerFileUrl = postHeaderImage;
        console.log(`Using post header image: ${postHeaderImage}`);
      } else {
        console.warn(`Post header image not reachable, falling back to category art: ${postHeaderImage}`);
      }
    } else {
      const localPath = path.isAbsolute(postHeaderImage)
        ? postHeaderImage
        : path.resolve(path.dirname(path.resolve(args.post)), postHeaderImage);
      if (fs.existsSync(localPath)) {
        headerFileUrl = `file://${localPath}`;
        console.log(`Using local post header image: ${localPath}`);
      } else {
        console.warn(`Local post header image not found, falling back to category art: ${localPath}`);
      }
    }
  }

  const spriteFileUrl = `file://${spritePath}`;
  const templateFileUrl = `file://${templatePath}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--allow-file-access-from-files'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080 });

  await page.goto(templateFileUrl, { waitUntil: 'networkidle0' });

  const sizeClass = getTitleSizeClass(args.title);

  await page.evaluate(({ title, headerUrl, spriteUrl, glowColor, sizeClass }) => {
    document.getElementById('title').textContent = title;
    document.getElementById('title').className = sizeClass;
    document.getElementById('background').style.backgroundImage = `url('${headerUrl}')`;
    document.getElementById('sprite').style.backgroundImage = `url('${spriteUrl}')`;
    document.getElementById('accent').style.backgroundColor = glowColor;
  }, {
    title: args.title,
    headerUrl: headerFileUrl,
    spriteUrl: spriteFileUrl,
    glowColor: catConfig.glow,
    sizeClass: sizeClass,
  });

  await page.evaluate(() => document.fonts.ready);
  await new Promise(resolve => setTimeout(resolve, 1000));

  const sanitized = sanitizeFilename(args.title);
  const outputPath = path.resolve(outputDir, `instagram-${sanitized}.png`);

  await page.screenshot({ path: outputPath, type: 'png' });
  await browser.close();

  console.log(`Generated: ${outputPath}`);
}

main().catch(err => {
  console.error('Error generating image:', err.message);
  process.exit(1);
});
