#!/usr/bin/env node

import { program } from 'commander';
import { askQuestions } from './prompts.js';
import { registry } from './registry/index.js';
import './registry/plugins-impl.js'; // Register frameworks and plugins
import { generateProject } from './engine/index.js';
import { checkForUpdates } from './utils/version-check.js';
import { VERSION } from './version.js';
import picocolors from 'picocolors';

async function main() {
  program
    .name('create-tcx-backend')
    .description('Scaffold production-ready Node.js backends in seconds')
    .version(VERSION);

  program.action(async () => {
    try {
      // Check for updates asynchronously (non-blocking)
      checkForUpdates().catch(() => {});

      const ctx = await askQuestions();
      if (!ctx) return;

      // Execute registry pipeline (dependency injection and file generators)
      await registry.run(ctx);

      // Scaffold final files, build package.json, run installer
      await generateProject(ctx);

      console.log('\n' + picocolors.green(picocolors.bold('▲ Successfully scaffolded project!')));
      console.log(`Next steps:\n`);
      if (ctx.projectName !== '.') {
        console.log(`  cd ${ctx.projectName}`);
      }
      if (!ctx.install) {
        console.log(`  ${ctx.packageManager} install`);
      }
      console.log(`  ${ctx.packageManager} run dev\n`);
    } catch (err: any) {
      console.error('\n' + picocolors.red(picocolors.bold('✖ Error during scaffolding:')) + ` ${err.message}`);
      process.exit(1);
    }
  });

  await program.parseAsync(process.argv);
}

main();
