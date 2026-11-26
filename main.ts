// ANGKA NUSANTARA — Indonesia in Numbers (Node 22, standard library only).
//
// The site is app/: plain static files a browser opens at
// app/index.html (ES modules, CSS, no build step, no network). This
// program hands it in: it copies app/ and screenshots/ from beside
// this file to /output and writes /output/dossier.json, the summary
// the judge reads (your screenshots, the first load's files and
// bytes, and your source), with the vendored make.fun library.
// Leave vendor/makefun-frontend.ts as it is: the scorer requires
// dossier.json to be byte for byte what its own copy writes.
//
// Before copying, it clears any stale output directory so a run can
// never hand in files from an earlier entry, and it checks every
// screenshot against the competition's own limits (3-4 files, each
// at most 256 KiB, long side at most 1280, short side at least 360)
// by reading the image dimensions itself — no image library. After
// writing, it verifies the handover is complete and prints a summary,
// so a silent partial run is impossible.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Where the repository sits: beside this file, or at $MAKEFUN_BOT_DIR
// when the grader mounts the repo there instead of the working directory.
const here = fileURLToPath(new URL('.', import.meta.url));
const candidates = [process.env.MAKEFUN_BOT_DIR, here, '/bot'].filter(Boolean) as string[];
const repoDir = candidates.find((d) => existsSync(join(d, 'app', 'index.html')) && existsSync(join(d, 'screenshots'))) ?? here;

const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Read a JPEG or PNG size straight from its header bytes.
function imageSize(file: string): { width: number; height: number } {
  const buf = readFileSync(file);
  if (buf[0] === 0x89 && buf[1] === 0x50) {
    // PNG: width/height are the first 8 bytes of the IHDR chunk.
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // JPEG: walk the markers to the first start-of-frame segment.
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) { i += 1; continue; }
    const marker = buf[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
    }
    const len = buf.readUInt16BE(i + 2);
    i += 2 + len;
  }
  throw new Error(`cannot read dimensions of ${file}`);
}

function checkScreenshots(dir: string): string[] {
  const files = readdirSync(dir).filter((f) => !f.startsWith('.')).sort();
  if (files.length < 3 || files.length > 4) {
    throw new Error(`screenshots: expected 3-4 files, found ${files.length}`);
  }
  for (const f of files) {
    const file = join(dir, f);
    const bytes = statSync(file).size;
    if (bytes > 262144) throw new Error(`screenshots/${f}: ${bytes} bytes, over the 256 KiB cap`);
    const { width, height } = imageSize(file);
    const long = Math.max(width, height), short = Math.min(width, height);
    if (long > 1280) throw new Error(`screenshots/${f}: long side ${long}px, over 1280`);
    if (short < 360) throw new Error(`screenshots/${f}: short side ${short}px, under 360`);
  }
  return files;
}

// Walk a directory depth-first, files in sorted order, so the summary
// below is the same on every run.
function listFiles(dir: string, prefix = ''): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...listFiles(full, `${prefix}${name}/`));
    else out.push(`${prefix}${name}`);
  }
  return out;
}

// Clear stale output first, so nothing from an earlier run can leak in.
if (existsSync(out)) rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const shots = checkScreenshots(join(repoDir, 'screenshots'));
cpSync(join(repoDir, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(join(repoDir, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Verify the handover before building the dossier.
if (!existsSync(join(out, 'app', 'index.html'))) {
  throw new Error('handover incomplete: /output/app/index.html is missing');
}
const appFiles = listFiles(join(out, 'app'));
const dossierPath = join(out, 'dossier.json');

writeFileSync(
  dossierPath,
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

const dossierBytes = statSync(dossierPath).size;
if (dossierBytes === 0) throw new Error('dossier.json was written empty');

console.log(`ANGKA NUSANTARA handed in: ${appFiles.length} app files, ${shots.length} screenshots (${shots.join(', ')}), dossier ${dossierBytes} bytes at ${dossierPath}.`);
