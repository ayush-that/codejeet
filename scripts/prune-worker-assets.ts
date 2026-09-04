import fs from "fs/promises";
import path from "path";

const assetsDir = path.join(process.cwd(), ".open-next", "assets");
const buildOnlyDataDirs = ["blog", "compare"];

async function main() {
  for (const dir of buildOnlyDataDirs) {
    await fs.rm(path.join(assetsDir, "data", dir), { recursive: true, force: true });
  }

  console.log(`Removed build-only worker data: ${buildOnlyDataDirs.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
