"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  IconArrowLeft,
  IconBrandGithub,
  IconBrandNpm,
  IconCheck,
  IconCopy,
  IconTerminal2,
  IconDatabase,
  IconShield,
  IconSettings,
  IconFolderOpen,
  IconApi,
  IconPackage,
  IconChevronRight,
  IconMenu2,
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
  IconBolt,
} from "@tabler/icons-react";

/* ─── Nav items ─────────────────────────────────────────────────────────── */
const NAV: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: "introduction",  label: "Introduction",       icon: <IconTerminal2 size={15} /> },
  { id: "quickstart",   label: "Quick Start",         icon: <IconBolt size={15} /> },
  { id: "frameworks",   label: "Frameworks",          icon: <IconApi size={15} /> },
  { id: "databases",    label: "Databases & ORMs",    icon: <IconDatabase size={15} /> },
  { id: "auth",         label: "Authentication",      icon: <IconShield size={15} /> },
  { id: "validation",   label: "Validation",          icon: <IconCheck size={15} /> },
  { id: "tooling",      label: "Tooling",             icon: <IconSettings size={15} /> },
  { id: "scripts",      label: "Scripts Reference",   icon: <IconPackage size={15} /> },
  { id: "structure",    label: "Project Structure",   icon: <IconFolderOpen size={15} /> },
];

/* ─── Code block ─────────────────────────────────────────────────────────── */
function Code({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900 my-5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
        <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider">{lang}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors">
          {copied ? <><IconCheck size={12} className="text-green-500" /><span className="text-green-500">Copied</span></> : <><IconCopy size={12} />Copy</>}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] font-mono text-zinc-300 leading-6"><code>{code}</code></pre>
    </div>
  );
}

/* ─── Inline code ────────────────────────────────────────────────────────── */
function IC({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-[13px] text-zinc-300 bg-zinc-800/70 px-1.5 py-0.5 rounded">{children}</code>;
}

/* ─── Callout ────────────────────────────────────────────────────────────── */
function Callout({ type = "info", children }: { type?: "info" | "warn" | "tip"; children: React.ReactNode }) {
  const styles = {
    info: { border: "border-zinc-700",   bg: "bg-zinc-900",     icon: <IconInfoCircle size={15} className="text-zinc-400 shrink-0 mt-0.5" />,      label: "text-zinc-300" },
    warn: { border: "border-yellow-800/60", bg: "bg-yellow-950/30", icon: <IconAlertTriangle size={15} className="text-yellow-500 shrink-0 mt-0.5" />, label: "text-yellow-200" },
    tip:  { border: "border-sky-800/50", bg: "bg-sky-950/30",    icon: <IconBolt size={15} className="text-sky-400 shrink-0 mt-0.5" />,               label: "text-sky-200" },
  }[type];
  return (
    <div className={`my-5 flex gap-3 p-4 rounded-md border ${styles.border} ${styles.bg}`}>
      {styles.icon}
      <p className={`text-sm leading-relaxed ${styles.label}`}>{children}</p>
    </div>
  );
}

/* ─── Section heading ────────────────────────────────────────────────────── */
function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-lg font-semibold text-zinc-100 mt-10 mb-4 scroll-mt-20 flex items-center gap-2 group border-b border-zinc-800/60 pb-2">
      {children}
      <a href={`#${id}`} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity text-base">#</a>
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[15px] font-semibold text-zinc-200 mt-6 mb-2">{children}</h3>;
}

/* ─── Step ───────────────────────────────────────────────────────────────── */
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 mt-6">
      <div className="shrink-0 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] font-mono text-zinc-400 mt-0.5">{n}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-zinc-200 mb-1">{title}</p>
        {children}
      </div>
    </div>
  );
}

/* ─── Table ──────────────────────────────────────────────────────────────── */
function Table({ heads, rows }: { heads: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-zinc-800 my-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60">
            {heads.map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 ${j === 0 ? "font-mono text-zinc-300 text-[13px]" : "text-zinc-500 text-[13px]"}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Badge ──────────────────────────────────────────────────────────────── */
function Badge({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border ${accent ? "bg-sky-950/50 text-sky-400 border-sky-800/50" : "bg-zinc-800/60 text-zinc-400 border-zinc-700"}`}>
      {children}
    </span>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function DocsPage() {
  const [active, setActive] = useState("introduction");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { rootMargin: "-20% 0px -70% 0px" }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const Sidebar = () => (
    <aside className="flex flex-col gap-0.5 w-52 shrink-0">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-3 px-2">On this page</p>
      {NAV.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className={`flex items-center gap-2 px-2 py-1.5 rounded text-[13px] text-left w-full transition-all ${
            active === id
              ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
              : "text-zinc-500 hover:text-zinc-300 border border-transparent"
          }`}
        >
          <span className={active === id ? "text-sky-400" : "text-zinc-700"}>{icon}</span>
          {label}
          {active === id && <IconChevronRight size={11} className="ml-auto text-zinc-500" />}
        </button>
      ))}
      <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-col gap-0.5">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-1.5 rounded text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors border border-transparent">
          <IconBrandGithub size={14} />GitHub
        </a>
        <a href="https://npmjs.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-1.5 rounded text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors border border-transparent">
          <IconBrandNpm size={14} />npm
        </a>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-12">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(!open)} className="lg:hidden text-zinc-500 hover:text-zinc-300">
              {open ? <IconX size={18} /> : <IconMenu2 size={18} />}
            </button>
            <Link href="/" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-sm">
              <IconArrowLeft size={14} />
              <span className="font-mono hidden sm:inline">create-tcx-backend</span>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <Badge>v1.0.0</Badge>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"><IconBrandGithub size={16} /></a>
            <a href="https://npmjs.com" target="_blank" rel="noopener noreferrer" className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"><IconBrandNpm size={16} /></a>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/70 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="max-w-5xl mx-auto flex px-6 py-8 gap-10">
        {/* Desktop sidebar */}
        <div className="hidden lg:block sticky top-20 self-start h-fit"><Sidebar /></div>

        {/* Mobile drawer */}
        <div className={`fixed top-12 left-0 bottom-0 z-30 w-60 bg-[#0d0d0d] border-r border-zinc-800 p-5 transition-transform duration-200 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <Sidebar />
        </div>

        {/* Content */}
        <main className="flex-1 min-w-0 max-w-2xl">

          {/* Hero */}
          <div className="mb-8 pb-6 border-b border-zinc-800/60">
            <div className="flex items-center gap-2 mb-4">
              <Badge accent>docs</Badge>
              <Badge>v1.0.0</Badge>
              <Badge>Node.js ≥22</Badge>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 mb-3">create-tcx-backend</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              A CLI scaffolder that generates a fully configured, production-ready Node.js backend in under a minute.
              You answer a few prompts — the CLI writes the boilerplate so you can start on actual features.
            </p>
          </div>

          {/* ── Introduction ─────────────────────────────────────── */}
          <section id="introduction">
            <H2 id="introduction">Introduction</H2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              Setting up a Node.js backend from scratch is tedious. You copy the same folder structure, install the same packages, wire the same middleware, and configure the same environment variables — every single time.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              <IC>create-tcx-backend</IC> solves this with a single interactive command. It asks you what you need and generates a working project — not a template you have to gut, but a project that runs immediately and is structured the way you&apos;d structure it yourself.
            </p>

            <H3>What every generated project includes</H3>
            <ul className="space-y-2 mt-3">
              {[
                ["HTTP server", "Fully configured with CORS, JSON body parsing, and a centralized error handler."],
                ["/api/health", "A health-check endpoint that returns uptime, status, and environment."],
                ["Environment config", "A src/config/index.ts that reads and validates .env with dotenv. A .env.example is always generated."],
                ["Logger utility", "A minimal src/utils/logger.ts with info(), warn(), and error() — no heavy dependencies."],
                ["Correct scripts", "package.json scripts wired to your language (TypeScript or JavaScript) and framework."],
              ].map(([title, desc]) => (
                <li key={title as string} className="flex items-start gap-3 text-sm">
                  <IconCheck size={14} className="text-green-500 mt-0.5 shrink-0" />
                  <span className="text-zinc-400"><span className="text-zinc-300 font-medium">{title}</span> — {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Quick Start ───────────────────────────────────────── */}
          <section id="quickstart">
            <H2 id="quickstart">Quick Start</H2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-2">Run the scaffolder with <IC>npx</IC> — no global install needed:</p>
            <Code code="npx create-tcx-backend" lang="bash" />

            <Callout type="tip">
              Requires Node.js <strong>≥ 22.0.0</strong>. Run <IC>node --version</IC> to check. Use <a href="https://github.com/nvm-sh/nvm" className="underline underline-offset-2">nvm</a> to switch versions if needed.
            </Callout>

            <H3>The interactive prompts</H3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              After running the command you&apos;ll be asked a series of questions. Here&apos;s what each one means:
            </p>

            <Step n={1} title="Project name">
              <p className="text-sm text-zinc-500">The name of your project directory and the package.json <IC>name</IC> field.</p>
            </Step>
            <Step n={2} title="Language — TypeScript or JavaScript">
              <p className="text-sm text-zinc-500">TypeScript projects get full type declarations, <IC>tsconfig.json</IC>, and <IC>tsx</IC> for dev. JavaScript projects use <IC>nodemon</IC>.</p>
            </Step>
            <Step n={3} title="Framework — Express, Fastify, or Hono">
              <p className="text-sm text-zinc-500">Picks the HTTP layer. All three get the same folder structure — only the framework-specific wiring differs.</p>
            </Step>
            <Step n={4} title="Database & ORM">
              <p className="text-sm text-zinc-500">Determines which driver and schema files are generated. See the <button onClick={() => scrollTo("databases")} className="underline underline-offset-2 text-zinc-400">Databases & ORMs</button> section for the full breakdown.</p>
            </Step>
            <Step n={5} title="Auth strategy">
              <p className="text-sm text-zinc-500">Optionally scaffold JWT middleware + auth routes, or wire up Better Auth.</p>
            </Step>
            <Step n={6} title="Additional tooling">
              <p className="text-sm text-zinc-500">Multi-select: Docker, Swagger, ESLint, Prettier, Husky. All are independent — pick any combination.</p>
            </Step>

            <H3>After scaffolding</H3>
            <Code code={`cd my-project\nnpm install\nnpm run dev`} lang="bash" />
            <p className="text-sm text-zinc-400 leading-relaxed">
              Your server starts. Visit <IC>http://localhost:3000/api/health</IC> — if it responds, everything is wired correctly. Fill in your database credentials in <IC>.env</IC> and you&apos;re building.
            </p>
          </section>

          {/* ── Frameworks ───────────────────────────────────────── */}
          <section id="frameworks">
            <H2 id="frameworks">Frameworks</H2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              All three frameworks generate the same overall structure: a <IC>src/app.ts</IC> file that configures middleware and registers routes, and a <IC>src/server.ts</IC> that connects the database then starts the listener. The difference is only in which framework-specific APIs are used.
            </p>

            <Table
              heads={["Framework", "Version", "Adapter / cors / error handling"]}
              rows={[
                ["Express", "^4.19", "express.json() + cors + 4-argument error handler"],
                ["Fastify", "^4.28", "@fastify/cors + setErrorHandler()"],
                ["Hono", "^4.4", "@hono/node-server adapter + hono/cors middleware"],
              ]}
            />

            <H3>How the server is structured</H3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-2">
              Regardless of which framework you pick, <IC>src/server.ts</IC> always looks like this conceptually:
            </p>
            <Code lang="typescript" code={`import app from "./app";
import { connectDatabase } from "./database";
import { config } from "./config";

async function main() {
  await connectDatabase(); // waits for DB before accepting traffic
  app.listen(config.port, () => {
    logger.info(\`Server running on port \${config.port}\`);
  });
}

main().catch((err) => {
  logger.error("Failed to start server", err);
  process.exit(1);
});`} />
            <Callout type="info">
              The database connection is always awaited before the server starts. This prevents your app from accepting requests before it can actually serve them.
            </Callout>
          </section>

          {/* ── Databases ────────────────────────────────────────── */}
          <section id="databases">
            <H2 id="databases">Databases & ORMs</H2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              The database layer is generated in <IC>src/database/</IC>. Every option exports a <IC>connectDatabase()</IC> function and a client/instance you can import in your services.
            </p>

            <H3>Prisma</H3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-2">
              Generates <IC>prisma/schema.prisma</IC> with a starter <IC>User</IC> model, and a PrismaClient singleton in <IC>src/database/index.ts</IC> that handles the connection. Supported databases: <strong className="text-zinc-300">PostgreSQL, MySQL, SQLite</strong>.
            </p>
            <Code lang="typescript" code={`// src/database/index.ts (Prisma)
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function connectDatabase() {
  await prisma.$connect();
}`} />

            <H3>Drizzle</H3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-2">
              Generates <IC>drizzle.config.ts</IC>, a <IC>src/database/schema.ts</IC> with a <IC>users</IC> table, and a connection in <IC>src/database/index.ts</IC> using the right driver for your database. Supported: <strong className="text-zinc-300">PostgreSQL, MySQL, SQLite</strong>.
            </p>
            <Code lang="typescript" code={`// src/database/schema.ts (Drizzle + PostgreSQL)
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id:        serial("id").primaryKey(),
  email:     text("email").notNull().unique(),
  password:  text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});`} />

            <H3>Mongoose</H3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-2">
              Generates a <IC>connectDatabase()</IC> function that calls <IC>mongoose.connect()</IC> using <IC>MONGODB_URI</IC> from your <IC>.env</IC>. Supported: <strong className="text-zinc-300">MongoDB</strong>.
            </p>
            <Code lang="typescript" code={`// src/database/index.ts (Mongoose)
import mongoose from "mongoose";
import { config } from "../config";

export async function connectDatabase() {
  await mongoose.connect(config.mongodbUri);
}`} />

            <H3>No ORM</H3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Generates raw driver connection code with no abstraction layer — <IC>pg.Pool</IC> for PostgreSQL, <IC>mysql2</IC> for MySQL, <IC>better-sqlite3</IC> for SQLite, or the native MongoDB driver. Use this when you want full control over your queries.
            </p>

            <Callout type="warn">
              After scaffolding with Prisma or Drizzle, run <IC>npm run db:generate</IC> before starting the dev server for the first time.
            </Callout>
          </section>

          {/* ── Auth ─────────────────────────────────────────────── */}
          <section id="auth">
            <H2 id="auth">Authentication</H2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              Auth is optional — skip it if you&apos;re building an internal service or handling auth elsewhere. If you select it, you get one of two strategies:
            </p>

            <H3>JWT <Badge accent>recommended</Badge></H3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-2">
              Generates two files and registers them on <IC>/api/auth</IC>:
            </p>
            <ul className="space-y-1.5 text-sm text-zinc-400 mb-4">
              <li className="flex items-start gap-2"><IconCheck size={13} className="text-zinc-600 mt-0.5 shrink-0" /><span><IC>auth.controller.ts</IC> — <IC>register</IC> hashes the password with <IC>bcryptjs</IC> and saves the user. <IC>login</IC> verifies the password and returns a signed JWT.</span></li>
              <li className="flex items-start gap-2"><IconCheck size={13} className="text-zinc-600 mt-0.5 shrink-0" /><span><IC>auth.middleware.ts</IC> — a <IC>protect</IC> middleware that reads the <IC>Authorization: Bearer &lt;token&gt;</IC> header, verifies it, and attaches the payload to <IC>req.user</IC>.</span></li>
            </ul>
            <Code lang="typescript" code={`// Using the protect middleware on any route
import { protect } from "../middlewares/auth.middleware";

router.get("/profile", protect, (req, res) => {
  // req.user is the decoded JWT payload
  res.json({ user: req.user });
});`} />

            <Callout type="warn">
              Set <IC>JWT_SECRET</IC> in your <IC>.env</IC> to a long, random string before deploying. Never commit this value.
            </Callout>

            <H3>Better Auth</H3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Scaffolds the <IC>better-auth</IC> config in <IC>src/config/auth.ts</IC> and mounts the auth handler at <IC>/api/auth/*</IC>. Better Auth handles sessions, OAuth providers, email verification, and more out of the box. Refer to the{" "}
              <a href="https://better-auth.com" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2">Better Auth docs</a>{" "}
              for provider setup.
            </p>
          </section>

          {/* ── Validation ───────────────────────────────────────── */}
          <section id="validation">
            <H2 id="validation">Validation</H2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              If you select Zod, the CLI generates a <IC>src/app/validators/</IC> directory with starter schemas. Validation is intentionally kept in a separate layer from controllers — schemas are pure, reusable, and testable without spinning up a server.
            </p>

            <H3>Using validators in a controller</H3>
            <Code lang="typescript" code={`// src/app/validators/auth.validator.ts
import { z } from "zod";

export const registerSchema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name:     z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;`} />
            <Code lang="typescript" code={`// src/app/controllers/auth.controller.ts
import { registerSchema } from "../validators/auth.validator";

export const register = async (req, res) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.flatten().fieldErrors,
    });
  }

  const { email, password } = result.data;
  // ... create user
};`} />
            <Callout type="tip">
              <IC>safeParse</IC> never throws — it always returns a result object. Prefer it over <IC>parse</IC> inside request handlers so validation errors are handled gracefully.
            </Callout>
          </section>

          {/* ── Tooling ──────────────────────────────────────────── */}
          <section id="tooling">
            <H2 id="tooling">Tooling</H2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              All tooling options are independent — select any combination. They&apos;re generated as standalone config files and do not affect the core application code.
            </p>

            <H3>Docker</H3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-2">
              Generates a multi-stage <IC>Dockerfile</IC> that keeps the final image small. The <IC>builder</IC> stage compiles TypeScript; the <IC>runner</IC> stage copies only the compiled output and <IC>node_modules</IC>.
            </p>
            <Code lang="dockerfile" code={`# Generated Dockerfile (simplified)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]`} />

            <H3>Swagger / OpenAPI</H3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Generates <IC>src/config/swagger.ts</IC> with a starter OpenAPI 3.0 document and mounts Swagger UI at <IC>/api-docs</IC>. Currently supported on <strong className="text-zinc-300">Express</strong> only. Open <IC>http://localhost:3000/api-docs</IC> after starting the server to explore your API.
            </p>

            <H3>ESLint + Prettier</H3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-2">
              ESLint uses the flat config format (<IC>eslint.config.js</IC>). TypeScript projects automatically get <IC>typescript-eslint</IC> rules. Prettier is configured with:
            </p>
            <Code lang="json" code={`{
  "singleQuote": true,
  "semi": true,
  "printWidth": 100,
  "trailingComma": "es5"
}`} />

            <H3>Husky + lint-staged</H3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Adds a <IC>prepare</IC> script that installs Git hooks, and a <IC>.lintstagedrc</IC> that runs ESLint and Prettier on every staged file in <IC>src/</IC> before each commit. This ensures no unformatted or broken code lands in your history.
            </p>
          </section>

          {/* ── Scripts ──────────────────────────────────────────── */}
          <section id="scripts">
            <H2 id="scripts">Scripts Reference</H2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              These scripts are available in the generated project. Some are conditionally included depending on your choices.
            </p>
            <Table
              heads={["Script", "Command", "When available"]}
              rows={[
                ["dev", "tsx watch src/server.ts  OR  nodemon src/server.js", "Always"],
                ["build", "tsc", "TypeScript only"],
                ["start", "node dist/server.js  OR  node src/server.js", "Always"],
                ["db:generate", "prisma generate  OR  drizzle-kit generate", "Prisma or Drizzle"],
                ["db:migrate", "prisma migrate dev  OR  drizzle-kit migrate", "Prisma or Drizzle"],
                ["lint", "eslint src/", "ESLint selected"],
                ["format", "prettier --write src/", "Prettier selected"],
                ["prepare", "husky", "Husky selected"],
              ]}
            />
            <Callout type="info">
              <IC>npm run dev</IC> uses hot-reload (<IC>tsx watch</IC> for TS, <IC>nodemon</IC> for JS) — the server restarts automatically when you save a file.
            </Callout>
          </section>

          {/* ── Project Structure ─────────────────────────────────── */}
          <section id="structure">
            <H2 id="structure">Project Structure</H2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              The generated project follows a consistent, layered architecture regardless of which options you chose. Here&apos;s the full structure with every optional directory included:
            </p>
            <Code lang="text" code={`my-project/
├── prisma/
│   └── schema.prisma          # Prisma schema (if Prisma selected)
├── src/
│   ├── app/
│   │   ├── controllers/       # Route handlers — call services, return responses
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts   # JWT protect() (if JWT auth selected)
│   │   │   └── error.middleware.ts  # Centralized error handler
│   │   ├── models/            # Mongoose schemas OR Drizzle table defs
│   │   ├── routes/            # Route declarations — import controllers here
│   │   ├── services/          # Business logic — called by controllers
│   │   └── validators/        # Zod schemas (if Zod selected)
│   ├── config/
│   │   ├── index.ts           # Reads .env, exports typed config object
│   │   ├── auth.ts            # Better Auth setup (if Better Auth selected)
│   │   └── swagger.ts         # OpenAPI document (if Swagger selected)
│   ├── database/
│   │   ├── index.ts           # connectDatabase() + client/prisma export
│   │   └── schema.ts          # Drizzle schema file (if Drizzle selected)
│   ├── utils/
│   │   └── logger.ts          # Minimal logger: info, warn, error
│   ├── app.ts                 # Framework setup, middleware, route registration
│   └── server.ts              # Connects DB, starts listener
├── .env                       # Your secrets — never commit this
├── .env.example               # Safe to commit — shows required keys
├── .dockerignore              # Docker ignore (if Docker selected)
├── Dockerfile                 # Multi-stage build (if Docker selected)
├── drizzle.config.ts          # Drizzle config (if Drizzle selected)
├── eslint.config.js           # ESLint flat config (if ESLint selected)
├── .prettierrc                # Prettier config (if Prettier selected)
├── .lintstagedrc              # lint-staged config (if Husky selected)
├── tsconfig.json              # TypeScript config (if TypeScript selected)
└── package.json`} />

            <H3>Design decisions</H3>
            <ul className="space-y-2 text-sm text-zinc-400 mt-3">
              <li className="flex items-start gap-2">
                <span className="text-zinc-600 mt-0.5">—</span>
                <span><strong className="text-zinc-300">Controllers are thin.</strong> They validate input, call a service, and return a response. No business logic lives here.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-600 mt-0.5">—</span>
                <span><strong className="text-zinc-300">Services own the logic.</strong> Database queries, calculations, third-party calls — all go in services. This makes them independently testable.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-600 mt-0.5">—</span>
                <span><strong className="text-zinc-300">Config is centralized.</strong> Everything reads from <IC>src/config/index.ts</IC>. No scattered <IC>process.env</IC> calls throughout the codebase.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-600 mt-0.5">—</span>
                <span><strong className="text-zinc-300">Errors are centralized.</strong> Throw anywhere — the error middleware catches everything and formats a consistent response.</span>
              </li>
            </ul>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-zinc-800/60 flex items-center justify-between">
              <p className="text-xs text-zinc-600 font-mono">MIT License</p>
              <Link href="/" className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono">
                <IconArrowLeft size={12} />back to home
              </Link>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
