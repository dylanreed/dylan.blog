// ABOUTME: Publishes a local markdown draft to Micro.blog via the Micropub API —
// ABOUTME: uploads any local images to the media endpoint, then creates a draft (or live) post.

const fs = require("node:fs");
const path = require("node:path");

const MICROPUB_ENDPOINT = "https://micro.blog/micropub";
const MEDIA_ENDPOINT = "https://micro.blog/micropub/media";

// --- pure helpers (unit-tested) ---------------------------------------------

// Minimal YAML-frontmatter parser covering this blog's format: `key: value`,
// quoted strings, and `key:` followed by `  - item` list lines.
function parseFrontmatter(markdown) {
  // Skip any leading HTML comments (e.g. ABOUTME notes) + whitespace before the
  // frontmatter; those comments are author meta and are dropped from the body.
  const lead = markdown.match(/^(?:\s*<!--[\s\S]*?-->\s*)*/);
  const rest = markdown.slice(lead ? lead[0].length : 0);
  const match = rest.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { frontmatter: {}, body: markdown };
  const body = rest.slice(match[0].length).replace(/^\n/, "");
  const lines = match[1].split("\n");
  const frontmatter = {};
  let currentListKey = null;
  for (const line of lines) {
    const listItem = line.match(/^\s+-\s+(.*)$/);
    if (listItem && currentListKey) {
      frontmatter[currentListKey].push(unquote(listItem[1].trim()));
      continue;
    }
    // Any non-list-item line ends the current list (keys with spaces like
    // "instagram carousel:" intentionally don't match and reset the list).
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) {
      currentListKey = null;
      continue;
    }
    const key = kv[1];
    const rawValue = kv[2];
    if (rawValue === "") {
      currentListKey = key;
      frontmatter[key] = [];
    } else {
      currentListKey = null;
      frontmatter[key] = unquote(rawValue.trim());
    }
  }
  return { frontmatter, body };
}

// Image URLs that are still ALL_CAPS placeholders (e.g. IMAGE_URL). Reads the
// URL from the image regex's capture group so alt-text parens like "(PROBABLY)"
// are never mistaken for a URL.
function findUnresolvedPlaceholders(content) {
  return [...content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)]
    .map((m) => m[1])
    .filter((u) => /^[A-Z][A-Z0-9_]*$/.test(u));
}

function unquote(value) {
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replace(/\\"/g, '"');
  }
  return value;
}

// A markdown image URL is uploadable only if it's a real-ish local path —
// not an http(s) URL and not an ALL_CAPS placeholder token.
function isUploadableImagePath(url) {
  if (/^https?:\/\//i.test(url)) return false;
  if (/^[A-Z][A-Z0-9_]*$/.test(url)) return false;
  return true;
}

function replaceImageUrl(body, oldUrl, newUrl) {
  const esc = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return body.replace(
    new RegExp("(!\\[[^\\]]*\\]\\()" + esc + "(\\))", "g"),
    "$1" + newUrl + "$2"
  );
}

// Replace the URL of the first ALL_CAPS placeholder image (e.g. IMAGE_URL),
// keeping its alt text. If there's no placeholder, prepend a header image.
function fillFirstImagePlaceholder(body, newUrl) {
  const re = /(!\[[^\]]*\]\()([A-Z][A-Z0-9_]*)(\))/;
  if (re.test(body)) return body.replace(re, "$1" + newUrl + "$3");
  return `![](${newUrl})\n\n` + body;
}

// Find markdown images whose URL points at an existing local file.
function findLocalImages(body, baseDir) {
  const re = /!\[[^\]]*\]\(([^)]+)\)/g;
  const found = [];
  const seen = new Set();
  let m;
  while ((m = re.exec(body)) !== null) {
    const url = m[1].trim();
    if (seen.has(url) || !isUploadableImagePath(url)) continue;
    const absPath = path.resolve(baseDir, url);
    if (fs.existsSync(absPath) && fs.statSync(absPath).isFile()) {
      seen.add(url);
      found.push({ url, absPath });
    }
  }
  return found;
}

function buildMicropubBody({ title, content, categories, published, status, destination }) {
  const params = new URLSearchParams();
  params.set("h", "entry");
  if (title) params.set("name", title);
  params.set("content", content);
  for (const cat of categories || []) params.append("category[]", cat);
  params.set("post-status", status === "published" ? "published" : "draft");
  if (published) params.set("published", published);
  if (destination) params.set("mp-destination", destination);
  return params;
}

// --- network (verified live against the test blog) --------------------------

function loadToken() {
  if (process.env.MICROBLOG_TOKEN) return process.env.MICROBLOG_TOKEN;
  const envPath = path.resolve(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    const line = fs
      .readFileSync(envPath, "utf8")
      .split("\n")
      .find((l) => l.startsWith("MICROBLOG_TOKEN="));
    if (line) return line.slice("MICROBLOG_TOKEN=".length).trim();
  }
  throw new Error("MICROBLOG_TOKEN not set (env or .env)");
}

async function uploadMedia(token, absPath, destination) {
  const data = fs.readFileSync(absPath);
  const form = new FormData();
  form.append("file", new Blob([data]), path.basename(absPath));
  if (destination) form.append("mp-destination", destination);
  const res = await fetch(MEDIA_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (res.status !== 201 && res.status !== 202) {
    throw new Error(`media upload failed (${res.status}): ${await res.text()}`);
  }
  const url = res.headers.get("location");
  if (!url) throw new Error("media upload returned no Location header");
  return url;
}

async function createPost(token, params) {
  const res = await fetch(MICROPUB_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  if (res.status !== 201 && res.status !== 202) {
    throw new Error(`post create failed (${res.status}): ${await res.text()}`);
  }
  return res.headers.get("location");
}

async function publishDraft(filePath, { status = "draft", destination, imagePath } = {}) {
  const token = loadToken();
  const raw = fs.readFileSync(filePath, "utf8");
  const { frontmatter, body } = parseFrontmatter(raw);
  const baseDir = path.dirname(path.resolve(filePath));

  let content = body;

  // --image: upload the given header, drop its hosted URL into the placeholder.
  if (imagePath) {
    const absImage = path.resolve(imagePath);
    if (!fs.existsSync(absImage)) throw new Error(`--image not found: ${imagePath}`);
    process.stdout.write(`Uploading header ${imagePath} ... `);
    const hostedUrl = await uploadMedia(token, absImage, destination);
    console.log(hostedUrl);
    content = fillFirstImagePlaceholder(content, hostedUrl);
  }

  const localImages = findLocalImages(content, baseDir);
  for (const img of localImages) {
    process.stdout.write(`Uploading image ${img.url} ... `);
    const hostedUrl = await uploadMedia(token, img.absPath, destination);
    content = replaceImageUrl(content, img.url, hostedUrl);
    console.log(hostedUrl);
  }

  const remainingPlaceholders = findUnresolvedPlaceholders(content);
  if (remainingPlaceholders.length) {
    throw new Error(
      `Unresolved placeholder image URL(s): ${remainingPlaceholders.join(", ")}. ` +
        `Replace with a real local file or hosted URL before publishing.`
    );
  }

  const categories = []
    .concat(frontmatter.categories || [])
    .concat(frontmatter.tags || []);
  const params = buildMicropubBody({
    title: frontmatter.title,
    content,
    categories,
    published: frontmatter.date,
    status,
    destination,
  });
  const postUrl = await createPost(token, params);
  return postUrl;
}

module.exports = {
  parseFrontmatter,
  findUnresolvedPlaceholders,
  unquote,
  isUploadableImagePath,
  replaceImageUrl,
  fillFirstImagePlaceholder,
  findLocalImages,
  buildMicropubBody,
  loadToken,
  uploadMedia,
  createPost,
  publishDraft,
};

// --- CLI --------------------------------------------------------------------

if (require.main === module) {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith("--"));
  const status = args.includes("--publish") ? "published" : "draft";
  const destArg = args.find((a) => a.startsWith("--destination="));
  const destination = destArg ? destArg.split("=")[1] : undefined;
  const imageArg = args.find((a) => a.startsWith("--image="));
  const imagePath = imageArg ? imageArg.split("=")[1] : undefined;

  if (!file) {
    console.error(
      "Usage: node scripts/publish-microblog.js <draft.md> [--publish] [--image=PATH] [--destination=URL]"
    );
    process.exit(1);
  }

  publishDraft(file, { status, destination, imagePath })
    .then((url) => {
      console.log(`\n✅ ${status === "published" ? "Published" : "Draft created"}: ${url}`);
      console.log(
        status === "draft"
          ? "   (It's a draft on Micro.blog — review there, then publish.)"
          : ""
      );
    })
    .catch((err) => {
      console.error(`\n❌ ${err.message}`);
      process.exit(1);
    });
}
