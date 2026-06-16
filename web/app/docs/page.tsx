"use client";

import { useState, useEffect } from "react";
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
  IconSparkles,
  IconBook,
  IconCode,
  IconScript,
  IconListTree,
} from "@tabler/icons-react";

/* ─── Nav ─────────────────────────────────────────────────────────────────── */
const NAV = [
  {
    group: "Getting Started",
    items: [
      { id: "introduction", label: "Introduction", icon: <IconSparkles size={14} /> },
      { id: "installation", label: "Installation", icon: <IconTerminal2 size={14} /> },
      { id: "what-you-get", label: "What you get", icon: <IconBook size={14} /> },
    ],
  },
  {
    group: "Guides",
    items: [
      { id: "frameworks",  label: "Frameworks",  icon: <IconApi size={14} /> },
      { id: "databases",   label: "Databases & ORMs", icon: <IconDatabase size={14} /> },
      { id: "auth",        label: "Authentication",   icon: <IconShield size={14} /> },
      { id: "validation",  label: "Validation",       icon: <IconCheck size={14} /> },
      { id: "api-type",    label: "API Type",         icon: <IconCode size={14} /> },
      { id: "tooling",     label: "Tooling",          icon: <IconSettings size={14} /> },
    ],
  },
  {
    group: "Reference",
    items: [
      { id: "scripts",    label: "Scripts",          icon: <IconScript size={14} /> },
      { id: "structure",  label: "Project Structure", icon: <IconListTree size={14} /> },
    ],
  },
];

const ALL_IDS = NAV.flatMap((g) => g.items.map((i) => i.id));

/* ─── Components ──────────────────────────────────────────────────────────── */
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }}
      className="absolute right-3 top-3 text-zinc-600 hover:text-zinc-300 transition-colors"
      aria-label="Copy code"
    >
      {copied ? <IconCheck size={14} className="text-green-500" /> : <IconCopy size={14} />}
    </button>
  );
}

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  return (
    <div className="relative my-5 rounded-xl border border-zinc-800/70 bg-zinc-900/80 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50 bg-zinc-900/50">
        <span className="text-[11px] font-mono text-zinc-600">{lang}</span>
      </div>
      <CopyButton code={code} />
      <pre className="p-4 overflow-x-auto text-[13px] font-mono text-zinc-300 leading-relaxed"><code>{code}</code></pre>
    </div>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="relative rounded-md bg-zinc-800/70 px-[5px] py-[3px] font-mono text-[13px] text-zinc-200 border border-zinc-700/50">{children}</code>;
}

function Callout({ type = "info", title, children }: { type?: "info" | "warn" | "tip"; title?: string; children: React.ReactNode }) {
  const s = {
    info: { wrap: "border-zinc-700/40 bg-zinc-900/30",  icon: <IconInfoCircle size={15} className="text-zinc-500 shrink-0 mt-0.5" /> },
    warn: { wrap: "border-yellow-700/30 bg-yellow-950/15", icon: <IconAlertTriangle size={15} className="text-yellow-600 shrink-0 mt-0.5" /> },
    tip:  { wrap: "border-sky-700/30 bg-sky-950/15",    icon: <IconBolt size={15} className="text-sky-500 shrink-0 mt-0.5" /> },
  }[type];
  return (
    <div className={`my-5 flex gap-3 rounded-xl border p-4 ${s.wrap}`}>
      <div className="mt-0.5">{s.icon}</div>
      <div className="text-[13.5px] leading-relaxed text-zinc-400">
        {title && <p className="font-semibold text-zinc-200 mb-1">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="group scroll-mt-24 text-lg font-semibold text-zinc-100 mt-14 mb-4 flex items-center gap-2">
      {children}
      <a href={`#${id}`} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity text-sm ml-1">#</a>
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[15px] font-semibold text-zinc-200 mt-8 mb-3">{children}</h3>;
}

function H4({ children }: { children: React.ReactNode }) {
  return <h4 className="text-[13.5px] font-medium text-zinc-300 mt-6 mb-2">{children}</h4>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[14px] text-zinc-400 leading-relaxed mb-4">{children}</p>;
}

function Divider() {
  return <hr className="border-t border-zinc-800/40 my-12" />;
}

function Table({ heads, rows }: { heads: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="my-5 overflow-hidden rounded-xl border border-zinc-800/60">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/40">
            {heads.map((h) => <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-zinc-500">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-800/30 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 ${j === 0 ? "font-mono text-zinc-300" : "text-zinc-500"}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "accent" | "outline" }) {
  const s = {
    default: "bg-zinc-800/60 text-zinc-400 border-zinc-700/40",
    accent: "bg-sky-950/30 text-sky-400 border-sky-800/30",
    outline: "bg-transparent text-zinc-500 border-zinc-700/20",
  }[variant];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono border ${s}`}>
      {children}
    </span>
  );
}

function FeatureCard({ icon, name, desc }: { icon: React.ReactNode; name: string; desc: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-4">
      <div className="mt-0.5 shrink-0 text-emerald-600">{icon}</div>
      <div>
        <p className="text-[13.5px] font-medium text-zinc-200">{name}</p>
        <p className="text-[13px] text-zinc-500 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="flex gap-4 py-3 border-b border-zinc-800/30 last:border-0">
      <span className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-zinc-800/80 text-[11px] font-mono text-zinc-400 mt-0.5">{n}</span>
      <div>
        <p className="text-[13.5px] font-medium text-zinc-200">{title}</p>
        <p className="text-[13px] text-zinc-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Layer({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="flex gap-3 text-[13.5px] py-1.5">
      <InlineCode>{name}</InlineCode>
      <span className="text-zinc-500 leading-relaxed">{desc}</span>
    </div>
  );
}

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
function Sidebar({ active, scrollTo }: { active: string; scrollTo: (id: string) => void }) {
  return (
    <aside className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-4 border-b border-zinc-800/40 mb-4">
        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700/50">
          <IconBolt size={13} className="text-zinc-400" />
        </div>
        <span className="text-sm font-medium text-zinc-200">create-tcx-backend</span>
      </div>
      {NAV.map((group) => (
        <div key={group.group} className="mb-5">
          <p className="text-[11px] font-semibold tracking-widest text-zinc-600 mb-1.5 px-3 uppercase">{group.group}</p>
          <div className="flex flex-col gap-0.5">
            {group.items.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] text-left w-full transition-all ${
                  active === id
                    ? "bg-zinc-800/70 text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30"
                }`}
              >
                <span className={`shrink-0 ${active === id ? "text-zinc-400" : "text-zinc-600 group-hover:text-zinc-500"}`}>{icon}</span>
                {label}
                {active === id && <span className="ml-auto w-1 h-4 rounded-full bg-zinc-500" />}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-auto pt-4 border-t border-zinc-800/40 flex flex-col gap-0.5">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 transition-colors">
          <IconBrandGithub size={14} className="text-zinc-600" />GitHub
        </a>
        <a href="https://npmjs.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 transition-colors">
          <IconBrandNpm size={14} className="text-zinc-600" />npm
        </a>
      </div>
    </aside>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function DocsPage() {
  const [active, setActive] = useState("introduction");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    ALL_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { rootMargin: "-10% 0px -80% 0px" }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/50 bg-zinc-950/95 backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-between px-4 h-12">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-zinc-500 hover:text-zinc-300">
            {mobileOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
          </button>
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors text-sm font-mono">
              <IconArrowLeft size={13} />
              home
            </Link>
            <Badge variant="outline">v1.0.0</Badge>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/70 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Mobile sidebar */}
      <div className={`fixed top-12 left-0 bottom-0 z-30 w-60 bg-zinc-950 border-r border-zinc-800/50 overflow-y-auto transition-transform duration-200 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar active={active} scrollTo={scrollTo} />
      </div>

      {/* Desktop layout */}
      <div className="max-w-7xl mx-auto flex px-4 lg:px-6">
        {/* Left sidebar */}
        <div className="hidden lg:flex flex-col w-56 shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-zinc-800/40 py-4 pr-4">
          <Sidebar active={active} scrollTo={scrollTo} />
        </div>

        {/* Content */}
        <main className="flex-1 min-w-0 py-8 lg:py-14 px-4 lg:px-10 xl:px-14 max-w-3xl">

          {/* Introduction */}
          <section id="introduction">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="accent">Docs</Badge>
              <Badge>v1.0.0</Badge>
              <Badge>Node.js ≥22</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100 mb-2">create-tcx-backend</h1>
            <p className="text-[15px] text-zinc-500 mb-6">Scaffold production-ready Node.js backends with a single command.</p>

            <P>
              <InlineCode>create-tcx-backend</InlineCode> is an interactive CLI scaffolder. Run it, answer a few questions about your stack, and get a complete, working backend project — no manual setup required.
            </P>

            <P>
              Think of it like a backend-focused <InlineCode>create-react-app</InlineCode>. One command, then you have a project that compiles, connects to a database, handles errors, and serves health checks — before you write any of your own code.
            </P>

            <H3>Why it exists</H3>
            <P>
              Every Node.js project starts with the same 30 minutes of busywork: install the framework, add CORS, wire up dotenv, write a logger, connect the database, set up error handling, create the folder structure. That time adds up across projects. <InlineCode>create-tcx-backend</InlineCode> does it for you so you can start building right away.
            </P>

            <div className="my-6 grid gap-3 sm:grid-cols-2">
              <FeatureCard icon={<IconCheck size={14} />} name="Plugin pipeline" desc="Composable generators for framework, DB, auth, validation, and tooling — all independent, all fit together." />
              <FeatureCard icon={<IconCheck size={14} />} name="Consistent structure" desc="Same folder layout regardless of choices. Optional directories appear only when needed." />
              <FeatureCard icon={<IconCheck size={14} />} name="No lock-in" desc="Generated code is yours. Delete, rename, reorganize — it is a starting point, not a framework." />
              <FeatureCard icon={<IconCheck size={14} />} name="Zero config" desc="Runs via npx. No global install, no configuration files, no setup." />
            </div>
          </section>

          <Divider />

          {/* Installation */}
          <section id="installation">
            <H2 id="installation">Installation</H2>

            <P>
              No installation needed. Run directly with <InlineCode>npx</InlineCode>:
            </P>
            <CodeBlock code="npx create-tcx-backend" lang="bash" />

            <Callout type="tip" title="Requirements">
              Node.js <strong className="text-zinc-200">≥ 22.0.0</strong>. Run <InlineCode>node --version</InlineCode> to check. Use <a href="https://github.com/nvm-sh/nvm" className="underline underline-offset-2 text-zinc-300 hover:text-zinc-100">nvm</a> to manage versions.
            </Callout>

            <H3>Prompt flow</H3>
            <P>The CLI walks you through 12 questions to configure your project:</P>

            <div className="my-4">
              <Step n={1} title="Project name" desc={'Becomes the folder name and package.json name. Use "." to scaffold in the current directory.'} />
              <Step n={2} title="Package manager" desc="npm, pnpm, yarn, or bun. Used for dependency installation and script execution." />
              <Step n={3} title="Framework" desc="Express, Fastify, or Hono. Determines the HTTP layer — the structure stays identical across all three." />
              <Step n={4} title="Language" desc="TypeScript gives you tsconfig.json, typed declarations, and tsx for hot-reload. JavaScript uses nodemon." />
              <Step n={5} title="Module system" desc="ES Modules (import/export) or CommonJS (require/module.exports). TypeScript projects default to ESM." />
              <Step n={6} title="Database" desc="PostgreSQL, MySQL, SQLite, MongoDB, or None. Determines which drivers are installed." />
              <Step n={7} title="ORM" desc="Prisma, Drizzle, Mongoose, or raw driver. Options filtered based on your database choice." />
              <Step n={8} title="Auth" desc="JWT (bcryptjs + jsonwebtoken), Better Auth, or None." />
              <Step n={9} title="Validation" desc="Zod or None." />
              <Step n={10} title="API type" desc="REST (ready). GraphQL and tRPC scaffolding are in development." />
              <Step n={11} title="Tooling" desc="Multi-select: Docker, Swagger, ESLint, Prettier, Husky — any combination." />
              <Step n={12} title="Git & install" desc="Optionally initialize a git repo and install dependencies automatically." />
            </div>

            <Callout type="info">
              After all prompts, the CLI writes files, installs dependencies, and prints a summary. The whole process takes under a minute.
            </Callout>

            <H3>Next steps</H3>
            <P>Navigate into your project and start the dev server:</P>
            <CodeBlock code={`cd your-project-name\nnpm run dev`} lang="bash" />

            <P>Open <InlineCode>http://localhost:5000/api/health</InlineCode>:</P>
            <CodeBlock lang="json" code={`{
  "status": "OK",
  "timestamp": "2026-06-16T00:00:00.000Z",
  "uptime": 1.24
}`} />

            <H4>First-time setup with Prisma or Drizzle</H4>
            <CodeBlock lang="bash" code={`# Generate the client / migration files
npm run db:generate

# Run the migration against your database
npm run db:migrate`} />

            <Callout type="warn" title="Generate before starting">
              If you picked Prisma or Drizzle and try to start the server before generating, it will crash immediately — the client code does not exist yet.
            </Callout>
          </section>

          <Divider />

          {/* What you get */}
          <section id="what-you-get">
            <H2 id="what-you-get">What you get</H2>
            <P>Every generated project ships with this baseline, regardless of your choices:</P>

            <div className="space-y-2.5 mb-6">
              <FeatureCard icon={<IconCheck size={14} />} name="HTTP server" desc="Configured with CORS, JSON body parsing, and a global error handler. Pick Express, Fastify, or Hono." />
              <FeatureCard icon={<IconCheck size={14} />} name="/api/health endpoint" desc="Returns status, timestamp, and uptime. Ready for Docker health checks and load balancers." />
              <FeatureCard icon={<IconCheck size={14} />} name="src/config/index.ts" desc="Reads .env via dotenv and exports a typed config object. No scattered process.env calls." />
              <FeatureCard icon={<IconCheck size={14} />} name="src/utils/logger.ts" desc="Lightweight .info()/.warn()/.error() logger. Swap it for Winston or Pino when you are ready." />
              <FeatureCard icon={<IconCheck size={14} />} name=".env + .env.example" desc="All required keys pre-filled with safe placeholders. Example has values stripped — safe to commit." />
              <FeatureCard icon={<IconCheck size={14} />} name="npm scripts" desc="dev, build, and start wired to the correct commands for your language and framework." />
            </div>

            <P>
              On top of this, you get whatever you asked for — database layer, auth middleware, Zod validators, Docker config, Swagger UI, and more. Each is covered in the sections below.
            </P>
          </section>

          <Divider />

          {/* Frameworks */}
          <section id="frameworks">
            <H2 id="frameworks">Frameworks</H2>
            <P>Pick one framework at scaffold time. All three produce the same folder structure — only the wiring in <InlineCode>src/app.ts</InlineCode> differs.</P>

            <Table
              heads={["Framework", "Version", "Wiring"]}
              rows={[
                ["Express", "^4.19", "cors + express.json() + 4-arg error handler"],
                ["Fastify", "^4.28", "@fastify/cors + setErrorHandler()"],
                ["Hono",    "^4.4",  "hono/cors + @hono/node-server adapter"],
              ]}
            />

            <P>The server entry point follows the same pattern for all three:</P>
            <CodeBlock lang="typescript" code={`// src/server.ts
import app from "./app";
import { connectDatabase } from "./database";
import { config } from "./config";
import { logger } from "./utils/logger";

async function main() {
  await connectDatabase();
  app.listen(config.port, () => {
    logger.info(\`Server running on port \${config.port}\`);
  });
}

main().catch((err) => {
  logger.error("Failed to start:", err);
  process.exit(1);
});`} />

            <Callout type="info">
              The database connection is awaited before the server starts. This prevents the app from accepting requests before it can query anything.
            </Callout>

            <H3>Which framework should I pick?</H3>
            <P>
              <strong className="text-zinc-200">Express</strong> if you want the largest ecosystem and most community support. <strong className="text-zinc-200">Fastify</strong> if you care about raw performance and plugin architecture. <strong className="text-zinc-200">Hono</strong> if you want something modern, lightweight, and portable to edge runtimes later.
            </P>
          </section>

          <Divider />

          {/* Databases */}
          <section id="databases">
            <H2 id="databases">Databases & ORMs</H2>
            <P>The database layer lives in <InlineCode>src/database/</InlineCode>. Every option exports a <InlineCode>connectDatabase()</InlineCode> function and a client you import in your services.</P>

            <H3>Prisma</H3>
            <P>The most batteries-included option. Generates <InlineCode>prisma/schema.prisma</InlineCode> with a starter <InlineCode>User</InlineCode> model and a singleton PrismaClient. Supports <strong className="text-zinc-200">PostgreSQL, MySQL, SQLite</strong>.</P>
            <CodeBlock lang="typescript" code={`// src/database/index.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function connectDatabase() {
  await prisma.$connect();
}`} />

            <H3>Drizzle</H3>
            <P>TypeScript-first ORM with a SQL-like query builder. Generates <InlineCode>drizzle.config.ts</InlineCode>, a schema file with a <InlineCode>users</InlineCode> table, and the right driver connection. Supports <strong className="text-zinc-200">PostgreSQL, MySQL, SQLite</strong>.</P>
            <CodeBlock lang="typescript" code={`// src/database/schema.ts (PostgreSQL example)
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id:        serial("id").primaryKey(),
  email:     text("email").notNull().unique(),
  password:  text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});`} />

            <H3>Mongoose</H3>
            <P>The classic MongoDB ODM. Works with <strong className="text-zinc-200">MongoDB</strong> only.</P>
            <CodeBlock lang="typescript" code={`// src/database/index.ts
import mongoose from "mongoose";
import { config } from "../config";

export async function connectDatabase() {
  await mongoose.connect(config.mongodbUri);
}`} />

            <H3>Native driver</H3>
            <P>Raw driver code — <InlineCode>pg.Pool</InlineCode> for PostgreSQL, <InlineCode>mysql2</InlineCode> for MySQL, <InlineCode>better-sqlite3</InlineCode> for SQLite, or the native MongoDB driver. Pick this to write raw SQL.</P>

            <Callout type="warn" title="Run db:generate first">
              With Prisma or Drizzle, always run <InlineCode>npm run db:generate</InlineCode> before starting the server. The generated client does not exist until you run this.
            </Callout>
          </section>

          <Divider />

          {/* Auth */}
          <section id="auth">
            <H2 id="auth">Authentication</H2>
            <P>Auth is optional. Skip it for internal services or public APIs with no user accounts. Choose between two strategies:</P>

            <H3>JWT <Badge variant="accent">recommended</Badge></H3>
            <P>Scaffolds auth routes at <InlineCode>/api/auth</InlineCode> with a controller and protect middleware:</P>
            <div className="space-y-2 mb-4">
              <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-3.5 text-[13px]">
                <InlineCode>auth.controller.ts</InlineCode>
                <p className="text-zinc-500 mt-1.5 leading-relaxed">
                  <InlineCode>POST /api/auth/register</InlineCode> — hashes password with bcryptjs, returns a JWT.<br />
                  <InlineCode>POST /api/auth/login</InlineCode> — verifies credentials, returns a signed JWT.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-3.5 text-[13px]">
                <InlineCode>auth.middleware.ts</InlineCode>
                <p className="text-zinc-500 mt-1.5 leading-relaxed">
                  Exports <InlineCode>protect</InlineCode> middleware. Reads <InlineCode>Authorization: Bearer &lt;token&gt;</InlineCode>, verifies with jsonwebtoken, attaches decoded payload to <InlineCode>req.user</InlineCode>. Returns 401 on failure.
                </p>
              </div>
            </div>
            <CodeBlock lang="typescript" code={`router.get("/me", protect, async (req, res) => {
  const user = await userService.findById(req.user.id);
  res.json({ user });
});`} />
            <Callout type="warn" title="Set JWT_SECRET before deploying">
              The generated <InlineCode>.env</InlineCode> has a placeholder. Replace it with <InlineCode>openssl rand -base64 32</InlineCode>. Never commit the real secret.
            </Callout>

            <H3>Better Auth</H3>
            <P>
              Scaffolds config in <InlineCode>src/config/auth.ts</InlineCode> and mounts at <InlineCode>/api/auth/*</InlineCode>. Handles sessions, OAuth, email/password, email verification, and more. See{" "}
              <a href="https://better-auth.com" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2 hover:text-zinc-100">Better Auth docs</a>.
            </P>
          </section>

          <Divider />

          {/* Validation */}
          <section id="validation">
            <H2 id="validation">Validation</H2>
            <P>Selecting Zod generates a <InlineCode>src/app/validators/</InlineCode> directory. Define schemas, call <InlineCode>safeParse()</InlineCode> in your controller, bail early on failure.</P>
            <CodeBlock lang="typescript" code={`// src/app/validators/auth.validator.ts
import { z } from "zod";

export const registerSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8, "At least 8 characters"),
  name:     z.string().min(1).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;`} />
            <CodeBlock lang="typescript" code={`export const register = async (req, res, next) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      fields: result.error.flatten().fieldErrors,
    });
  }

  const { email, password } = result.data;
  // result.data is fully typed
};`} />
            <Callout type="tip">
              Use <InlineCode>safeParse</InlineCode> instead of <InlineCode>parse</InlineCode> in request handlers. It never throws — it returns a result object you can inspect, keeping error handling explicit and predictable.
            </Callout>
          </section>

          <Divider />

          {/* API Type */}
          <section id="api-type">
            <H2 id="api-type">API Type</H2>
            <P>The CLI asks which API layer you want. This determines how routes and controllers are structured.</P>
            <Table
              heads={["Type", "Status", "Description"]}
              rows={[
                ["REST", "Ready", "Traditional endpoints with controllers, services, and routes"],
                ["GraphQL", "In development", "Apollo Server integration with schema-first approach"],
                ["tRPC", "In development", "End-to-end type-safe API with tRPC server adapter"],
              ]}
            />
            <P>
              <strong className="text-zinc-200">REST</strong> is fully scaffolded with the complete controller/service/route pipeline. GraphQL and tRPC are in active development — selecting them currently generates the REST structure as a starting point.
            </P>
            <Callout type="info">
              Regardless of API type, <InlineCode>/api/health</InlineCode>, database connection, error handling, and tooling are always generated the same way.
            </Callout>
          </section>

          <Divider />

          {/* Tooling */}
          <section id="tooling">
            <H2 id="tooling">Tooling</H2>
            <P>Tooling options are independent of each other and of the core project. Pick whatever fits your workflow.</P>

            <H3>Docker</H3>
            <P>Multi-stage <InlineCode>Dockerfile</InlineCode> and <InlineCode>.dockerignore</InlineCode>. Builder stage compiles TypeScript; runner stage copies only compiled output and production dependencies.</P>
            <CodeBlock lang="dockerfile" code={`FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 5000
CMD ["node", "dist/server.js"]`} />

            <H3>Swagger / OpenAPI</H3>
            <P>Generates <InlineCode>src/config/swagger.ts</InlineCode> with a starter OpenAPI 3.0 document and mounts Swagger UI at <InlineCode>/api-docs</InlineCode>. Currently <strong className="text-zinc-200">Express only</strong>.</P>

            <H3>ESLint</H3>
            <P>Generates <InlineCode>eslint.config.js</InlineCode> using the flat config format. TypeScript projects get <InlineCode>typescript-eslint</InlineCode> with strict rules. Run with <InlineCode>npm run lint</InlineCode>.</P>

            <H3>Prettier</H3>
            <P>Generates <InlineCode>.prettierrc</InlineCode> pre-configured with single quotes, semicolons, 100 print width, and trailing commas.</P>

            <H3>Husky + lint-staged</H3>
            <P>Git pre-commit hook that runs ESLint and Prettier against staged files. Ensures no unformatted or rule-violating code enters your history.</P>
          </section>

          <Divider />

          {/* Scripts */}
          <section id="scripts">
            <H2 id="scripts">Scripts</H2>
            <P>The generated project's <InlineCode>package.json</InlineCode> includes these scripts, some conditional based on your selections.</P>
            <Table
              heads={["Script", "What it runs", "When present"]}
              rows={[
                ["npm run dev",         "tsx watch src/server.ts (TS) / nodemon src/server.js (JS)", "Always"],
                ["npm run build",       "tsc — compiles TypeScript to dist/", "TypeScript only"],
                ["npm start",           "node dist/server.js (TS) / node src/server.js (JS)", "Always"],
                ["npm run db:generate", "prisma generate / drizzle-kit generate", "Prisma or Drizzle"],
                ["npm run db:migrate",  "prisma migrate dev / drizzle-kit migrate", "Prisma or Drizzle"],
                ["npm run lint",        "eslint src/", "ESLint selected"],
                ["npm run format",      "prettier --write src/", "Prettier selected"],
              ]}
            />
          </section>

          <Divider />

          {/* Structure */}
          <section id="structure">
            <H2 id="structure">Project Structure</H2>
            <P>The generated project always uses this structure. Optional directories only appear when the corresponding feature is selected.</P>

            <CodeBlock lang="text" code={`your-project/
├── prisma/
│   └── schema.prisma          # Prisma schema + User model  [Prisma only]
├── src/
│   ├── app/
│   │   ├── controllers/       # Validate input, call a service, return response
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts   # protect()  [JWT only]
│   │   │   └── error.middleware.ts  # Catches errors, returns consistent JSON
│   │   ├── models/            # Mongoose schemas  [Mongoose only]
│   │   ├── routes/            # Wire controllers to paths
│   │   ├── services/          # Business logic — all DB calls live here
│   │   └── validators/        # Zod schemas  [Zod only]
│   ├── config/
│   │   ├── index.ts           # Reads .env, exports typed config
│   │   ├── auth.ts            # Better Auth config  [Better Auth only]
│   │   └── swagger.ts         # OpenAPI 3.0 document  [Swagger only]
│   ├── database/
│   │   ├── index.ts           # connectDatabase() + client export
│   │   └── schema.ts          # Drizzle table definitions  [Drizzle only]
│   ├── utils/
│   │   └── logger.ts          # logger.info() / .warn() / .error()
│   ├── app.ts                 # Framework instance, middleware, route registration
│   └── server.ts              # Awaits DB, starts listener
├── .env                       # Secrets — never commit
├── .env.example               # Same keys, no values — safe to commit
├── drizzle.config.ts          # Drizzle config  [Drizzle only]
├── Dockerfile                 # Multi-stage build  [Docker only]
├── .dockerignore              # [Docker only]
├── eslint.config.js           # Flat config  [ESLint only]
├── .prettierrc                # [Prettier only]
├── .lintstagedrc              # [Husky only]
├── tsconfig.json              # [TypeScript only]
└── package.json`} />

            <H3>Layered architecture</H3>
            <P>The structure enforces a consistent data flow: <InlineCode>route</InlineCode> → <InlineCode>middleware</InlineCode> → <InlineCode>controller</InlineCode> → <InlineCode>service</InlineCode> → <InlineCode>database</InlineCode>. Each layer has one job.</P>
            <div className="mt-3 mb-6 space-y-1.5">
              <Layer name="routes/" desc="Map HTTP paths to controller functions. No logic here." />
              <Layer name="controllers/" desc="Validate the request (Zod), call a service, return the response." />
              <Layer name="services/" desc="Own all business logic and database calls. Testable in isolation." />
              <Layer name="database/" desc="Export the client and connection function. Services import from here." />
              <Layer name="config/" desc="One place for all environment config. Every file imports from here." />
            </div>

            {/* Footer */}
            <div className="mt-14 pt-6 border-t border-zinc-800/40 flex items-center justify-between">
              <p className="text-[11px] text-zinc-700 font-mono">MIT License</p>
              <Link href="/" className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors font-mono">
                <IconArrowLeft size={12} />Back to home
              </Link>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
