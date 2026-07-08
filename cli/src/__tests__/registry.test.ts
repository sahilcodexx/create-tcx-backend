import { describe, it, expect, vi } from 'vitest';
import { PluginRegistry } from '../registry/index.js';
import type { ProjectContext, GeneratorPlugin } from '../registry/types.js';

function createMockPlugin(name: string): GeneratorPlugin {
  return {
    name,
    onInstall: vi.fn(),
    onGenerate: vi.fn(),
  };
}

function createMinimalCtx(overrides: Partial<ProjectContext> = {}): ProjectContext {
  return {
    projectName: 'test-proj',
    targetDir: '/tmp/test-proj',
    packageManager: 'npm',
    framework: 'express',
    language: 'ts',
    moduleSystem: 'esm',
    database: 'postgres',
    orm: 'prisma',
    auth: 'jwt',
    validation: 'zod',
    apiType: 'rest',
    docker: true,
    swagger: true,
    eslint: true,
    prettier: true,
    husky: true,
    git: true,
    install: true,
    dependencies: {},
    devDependencies: {},
    files: {},
    scripts: {},
    env: {},
    ...overrides,
  };
}

describe('PluginRegistry', () => {
  it('registers and retrieves a framework plugin', () => {
    const registry = new PluginRegistry();
    const plugin = createMockPlugin('express');
    registry.registerFramework('express', plugin);
    expect(registry['frameworks'].get('express')).toBe(plugin);
  });

  it('registers and retrieves a database plugin', () => {
    const registry = new PluginRegistry();
    const plugin = createMockPlugin('postgres');
    registry.registerDatabase('postgres', plugin);
    expect(registry['databases'].get('postgres')).toBe(plugin);
  });

  it('registers and retrieves an ORM plugin', () => {
    const registry = new PluginRegistry();
    const plugin = createMockPlugin('prisma');
    registry.registerORM('prisma', plugin);
    expect(registry['orms'].get('prisma')).toBe(plugin);
  });

  it('registers and retrieves a dynamic plugin', () => {
    const registry = new PluginRegistry();
    const plugin = createMockPlugin('docker');
    registry.registerPlugin('docker', plugin);
    expect(registry['plugins'].get('docker')).toBe(plugin);
  });

  it('runs onInstall hooks in order for activated framework plugin', async () => {
    const registry = new PluginRegistry();
    const fwPlugin = createMockPlugin('express');
    registry.registerFramework('express', fwPlugin);

    const ctx = createMinimalCtx();
    await registry.run(ctx);

    expect(fwPlugin.onInstall).toHaveBeenCalledWith(ctx);
  });

  it('runs onGenerate hooks after onInstall hooks', async () => {
    const registry = new PluginRegistry();
    const callOrder: string[] = [];

    const plugin: GeneratorPlugin = {
      name: 'test',
      onInstall: vi.fn(async () => { callOrder.push('install'); }),
      onGenerate: vi.fn(async () => { callOrder.push('generate'); }),
    };

    registry.registerFramework('express', plugin);
    await registry.run(createMinimalCtx());

    expect(callOrder).toEqual(['install', 'generate']);
  });

  it('activates plugins based on context selections', async () => {
    const registry = new PluginRegistry();
    const fw = createMockPlugin('express');
    const db = createMockPlugin('postgres');
    const orm = createMockPlugin('prisma');
    const auth = createMockPlugin('auth-jwt');
    const val = createMockPlugin('validation-zod');
    const docker = createMockPlugin('docker');

    registry.registerFramework('express', fw);
    registry.registerDatabase('postgres', db);
    registry.registerORM('prisma', orm);
    registry.registerPlugin('auth-jwt', auth);
    registry.registerPlugin('validation-zod', val);
    registry.registerPlugin('docker', docker);

    const ctx = createMinimalCtx({ swagger: false, eslint: false, prettier: false, husky: false });
    await registry.run(ctx);

    expect(fw.onInstall).toHaveBeenCalled();
    expect(db.onInstall).toHaveBeenCalled();
    expect(orm.onInstall).toHaveBeenCalled();
    expect(auth.onInstall).toHaveBeenCalled();
    expect(val.onInstall).toHaveBeenCalled();
    expect(docker.onInstall).toHaveBeenCalled();
  });

  it('does not activate plugins for deselected features', async () => {
    const registry = new PluginRegistry();
    const auth = createMockPlugin('auth-jwt');
    const docker = createMockPlugin('docker');

    registry.registerPlugin('auth-jwt', auth);
    registry.registerPlugin('docker', docker);

    const ctx = createMinimalCtx({ auth: 'none', docker: false });
    await registry.run(ctx);

    expect(auth.onInstall).not.toHaveBeenCalled();
    expect(docker.onInstall).not.toHaveBeenCalled();
  });

  it('handles empty registry gracefully', async () => {
    const registry = new PluginRegistry();
    const ctx = createMinimalCtx();
    await expect(registry.run(ctx)).resolves.not.toThrow();
  });

  it('handles plugins without onInstall or onGenerate hooks', async () => {
    const registry = new PluginRegistry();
    registry.registerFramework('express', { name: 'express' });
    const ctx = createMinimalCtx();
    await expect(registry.run(ctx)).resolves.not.toThrow();
  });
});
