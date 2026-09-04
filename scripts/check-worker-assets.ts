import fs from "fs";
import path from "path";

const MAX_BYTES = 25 * 1024 * 1024;
const MAX_FILES = 8_000;
const assetsDir = path.join(process.cwd(), ".open-next", "assets");

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

if (!fs.existsSync(assetsDir)) {
  console.error(`Missing assets directory: ${assetsDir}`);
  process.exit(1);
}

const assets = walk(assetsDir);

if (assets.length > MAX_FILES) {
  console.error(
    `Cloudflare Workers asset count ${assets.length} exceeds the ${MAX_FILES}-file deployment safety limit`
  );
  process.exit(1);
}

const oversized = assets
  .map((file) => ({ file, size: fs.statSync(file).size }))
  .filter(({ size }) => size > MAX_BYTES)
  .sort((a, b) => b.size - a.size);

if (oversized.length > 0) {
  console.error("Cloudflare Workers assets exceed the 25 MiB per-file limit:");
  for (const { file, size } of oversized) {
    const rel = path.relative(process.cwd(), file);
    console.error(`  ${(size / 1024 / 1024).toFixed(2)} MiB  ${rel}`);
  }
  process.exit(1);
}

console.log(`Worker asset check passed (${assets.length} files in ${assetsDir})`);
