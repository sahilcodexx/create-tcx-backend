import * as p from '@clack/prompts';
import { z } from 'zod';
import fs from 'fs-extra';
import path from 'path';
import picocolors from 'picocolors';
import { ProjectContext } from './registry/types.js';

const projectNameSchema = z.string()
  .min(1, 'Project name is required')
  .regex(/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$|^\.$/, 'Invalid project name');

export async function askQuestions(): Promise<ProjectContext | null> {
  p.intro(picocolors.cyan(picocolors.bold('▲ CREATE TCX BACKEND')));

  // 1. Project Name
  const projectNameRes = await p.text({
    message: 'What is your project name?',
    placeholder: 'my-tcx-backend',
    defaultValue: 'my-tcx-backend',
    validate: (value) => {
      const parsed = projectNameSchema.safeParse(value);
      if (!parsed.success) {
        return parsed.error.errors[0].message;
      }
      return;
    }
  });

  if (p.isCancel(projectNameRes)) {
    p.cancel('Scaffolding cancelled.');
    return null;
  }

  const projectName = projectNameRes as string;
  const isCurrentDir = projectName === '.';
  const targetDir = path.resolve(process.cwd(), projectName);
  const displayProjectName = isCurrentDir ? path.basename(targetDir) : projectName;

  if (isCurrentDir && fs.existsSync(targetDir)) {
    const files = fs.readdirSync(targetDir);
    if (files.length > 0 && !files.every(f => f === '.git' || f === '.gitignore')) {
      const proceed = await p.confirm({
        message: 'Current directory is not empty. Do you want to continue?',
        initialValue: true
      });
      if (p.isCancel(proceed) || !proceed) {
        p.cancel('Scaffolding cancelled.');
        return null;
      }
    }
  } else if (!isCurrentDir && fs.existsSync(targetDir)) {
    const force = await p.confirm({
      message: `Directory "${projectName}" already exists. Overwrite?`,
      initialValue: false
    });
    if (p.isCancel(force) || !force) {
      p.cancel('Scaffolding cancelled.');
      return null;
    }
    // Delete existing folder contents
    fs.emptyDirSync(targetDir);
  }

  // 2. Package Manager
  const packageManager = await p.select({
    message: 'Select a package manager:',
    options: [
      { value: 'npm', label: 'npm' },
      { value: 'pnpm', label: 'pnpm' },
      { value: 'yarn', label: 'yarn' },
      { value: 'bun', label: 'bun' }
    ]
  });

  if (p.isCancel(packageManager)) {
    p.cancel('Scaffolding cancelled.');
    return null;
  }

  // 3. Framework
  const framework = await p.select({
    message: 'Select a framework:',
    options: [
      { value: 'express', label: 'Express (Classic & Simple)' },
      { value: 'fastify', label: 'Fastify (Fast & Modern)' },
      { value: 'hono', label: 'Hono (Ultra-lightweight)' }
    ]
  });

  if (p.isCancel(framework)) {
    p.cancel('Scaffolding cancelled.');
    return null;
  }

  // 4. Language
  const language = await p.select({
    message: 'Select language:',
    options: [
      { value: 'ts', label: 'TypeScript' },
      { value: 'js', label: 'JavaScript' }
    ]
  });

  if (p.isCancel(language)) {
    p.cancel('Scaffolding cancelled.');
    return null;
  }

  // 5. Database
  const database = await p.select({
    message: 'Select a database:',
    options: [
      { value: 'postgres', label: 'PostgreSQL' },
      { value: 'mongodb', label: 'MongoDB' },
      { value: 'mysql', label: 'MySQL' },
      { value: 'sqlite', label: 'SQLite' },
      { value: 'none', label: 'None' }
    ]
  });

  if (p.isCancel(database)) {
    p.cancel('Scaffolding cancelled.');
    return null;
  }

  // 6. ORM/ODM (Restricted dynamically based on database)
  const ormOptions = [];
  if (database === 'mongodb') {
    ormOptions.push({ value: 'mongoose', label: 'Mongoose' });
    ormOptions.push({ value: 'none', label: 'None' });
  } else if (database !== 'none') {
    ormOptions.push({ value: 'prisma', label: 'Prisma' });
    ormOptions.push({ value: 'drizzle', label: 'Drizzle' });
    ormOptions.push({ value: 'none', label: 'None' });
  } else {
    ormOptions.push({ value: 'none', label: 'None' });
  }

  const orm = await p.select({
    message: 'Select an ORM/ODM:',
    options: ormOptions
  });

  if (p.isCancel(orm)) {
    p.cancel('Scaffolding cancelled.');
    return null;
  }

  // 7. Authentication
  const auth = await p.select({
    message: 'Select authentication:',
    options: [
      { value: 'none', label: 'None' },
      { value: 'jwt', label: 'JWT (jsonwebtoken + bcrypt)' },
      { value: 'better-auth', label: 'Better Auth (Modular API auth)' }
    ]
  });

  if (p.isCancel(auth)) {
    p.cancel('Scaffolding cancelled.');
    return null;
  }

  // 8. Validation
  const validation = await p.select({
    message: 'Select validation library:',
    options: [
      { value: 'none', label: 'None' },
      { value: 'zod', label: 'Zod' }
    ]
  });

  if (p.isCancel(validation)) {
    p.cancel('Scaffolding cancelled.');
    return null;
  }

  // 9. API Type
  const apiType = await p.select({
    message: 'Select API layer type:',
    options: [
      { value: 'rest', label: 'REST API' },
      { value: 'graphql', label: 'GraphQL (Apollo Server)' },
      { value: 'trpc', label: 'tRPC' }
    ]
  });

  if (p.isCancel(apiType)) {
    p.cancel('Scaffolding cancelled.');
    return null;
  }

  // Multi-select for optional features (using yes/no prompts or clack group)
  const docker = await p.confirm({ message: 'Include Docker support?', initialValue: true });
  if (p.isCancel(docker)) return null;

  const swagger = await p.confirm({ message: 'Include Swagger API Documentation?', initialValue: true });
  if (p.isCancel(swagger)) return null;

  const eslint = await p.confirm({ message: 'Include ESLint settings?', initialValue: true });
  if (p.isCancel(eslint)) return null;

  const prettier = await p.confirm({ message: 'Include Prettier settings?', initialValue: true });
  if (p.isCancel(prettier)) return null;

  const husky = await p.confirm({ message: 'Include Husky + lint-staged hooks?', initialValue: true });
  if (p.isCancel(husky)) return null;

  const git = await p.confirm({ message: 'Initialize Git repository?', initialValue: true });
  if (p.isCancel(git)) return null;

  const install = await p.confirm({ message: 'Install dependencies automatically?', initialValue: true });
  if (p.isCancel(install)) return null;

  return {
    projectName: displayProjectName,
    targetDir,
    packageManager: packageManager as any,
    framework: framework as any,
    language: language as any,
    database: database as any,
    orm: orm as any,
    auth: auth as any,
    validation: validation as any,
    apiType: apiType as any,
    docker,
    swagger,
    eslint,
    prettier,
    husky,
    git,
    install,
    dependencies: {},
    devDependencies: {},
    files: {},
    scripts: {},
    env: {}
  };
}
