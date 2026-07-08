import { describe, it, expect, vi, beforeEach } from 'vitest';

const { store, fsMock } = vi.hoisted(() => {
  const store = new Map<string, string>();
  const fsMock = {
    ensureDirSync: vi.fn(),
    existsSync: vi.fn((p: string) => store.has(p)),
    readFileSync: vi.fn((p: string) => store.get(p)),
    writeFileSync: vi.fn((p: string, c: string) => store.set(p, c)),
  };
  return { store, fsMock };
});

vi.mock('fs-extra', () => ({
  default: fsMock,
  ...fsMock,
}));

import { compareVersions, fetchLatestVersion, checkForUpdates, CURRENT_VERSION } from '../utils/version-check.js';

describe('compareVersions', () => {
  it('returns true when latest is greater than current', () => {
    expect(compareVersions('1.0.0', '1.0.1')).toBe(true);
  });

  it('returns true when latest is major ahead', () => {
    expect(compareVersions('1.0.0', '2.0.0')).toBe(true);
  });

  it('returns false when versions are equal', () => {
    expect(compareVersions('1.0.0', '1.0.0')).toBe(false);
  });

  it('returns false when current is greater than latest', () => {
    expect(compareVersions('2.0.0', '1.0.0')).toBe(false);
  });

  it('handles pre-release tags by dropping them', () => {
    expect(compareVersions('1.0.0-alpha', '2.0.0')).toBe(true);
    expect(compareVersions('2.0.0-alpha', '1.0.0')).toBe(false);
  });
});

describe('fetchLatestVersion', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns version from npm registry', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ version: '1.0.1' }),
    } as Response);

    const version = await fetchLatestVersion();
    expect(version).toBe('1.0.1');
  });

  it('returns null on network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));
    const version = await fetchLatestVersion();
    expect(version).toBeNull();
  });

  it('returns null on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
    } as Response);

    const version = await fetchLatestVersion();
    expect(version).toBeNull();
  });
});

describe('checkForUpdates', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    store.clear();
  });

  it('returns hasUpdate false when on latest version', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ version: CURRENT_VERSION }),
    } as Response);

    const result = await checkForUpdates();
    expect(result.hasUpdate).toBe(false);
  });

  it('returns hasUpdate true when a newer version is available', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ version: '9.9.9' }),
    } as Response);

    const result = await checkForUpdates();
    expect(result.hasUpdate).toBe(true);
    expect(result.latestVersion).toBe('9.9.9');
    expect(result.currentVersion).toBe(CURRENT_VERSION);
  });

  it('returns hasUpdate false when fetch fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));
    const result = await checkForUpdates();
    expect(result.hasUpdate).toBe(false);
    expect(result.latestVersion).toBeNull();
  });
});
