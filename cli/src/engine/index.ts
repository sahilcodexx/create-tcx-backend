import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import ora from 'ora';
import picocolors from 'picocolors';
import { ProjectContext } from '../registry/types.js';

export async function generateProject(ctx: ProjectContext): Promise<void> {
  const spinner = ora({
    text: 'Scaffolding project files...',
    color: 'cyan'
  }).start();

  try {
    // 1. Create target directory
    fs.ensureDirSync(ctx.targetDir);

    // 2. Add language dependencies
    if (ctx.language === 'ts') {
      ctx.devDependencies['typescript'] = '^5.5.4';
      ctx.devDependencies['tsx'] = '^4.16.2';
      ctx.devDependencies['@types/node'] = '^22.0.0';
      
      // tsconfig.json
      const isEsm = ctx.moduleSystem === 'esm';
      ctx.files['tsconfig.json'] = JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          module: isEsm ? 'NodeNext' : 'CommonJS',
          moduleResolution: isEsm ? 'NodeNext' : 'Node',
          esModuleInterop: true,
          strict: true,
          skipLibCheck: true,
          outDir: './dist',
          rootDir: './src',
          paths: {
            "@/*": ["./src/*"]
          }
        },
        include: ['src/**/*']
      }, null, 2);
    } else {
      ctx.devDependencies['nodemon'] = '^3.1.4';
    }

    // 3. Write all registry files
    for (const [relPath, content] of Object.entries(ctx.files)) {
      const fullPath = path.join(ctx.targetDir, relPath);
      fs.ensureDirSync(path.dirname(fullPath));
      fs.writeFileSync(fullPath, content.trim() + '\n');
    }

    // 4. Construct package.json
    const basePackageJson: any = {
      name: ctx.projectName,
      version: '1.0.0',
      private: true,
      scripts: {
        ...ctx.scripts
      },
      dependencies: {
        ...ctx.dependencies
      },
      devDependencies: {
        ...ctx.devDependencies
      }
    };

    if (ctx.moduleSystem === 'esm') {
      basePackageJson.type = 'module';
    }

    fs.writeFileSync(
      path.join(ctx.targetDir, 'package.json'),
      JSON.stringify(basePackageJson, null, 2) + '\n'
    );

    // 5. Construct .env and .env.example
    const envLines = Object.entries(ctx.env)
      .map(([k, v]) => `${k}=${v}`)
      .join('\n') + '\n';
    
    fs.writeFileSync(path.join(ctx.targetDir, '.env'), envLines);
    fs.writeFileSync(path.join(ctx.targetDir, '.env.example'), envLines);

    // 6. Generate README.md
    const readmeContent = `
# ${ctx.projectName}

Production-ready Node.js backend app. Generated with \`create-tcx-backend\`.

## Features
- **Framework**: ${ctx.framework}
- **Language**: ${ctx.language === 'ts' ? 'TypeScript' : 'JavaScript'}
- **Database**: ${ctx.database}
- **ORM**: ${ctx.orm}
- **Auth**: ${ctx.auth}

## Setup

1. Install dependencies:
   \`\`\`bash
   ${ctx.packageManager} install
   \`\`\`

2. Configure environment variables in \`.env\`.

3. Run in development mode:
   \`\`\`bash
   ${ctx.packageManager} run dev
   \`\`\`

4. Build and start in production:
   \`\`\`bash
   ${ctx.packageManager} run build
   ${ctx.packageManager} start
   \`\`\`
`;
    fs.writeFileSync(path.join(ctx.targetDir, 'README.md'), readmeContent.trim() + '\n');

    spinner.succeed(picocolors.green('Project scaffolded successfully!'));

    // 7. Initialize Git
    if (ctx.git) {
      const gitSpinner = ora('Initializing Git repository...').start();
      try {
        await execa('git', ['init'], { cwd: ctx.targetDir });
        fs.writeFileSync(path.join(ctx.targetDir, '.gitignore'), 'node_modules/\ndist/\n.env\n');
        gitSpinner.succeed(picocolors.green('Git repository initialized!'));
      } catch (err: any) {
        gitSpinner.fail(picocolors.red(`Git initialization failed: ${err.message}`));
      }
    }

    // 8. Install dependencies
    if (ctx.install) {
      const installSpinner = ora(`Installing dependencies using ${ctx.packageManager}...`).start();
      try {
        await execa(ctx.packageManager, ['install'], { cwd: ctx.targetDir });
        installSpinner.succeed(picocolors.green('Dependencies installed successfully!'));
      } catch (err: any) {
        installSpinner.fail(picocolors.red(`Dependency installation failed: ${err.message}`));
      }
    }

  } catch (error: any) {
    spinner.fail(picocolors.red('Scaffolding failed.'));
    throw error;
  }
}
