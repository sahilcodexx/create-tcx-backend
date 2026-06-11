export interface ProjectContext {
  projectName: string;
  targetDir: string;
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
  framework: 'express' | 'fastify' | 'hono';
  language: 'ts' | 'js';
  database: 'postgres' | 'mongodb' | 'mysql' | 'sqlite' | 'none';
  orm: 'prisma' | 'drizzle' | 'mongoose' | 'none';
  auth: 'jwt' | 'better-auth' | 'none';
  validation: 'zod' | 'none';
  apiType: 'rest' | 'graphql' | 'trpc';
  docker: boolean;
  swagger: boolean;
  eslint: boolean;
  prettier: boolean;
  husky: boolean;
  git: boolean;
  install: boolean;

  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  files: Record<string, string>; // relativePath -> content
  scripts: Record<string, string>;
  env: Record<string, string>;
}

export interface GeneratorPlugin {
  name: string;
  onInstall?: (ctx: ProjectContext) => void | Promise<void>;
  onGenerate?: (ctx: ProjectContext) => void | Promise<void>;
}
