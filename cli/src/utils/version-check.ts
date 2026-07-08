import picocolors from 'picocolors';
import fs from 'fs-extra';
import path from 'path';

import { VERSION } from '../version.js';

const PKG_NAME = 'create-tcx-backend';
const CURRENT_VERSION = VERSION;
const CACHE_TTL = 86_400_000; // 24 hours in ms
const FETCH_TIMEOUT = 3_000;   // 3 seconds

function getCachePath(): string {
  const home = process.env.HOME || process.env.USERPROFILE || '/tmp';
  const dir = path.join(home, '.tcx-cache');
  fs.ensureDirSync(dir);
  return path.join(dir, 'version-check.json');
}

interface CacheData {
  latestVersion: string | null;
  cachedAt: number | null;
}

function readCache(): CacheData {
  try {
    const cachePath = getCachePath();
    if (fs.existsSync(cachePath)) {
      return JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
    }
  } catch {}
  return { latestVersion: null, cachedAt: null };
}

function writeCache(latestVersion: string): void {
  try {
    const cachePath = getCachePath();
    fs.writeFileSync(cachePath, JSON.stringify({ latestVersion, cachedAt: Date.now() }));
  } catch {}
}

function compareVersions(current: string, latest: string): boolean {
  const curParts = current.split('.').map(Number);
  const latParts = latest.split('.').map(Number);
  for (let i = 0; i < Math.max(curParts.length, latParts.length); i++) {
    const a = curParts[i] || 0;
    const b = latParts[i] || 0;
    if (b > a) return true;
    if (b < a) return false;
  }
  return false;
}

async function fetchLatestVersion(): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const res = await fetch(`https://registry.npmjs.org/${PKG_NAME}/latest`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json() as { version?: string };
    return data.version ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export interface UpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string | null;
}

export async function checkForUpdates(): Promise<UpdateInfo> {
  const cache = readCache();

  let latestVersion = cache.latestVersion;

  if (!latestVersion || !cache.cachedAt || Date.now() - cache.cachedAt > CACHE_TTL) {
    latestVersion = await fetchLatestVersion();
    if (latestVersion) {
      writeCache(latestVersion);
    }
  }

  const hasUpdate = latestVersion ? compareVersions(CURRENT_VERSION, latestVersion) : false;

  if (hasUpdate) {
    console.warn(
      picocolors.yellow(
        `\n⚠ A new version of ${picocolors.bold(PKG_NAME)} is available: ` +
        `${picocolors.dim(CURRENT_VERSION)} → ${picocolors.bold(latestVersion)}\n` +
        `  Run ${picocolors.cyan(`npx ${PKG_NAME}@latest`)} to get the latest features.\n`
      )
    );
  }

  return { hasUpdate, currentVersion: CURRENT_VERSION, latestVersion };
}

export { PKG_NAME, CURRENT_VERSION, compareVersions, fetchLatestVersion };
