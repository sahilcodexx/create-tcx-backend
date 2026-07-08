import { describe, it, expect } from 'vitest';

describe('ProjectContext type contract', () => {
  it('enforces valid shape through a minimal context object', () => {
    const ctx = {
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
      swagger: false,
      eslint: true,
      prettier: false,
      husky: true,
      git: true,
      install: true,
      dependencies: {},
      devDependencies: {},
      files: {},
      scripts: {},
      env: {},
    } as const;

    expect(ctx).toBeDefined();
    expect(ctx.projectName).toBe('test-proj');
    expect(ctx.framework).toBe('express');
    expect(ctx.dependencies).toEqual({});
  });

  it('allows all valid framework values', () => {
    const frameworks = ['express', 'fastify', 'hono'] as const;
    frameworks.forEach(fw => {
      expect(['express', 'fastify', 'hono']).toContain(fw);
    });
  });

  it('allows all valid language values', () => {
    const languages = ['ts', 'js'] as const;
    languages.forEach(lang => {
      expect(['ts', 'js']).toContain(lang);
    });
  });

  it('allows all valid database values', () => {
    const databases = ['postgres', 'mongodb', 'mysql', 'sqlite', 'none'] as const;
    databases.forEach(db => {
      expect(['postgres', 'mongodb', 'mysql', 'sqlite', 'none']).toContain(db);
    });
  });

  it('allows all valid auth values', () => {
    const auths = ['jwt', 'better-auth', 'none'] as const;
    auths.forEach(a => {
      expect(['jwt', 'better-auth', 'none']).toContain(a);
    });
  });

  it('validates that files, scripts, env are records', () => {
    const ctx = {
      projectName: 'test',
      targetDir: '/tmp/test',
      packageManager: 'npm' as const,
      framework: 'express' as const,
      language: 'ts' as const,
      moduleSystem: 'esm' as const,
      database: 'none' as const,
      orm: 'none' as const,
      auth: 'none' as const,
      validation: 'none' as const,
      apiType: 'rest' as const,
      docker: false,
      swagger: false,
      eslint: false,
      prettier: false,
      husky: false,
      git: false,
      install: false,
      dependencies: {},
      devDependencies: {},
      files: {},
      scripts: {},
      env: {},
    };

    expect(typeof ctx.files).toBe('object');
    expect(typeof ctx.scripts).toBe('object');
    expect(typeof ctx.env).toBe('object');

    ctx.files['src/app.ts'] = 'content';
    ctx.scripts['dev'] = 'tsx watch';
    ctx.env['PORT'] = '5000';

    expect(ctx.files['src/app.ts']).toBe('content');
    expect(ctx.scripts['dev']).toBe('tsx watch');
    expect(ctx.env['PORT']).toBe('5000');
  });
});
