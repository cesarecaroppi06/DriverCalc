import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const OUTPUT_DIR = path.join(ROOT_DIR, 'mobile-web');

const COPY_DIRECTORIES = new Set([
  'assets',
  'models'
]);

const COPY_ROOT_FILES = new Set([
  'style.css',
  'script.js',
  'sw.js',
  'manifest.webmanifest',
  'config.public.js',
  'car_models.json',
  'robots.txt',
  'sitemap.xml'
]);

const ROOT_IMAGE_FILE_REGEX = /\.(png|jpg|jpeg|webp|gif|svg)$/i;

function shouldCopyRootFile(fileName = '') {
  const name = String(fileName || '').trim();
  if (!name) return false;
  if (/\.html$/i.test(name)) return true;
  if (COPY_ROOT_FILES.has(name)) return true;
  if (ROOT_IMAGE_FILE_REGEX.test(name)) return true;
  return false;
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch (err) {
    return false;
  }
}

async function copyFileIntoOutput(fileName) {
  const source = path.join(ROOT_DIR, fileName);
  const destination = path.join(OUTPUT_DIR, fileName);
  await fs.copyFile(source, destination);
}

async function copyDirectoryIntoOutput(dirName) {
  const source = path.join(ROOT_DIR, dirName);
  const destination = path.join(OUTPUT_DIR, dirName);
  await fs.cp(source, destination, { recursive: true });
}

async function buildMobileWeb() {
  await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const entries = await fs.readdir(ROOT_DIR, { withFileTypes: true });
  const copiedFiles = [];
  const copiedDirs = [];

  for (const entry of entries) {
    const name = entry.name;
    if (name === 'mobile-web' || name === '.git' || name === 'server') continue;
    if (name === 'config.js') continue;

    if (entry.isDirectory() && COPY_DIRECTORIES.has(name)) {
      await copyDirectoryIntoOutput(name);
      copiedDirs.push(name);
      continue;
    }

    if (!entry.isFile()) continue;
    if (!shouldCopyRootFile(name)) continue;

    await copyFileIntoOutput(name);
    copiedFiles.push(name);
  }

  const requiredFiles = ['index.html', 'script.js', 'style.css', 'config.public.js'];
  for (const fileName of requiredFiles) {
    const present = await pathExists(path.join(OUTPUT_DIR, fileName));
    if (!present) {
      throw new Error(`File obbligatorio mancante in mobile-web: ${fileName}`);
    }
  }

  console.log(`mobile-web pronto: ${copiedFiles.length} file, ${copiedDirs.length} cartelle.`);
}

buildMobileWeb().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
