import { copyFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const src = join(here, "entry.png");
const dst = join(outDir, "entry.png");

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const bytes = readFileSync(src);
for (let i = 0; i < PNG_MAGIC.length; i++) {
  if (bytes[i] !== PNG_MAGIC[i]) {
    throw new Error("entry.png is not a PNG file");
  }
}

copyFileSync(src, dst);

const back = readFileSync(dst);
if (back.length !== bytes.length || !back.equals(bytes)) {
  throw new Error("copied entry.png does not match the source bytes");
}
console.log(`wrote ${dst} (${back.length} bytes)`);
