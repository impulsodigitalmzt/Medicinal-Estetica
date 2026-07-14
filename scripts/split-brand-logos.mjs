import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT = path.join(__dirname, "../public/marcas/logos-strip.png");
const OUTPUT_DIR = path.join(__dirname, "../public/marcas");

const STRIP_ORDER = [
  "cumlaude",
  "accuderm",
  "elementre",
  "filorga",
  "avene",
  "hd-cosmetic",
  "toskani",
  "neostrata",
  "isispharma",
  "uriage",
  "noreva",
];

const SCALE = 6;

const metadata = await sharp(INPUT).metadata();
const { width = 0, height = 0 } = metadata;
const sliceWidth = Math.floor(width / STRIP_ORDER.length);

await sharp(INPUT)
  .resize({
    width: width * SCALE,
    height: height * SCALE,
    kernel: "lanczos3",
  })
  .png()
  .toFile(path.join(OUTPUT_DIR, "logos-strip-hd.png"));

const hdWidth = width * SCALE;
const hdHeight = height * SCALE;
const hdSliceWidth = Math.floor(hdWidth / STRIP_ORDER.length);

for (let index = 0; index < STRIP_ORDER.length; index += 1) {
  const id = STRIP_ORDER[index];
  const left = index * hdSliceWidth;
  const extractWidth =
    index === STRIP_ORDER.length - 1 ? hdWidth - left : hdSliceWidth;

  await sharp(path.join(OUTPUT_DIR, "logos-strip-hd.png"))
    .extract({
      left,
      top: 0,
      width: extractWidth,
      height: hdHeight,
    })
    .trim({ threshold: 12 })
    .extend({
      top: 8,
      bottom: 8,
      left: 16,
      right: 16,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toFile(path.join(OUTPUT_DIR, `${id}.png`));
}

console.log("Generated brand logos in", OUTPUT_DIR);
