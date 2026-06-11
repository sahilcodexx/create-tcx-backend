# create-tcx-backend 🚀

A modern, fast, and production-ready CLI scaffolding wizard for Node.js backends. Think **"Vite for Backend Development"**.

## Features

- **Interactive Prompts**: Powered by `@clack/prompts` for a beautiful, responsive terminal wizard.
- **Node 22+ & TypeScript Native**: Built to generate strict TypeScript templates or standard ESM JavaScript setups.
- **Extensible Plugin Registry**: Frameworks, databases, ORMs, and quality tools are configured as independent plugins. Adding support for new ORMs or frameworks requires zero changes to core CLI logic.
- **Full Scaffolding Configs**: Automatically handles environment configuration, connection configs, routes, error handlers, and DTO/validations.

---

## Usage

Generate your backend directly with:

```bash
npm create tcx-backend
```

or

```bash
npx create-tcx-backend
```

---

## Interactive Wizard Flow

The installer will guide you through the following setup steps:

1. **Project Name**: Choose a folder name (default: `my-tcx-backend`), or use `.` to install in the current directory.
2. **Package Manager**: npm, pnpm, yarn, or bun.
3. **Framework**: Express.js, Fastify, or Hono.
4. **Language**: TypeScript (strict configs) or JavaScript (ESM).
5. **Database**: PostgreSQL, MongoDB, MySQL, SQLite, or None.
6. **ORM/ODM**: Prisma, Drizzle, or Mongoose. (Dynamically filtered based on database selection).
7. **Authentication**: JWT Auth boilerplate or Better Auth.
8. **Validation**: Zod schema middleware configuration.
9. **API Style**: REST API (default), GraphQL (Apollo), or tRPC.
10. **Addons**: Multi-select for Docker, Swagger Docs, ESLint, Prettier, Husky & lint-staged.
11. **Git & Install**: Automatically initialize Git repositories and install package dependencies.

---

## Scaffolding Architecture

Scaffolded projects conform to a clean-code folder layout:

```txt
src/
├── app/
│   ├── controllers/      # Route controllers (Express / Fastify / Hono)
│   ├── routes/           # Routing middleware mounting
│   ├── middlewares/      # Error handlers, JWT guards, Zod parsers
│   └── validators/       # Input schemas (Zod)
├── config/               # Environment variable validation & mapping
├── database/             # Database connection setups & ORM clients
├── utils/                # Loggers, utilities, and helper libraries
└── server.ts             # Application entrypoint
```

---

## Extending the CLI (Plugin Registry)

Developers can register new plugins inside `src/registry/plugins-impl.ts` using the registry helper hooks:

```typescript
import { registry } from './index.js';

registry.registerFramework('my-new-framework', {
  name: 'my-new-framework',
  onInstall(ctx) {
    ctx.dependencies['my-framework-package'] = '^1.0.0';
  },
  onGenerate(ctx) {
    const ext = ctx.language === 'ts' ? 'ts' : 'js';
    ctx.files[`src/app.${ext}`] = `// Framework starter template`;
  }
});
```
