import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ProjectContext } from '../registry/types.js';

const { fsMock } = vi.hoisted(() => {
  const fsMock = {
    ensureDirSync: vi.fn(),
    existsSync: vi.fn(() => false),
    readdirSync: vi.fn(() => []),
    emptyDirSync: vi.fn(),
    writeFileSync: vi.fn(),
    readFileSync: vi.fn(),
    mkdirpSync: vi.fn(),
    copySync: vi.fn(),
    removeSync: vi.fn(),
  };
  return { fsMock };
});

vi.mock('fs-extra', () => ({
  default: fsMock,
  ...fsMock,
}));

vi.mock('execa', () => ({
  execa: vi.fn(() => Promise.resolve({ stdout: 'ok', stderr: '' })),
}));

vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn(),
    fail: vi.fn(),
    text: '',
  })),
}));

import { generateProject } from '../engine/index.js';

function createMockCtx(overrides: Partial<ProjectContext> = {}): ProjectContext {
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

describe('generateProject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates target directory', async () => {
    const ctx = createMockCtx({ git: false, install: false });
    await generateProject(ctx);
    expect(fsMock.ensureDirSync).toHaveBeenCalledWith(ctx.targetDir);
  });

  it('adds TypeScript dev dependencies for ts projects', async () => {
    const ctx = createMockCtx({ language: 'ts', git: false, install: false });
    await generateProject(ctx);
    expect(ctx.devDependencies['typescript']).toBe('^5.5.4');
    expect(ctx.devDependencies['tsx']).toBe('^4.16.2');
    expect(ctx.devDependencies['@types/node']).toBe('^22.0.0');
  });

  it('generates tsconfig.json for TypeScript projects', async () => {
    const ctx = createMockCtx({ language: 'ts', git: false, install: false });
    await generateProject(ctx);
    expect(ctx.files['tsconfig.json']).toBeDefined();
    const tsconfig = JSON.parse(ctx.files['tsconfig.json']);
    expect(tsconfig.compilerOptions.target).toBe('ES2022');
  });

  it('adds nodemon for JS projects', async () => {
    const ctx = createMockCtx({ language: 'js', git: false, install: false });
    await generateProject(ctx);
    expect(ctx.devDependencies['nodemon']).toBe('^3.1.4');
  });

  it('writes all registry files to the target directory', async () => {
    const ctx = createMockCtx({
      git: false,
      install: false,
      files: {
        'src/app.ts': 'console.log("hello");',
        'src/server.ts': 'console.log("server");',
      },
    });
    await generateProject(ctx);
    expect(fsMock.ensureDirSync).toHaveBeenCalled();
    expect(fsMock.writeFileSync).toHaveBeenCalled();
  });

  it('generates package.json with correct fields', async () => {
    const ctx = createMockCtx({
      git: false,
      install: false,
      scripts: { dev: 'tsx watch src/server.ts' },
      dependencies: { express: '^4.19.0' },
      devDependencies: { typescript: '^5.5.4' },
    });
    await generateProject(ctx);

    const packageJsonCall = vi.mocked(fsMock.writeFileSync).mock.calls.find(
      ([path]) => path.toString().endsWith('package.json')
    );
    expect(packageJsonCall).toBeDefined();

    const pkg = JSON.parse(packageJsonCall![1] as string);
    expect(pkg.name).toBe('test-proj');
    expect(pkg.scripts.dev).toBe('tsx watch src/server.ts');
    expect(pkg.dependencies.express).toBe('^4.19.0');
    expect(pkg.type).toBe('module');
  });

  it('writes .env and .env.example files', async () => {
    const ctx = createMockCtx({
      git: false,
      install: false,
      env: { PORT: '5000', JWT_SECRET: 'changeme' },
    });
    await generateProject(ctx);

    const envCalls = vi.mocked(fsMock.writeFileSync).mock.calls.filter(
      ([path]) => path.toString().endsWith('.env') || path.toString().endsWith('.env.example')
    );
    expect(envCalls.length).toBe(2);
    envCalls.forEach(([, content]) => {
      expect(content).toContain('PORT=5000');
      expect(content).toContain('JWT_SECRET=changeme');
    });
  });

  it('generates README.md with project info', async () => {
    const ctx = createMockCtx({ git: false, install: false });
    await generateProject(ctx);

    const readmeCall = vi.mocked(fsMock.writeFileSync).mock.calls.find(
      ([path]) => path.toString().endsWith('README.md')
    );
    expect(readmeCall).toBeDefined();
    expect(readmeCall![1]).toContain('test-proj');
    expect(readmeCall![1]).toContain('express');
  });

  it('initializes git repository when ctx.git is true', async () => {
    const ctx = createMockCtx({ git: true, install: false });
    const { execa } = await import('execa');
    await generateProject(ctx);
    expect(execa).toHaveBeenCalledWith('git', ['init'], { cwd: ctx.targetDir });
  });

  it('writes .gitignore when git is initialized', async () => {
    const ctx = createMockCtx({ git: true, install: false });
    await generateProject(ctx);
    const gitignoreCall = vi.mocked(fsMock.writeFileSync).mock.calls.find(
      ([path]) => path.toString().endsWith('.gitignore')
    );
    expect(gitignoreCall).toBeDefined();
    expect(gitignoreCall![1]).toContain('node_modules/');
  });

  it('installs dependencies when ctx.install is true', async () => {
    const ctx = createMockCtx({ git: false, install: true, packageManager: 'npm' });
    const { execa } = await import('execa');
    await generateProject(ctx);
    expect(execa).toHaveBeenCalledWith('npm', ['install'], { cwd: ctx.targetDir });
  });

  it('does not install dependencies when ctx.install is false', async () => {
    const ctx = createMockCtx({ git: false, install: false });
    const { execa } = await import('execa');
    await generateProject(ctx);
    expect(execa).not.toHaveBeenCalledWith('npm', ['install'], expect.anything());
  });

  it('sets type: module in package.json for ESM projects', async () => {
    const ctx = createMockCtx({ moduleSystem: 'esm', git: false, install: false });
    await generateProject(ctx);
    const packageJsonCall = vi.mocked(fsMock.writeFileSync).mock.calls.find(
      ([path]) => path.toString().endsWith('package.json')
    );
    const pkg = JSON.parse(packageJsonCall![1] as string);
    expect(pkg.type).toBe('module');
  });

  it('does not add type field for CJS projects', async () => {
    const ctx = createMockCtx({ moduleSystem: 'cjs', git: false, install: false });
    await generateProject(ctx);
    const packageJsonCall = vi.mocked(fsMock.writeFileSync).mock.calls.find(
      ([path]) => path.toString().endsWith('package.json')
    );
    const pkg = JSON.parse(packageJsonCall![1] as string);
    expect(pkg.type).toBeUndefined();
  });
});
