# create-tcx-backend

> Scaffold production-ready Node.js backends with a single command.

```bash
npx create-tcx-backend
```

---

## Overview

`create-tcx-backend` is an interactive CLI that generates a fully configured, opinionated Node.js backend based on your choices. You pick the framework, language, database, ORM, auth strategy, and tooling — the CLI wires everything together.

No templates to clone. No config files to copy-paste. Just run the command, answer the prompts, and start building.

---

## What gets generated

Every project includes:

- A working HTTP server with CORS and JSON parsing pre-configured
- A `src/config/` module that loads environment variables via `dotenv`
- A `src/utils/logger.ts` utility with `info`, `warn`, and `error` methods
- A `/api/health` endpoint that returns uptime and server status
- A centralized error handler (Express middleware or framework-equivalent)
- A `.env` and `.env.example` with all required keys pre-filled
- A `package.json` with the correct scripts for your language and framework

What gets added on top depends on your choices.

---

## Frameworks

| Framework | Version | Notes |
|-----------|---------|-------|
| Express   | `^4.19` | Includes `cors`, `express.json()`, and a 4-argument error handler |
| Fastify   | `^4.28` | Uses `@fastify/cors` and `setErrorHandler` |
| Hono      | `^4.4`  | Uses `@hono/node-server` adapter and `hono/cors` |

All three generate a `src/app.ts` (or `.js`) and a `src/server.ts` that calls `connectDatabase()` before starting the listener.

---

## Databases & ORMs

### Prisma

Generates a `prisma/schema.prisma` with a `User` model and a `PrismaClient` singleton in `src/database/index.ts`. Adds `db:generate` (`prisma generate`) and `db:migrate` (`prisma migrate dev`) scripts.

Supports: PostgreSQL, MySQL, SQLite.

### Drizzle

Generates a `drizzle.config.ts`, a `src/database/schema.ts` with a `users` table, and a connection setup in `src/database/index.ts` using the appropriate driver (`pg`, `mysql2`, or `better-sqlite3`). Adds `db:generate` (`drizzle-kit generate`) and `db:migrate` (`drizzle-kit migrate`) scripts.

Supports: PostgreSQL, MySQL, SQLite.

### Mongoose

Generates a `connectDatabase()` function using the native Mongoose `connect()` call. Reads `MONGODB_URI` from `.env`.

Supports: MongoDB only.

### No ORM

Generates native driver connection code (e.g., `pg.Pool`, `mysql2`, `better-sqlite3`, or the MongoDB native driver).

---

## Authentication

### JWT

Adds two files:

- `src/app/middlewares/auth.middleware.ts` — a `protect` middleware that reads the `Authorization: Bearer <token>` header, verifies it with `jsonwebtoken`, and attaches the decoded payload to `req.user`
- `src/app/controllers/auth.controller.ts` — `register` and `login` handlers using `bcryptjs` for password hashing

Routes are registered at `/api/auth` with `POST /register` and `POST /login`.

### Better Auth

Scaffolds the `better-auth` configuration in `src/config/auth.ts` and mounts the auth handler at `/api/auth`.

---

## Validation

### Zod

Adds a `src/app/validators/` directory with example schemas for validating request bodies. The generated validators export Zod schemas you can use with `safeParse()` in your controllers.

---

## API Formats

The CLI currently sets the `apiType` on the project context. Full GraphQL (Apollo Server) and tRPC route scaffolding is in active development. REST is fully supported today.

---

## Tooling

| Option | What it does |
|--------|-------------|
| Docker | Generates a multi-stage `Dockerfile` (builder → runner on `node:22-alpine`) and a `.dockerignore` |
| Swagger | Generates `src/config/swagger.ts` with an OpenAPI 3.0 document and mounts Swagger UI at `/api-docs` (Express only) |
| ESLint | Generates `eslint.config.js` using the flat config format. TypeScript projects also get `typescript-eslint` |
| Prettier | Generates `.prettierrc` with `singleQuote: true`, `semi: true`, `printWidth: 100` |
| Husky | Adds a `prepare` script and a `.lintstagedrc` that runs ESLint and Prettier on staged `src/` files |

---

## Scripts in the generated project

| Script | Command |
|--------|---------|
| `dev` | `tsx watch src/server.ts` (TS) or `nodemon src/server.js` (JS) |
| `build` | `tsc` (TypeScript only) |
| `start` | `node dist/server.js` (TS) or `node src/server.js` (JS) |
| `db:generate` | `prisma generate` or `drizzle-kit generate` |
| `db:migrate` | `prisma migrate dev` or `drizzle-kit migrate` |
| `prepare` | `husky` (if Husky was selected) |

---

## Project structure

```
src/
├── app/
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # auth.middleware, error.middleware
│   ├── models/             # Mongoose schemas or Drizzle table definitions
│   ├── routes/             # Route declarations
│   ├── services/           # Business logic
│   └── validators/         # Zod schemas
├── config/
│   ├── index.ts            # Environment config (port, jwtSecret, etc.)
│   └── swagger.ts          # OpenAPI document (if Swagger selected)
├── database/
│   ├── index.ts            # connectDatabase() and db/prisma export
│   └── schema.ts           # Drizzle schema (if Drizzle selected)
├── utils/
│   └── logger.ts           # Minimal logger
├── app.ts                  # Framework instance, middleware, routes
└── server.ts               # Starts the server after DB connects
```

---

## Monorepo

This repository is an npm workspace with two packages:

- `cli/` — the `create-tcx-backend` package published to npm
- `web/` — companion web interface (in progress)

To work on the CLI locally:

```bash
npm install
npm run cli:dev       # run the CLI in watch mode
npm run build --workspace=cli
```

---

## Requirements

- Node.js `>= 22.0.0`

---

## License

MIT