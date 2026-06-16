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
} from "@tabler/icons-react";

/* ─── Nav ─────────────────────────────────────────────────────────────────── */
const NAV = [
  {
    group: "Overview",
    items: [
      { id: "what-is-it",   label: "What is it?",         icon: <IconSparkles size={14} /> },
      { id: "how-it-works", label: "How it works",        icon: <IconBolt size={14} /> },
      { id: "what-you-get", label: "What you get",        icon: <IconBook size={14} /> },
    ],
  },
  {
    group: "Guide",
    items: [
      { id: "quickstart",   label: "Quick Start",         icon: <IconTerminal2 size={14} /> },
      { id: "frameworks",   label: "Frameworks",          icon: <IconApi size={14} /> },
      { id: "databases",    label: "Databases & ORMs",    icon: <IconDatabase size={14} /> },
      { id: "auth",         label: "Authentication",      icon: <IconShield size={14} /> },
      { id: "validation",   label: "Validation",          icon: <IconCheck size={14} /> },
      { id: "api-type",     label: "API Type",            icon: <IconCode size={14} /> },
      { id: "tooling",      label: "Tooling",             icon: <IconSettings size={14} /> },
    ],
  },
  {
    group: "Reference",
    items: [
      { id: "scripts",      label: "Scripts",             icon: <IconPackage size={14} /> },
      { id: "structure",    label: "Project Structure",   icon: <IconFolderOpen size={14} /> },
    ],
  },
];

const ALL_IDS = NAV.flatMap((g) => g.items.map((i) => i.id));

/* ─── Primitives ──────────────────────────────────────────────────────────── */
function Code({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900 my-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-zinc-800">
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">{lang}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors">
          {copied
            ? <><IconCheck size={11} className="text-green-500" /><span className="text-green-500">Copied</span></>
            : <><IconCopy size={11} />Copy</>}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] font-mono text-zinc-300 leading-[1.7]"><code>{code}</code></pre>
    </div>
  );
}

function IC({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-[12.5px] text-zinc-300 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/50">{children}</code>;
}

function Callout({ type = "info", title, children }: { type?: "info" | "warn" | "tip"; title?: string; children: React.ReactNode }) {
  const s = {
    info: { wrap: "border-zinc-700 bg-zinc-900/60",    icon: <IconInfoCircle size={14} className="text-zinc-500 shrink-0 mt-0.5" />,       text: "text-zinc-400" },
    warn: { wrap: "border-yellow-800/50 bg-yellow-950/20", icon: <IconAlertTriangle size={14} className="text-yellow-500 shrink-0 mt-0.5" />, text: "text-yellow-200/80" },
    tip:  { wrap: "border-sky-800/40 bg-sky-950/20",   icon: <IconBolt size={14} className="text-sky-400 shrink-0 mt-0.5" />,               text: "text-sky-200/80" },
  }[type];
  return (
    <div className={`my-4 flex gap-3 p-3.5 rounded-md border ${s.wrap}`}>
      <div className="mt-0.5">{s.icon}</div>
      <div className={`text-[13px] leading-relaxed ${s.text}`}>
        {title && <span className="font-semibold text-zinc-200 block mb-0.5">{title}</span>}
        {children}
      </div>
    </div>
  );
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-[17px] font-semibold text-zinc-100 mt-12 mb-3 scroll-mt-20 flex items-center gap-2 group">
      <span className="w-1 h-4 rounded-full bg-zinc-700 shrink-0" />
      {children}
      <a href={`#${id}`} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity text-sm ml-1">#</a>
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[14px] font-semibold text-zinc-300 mt-6 mb-2">{children}</h3>;
}

function Divider() {
  return <div className="border-t border-zinc-800/60 my-10" />;
}

function Table({ heads, rows }: { heads: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-zinc-800 my-4">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/40">
            {heads.map((h) => <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-800/40 last:border-0 hover:bg-zinc-800/10 transition-colors">
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

function Badge({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border ${accent ? "bg-sky-950/50 text-sky-400 border-sky-800/50" : "bg-zinc-800/60 text-zinc-400 border-zinc-700"}`}>
      {children}
    </span>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function DocsPage() {
  const [active, setActive] = useState("what-is-it");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    ALL_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { rootMargin: "-15% 0px -75% 0px" }
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
    <aside className="flex flex-col w-48 shrink-0">
      {NAV.map((group) => (
        <div key={group.group} className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-1.5 px-2">{group.group}</p>
          <div className="flex flex-col gap-0.5">
            {group.items.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded text-[12.5px] text-left w-full transition-all ${
                  active === id
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                    : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                }`}
              >
                <span className={active === id ? "text-sky-400" : "text-zinc-700"}>{icon}</span>
                {label}
                {active === id && <IconChevronRight size={10} className="ml-auto text-zinc-500" />}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="pt-4 border-t border-zinc-800 flex flex-col gap-0.5 mt-2">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-1.5 rounded text-[12.5px] text-zinc-500 hover:text-zinc-300 transition-colors">
          <IconBrandGithub size={13} />GitHub
        </a>
        <a href="https://npmjs.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-1.5 rounded text-[12.5px] text-zinc-500 hover:text-zinc-300 transition-colors">
          <IconBrandNpm size={13} />npm
        </a>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-12">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(!open)} className="lg:hidden text-zinc-500 hover:text-zinc-300">
              {open ? <IconX size={17} /> : <IconMenu2 size={17} />}
            </button>
            <Link href="/" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-sm">
              <IconArrowLeft size={13} />
              <span className="font-mono hidden sm:inline">create-tcx-backend</span>
            </Link>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge>v1.0.0</Badge>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"><IconBrandGithub size={15} /></a>
            <a href="https://npmjs.com" target="_blank" rel="noopener noreferrer" className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"><IconBrandNpm size={15} /></a>
          </div>
        </div>
      </header>

      {open && <div className="fixed inset-0 z-30 bg-black/70 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="max-w-5xl mx-auto flex px-6 py-8 gap-10">
        <div className="hidden lg:block sticky top-20 self-start h-fit"><Sidebar /></div>
        <div className={`fixed top-12 left-0 bottom-0 z-30 w-56 bg-[#0d0d0d] border-r border-zinc-800 p-5 overflow-y-auto transition-transform duration-200 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <Sidebar />
        </div>

        <main className="flex-1 min-w-0 max-w-2xl">

          {/* Page header */}
          <div className="mb-8 pb-6 border-b border-zinc-800/50">
            <div className="flex items-center gap-2 mb-3">
              <Badge accent>docs</Badge>
              <Badge>v1.0.0</Badge>
              <Badge>Node.js ≥22</Badge>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 mb-2">create-tcx-backend</h1>
            <p className="text-zinc-500 text-sm">Scaffold production-ready Node.js backends with a single command.</p>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              SECTION: CLI OVERVIEW (inline in What is it?)
          ════════════════════════════════════════════════════════════ */}
          <section id="what-is-it">
            <H2 id="what-is-it">What is it?</H2>

            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-4">
              <IC>create-tcx-backend</IC> is an interactive CLI scaffolder for Node.js backends. Run <IC>npx create-tcx-backend</IC>, answer a few questions about your stack, and get a complete, working backend project tailored to those choices — no manual setup required.
            </p>

            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-4">
              Think of it like a backend-focused <IC>create-react-app</IC>. One command, then you have a project that compiles, connects to a database, handles errors, and serves health checks — before you write any of your own code.
            </p>

            <Code code="npx create-tcx-backend" lang="bash" />

            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-4">
              The CLI does not require a global install. <IC>npx</IC> downloads and runs the latest version on each invocation. Everything stays clean.
            </p>

            <H3>Why it exists</H3>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed">
              Every Node.js project starts with the same 30 minutes of busywork: install the framework, add CORS, wire up dotenv, write a logger, connect the database, set up error handling, create the folder structure. That time adds up across projects and it is the same work every time. <IC>create-tcx-backend</IC> does it for you so you can start building right away.
            </p>

            <Callout type="tip" title="Requirements">
              Node.js <strong>≥ 22.0.0</strong>. Run <IC>node --version</IC> to check. Use <a href="https://github.com/nvm-sh/nvm" className="underline underline-offset-2">nvm</a> to switch versions if needed.
            </Callout>
          </section>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════
              SECTION: HOW IT WORKS
          ════════════════════════════════════════════════════════════ */}
          <section id="how-it-works">
            <H2 id="how-it-works">How it works</H2>

            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-4">
              The CLI uses a <strong className="text-zinc-300">plugin pipeline</strong>. Each option you pick (framework, database, ORM, auth, validation, tooling) registers one or more plugins. When you confirm your choices, the pipeline runs in two phases:
            </p>

            <div className="space-y-2 mb-4">
              <div className="p-3 rounded-md border border-zinc-800 bg-zinc-900/20 text-[13px]">
                <span className="font-mono text-zinc-300">1. Dependency injection</span>
                <p className="text-zinc-500 mt-1 leading-relaxed">Each plugin adds its dependencies to <IC>package.json</IC> — no orphan packages, no conflicts.</p>
              </div>
              <div className="p-3 rounded-md border border-zinc-800 bg-zinc-900/20 text-[13px]">
                <span className="font-mono text-zinc-300">2. File generation</span>
                <p className="text-zinc-500 mt-1 leading-relaxed">Each plugin writes its files into an in-memory context. When all plugins have run, the engine writes everything to disk, installs dependencies, and optionally initializes git.</p>
              </div>
            </div>

            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-4">
              Plugins are composable and independent. The Express generator and the Prisma generator and the JWT generator all run separately and produce files that fit together. You are not pulling from a monolithic template.
            </p>

            <H3>The prompt flow</H3>
            <div className="my-4 space-y-0">
              {[
                { q: "Project name", a: "Becomes the folder name and the package.json name field. Use \".\" to scaffold in the current directory." },
                { q: "Package manager", a: "npm, pnpm, yarn, or bun. Used for dependency installation and script execution." },
                { q: "Framework", a: "Express, Fastify, or Hono. Picks the HTTP layer — the rest of the structure stays the same." },
                { q: "Language", a: "TypeScript (tsconfig, types) or JavaScript (simpler setup, nodemon for watch mode)." },
                { q: "Module system", a: "ES Modules (import/export) or CommonJS (require/module.exports). TypeScript projects default to ESM." },
                { q: "Database", a: "PostgreSQL, MySQL, SQLite, MongoDB, or None. Determines which drivers are installed." },
                { q: "ORM", a: "Prisma, Drizzle, Mongoose, or raw driver. Options are filtered based on your database choice." },
                { q: "Auth", a: "JWT (bcryptjs + jsonwebtoken), Better Auth, or None." },
                { q: "Validation", a: "Zod or None." },
                { q: "API type", a: "REST (ready), GraphQL (Apollo — scaffolding in development), tRPC (scaffolding in development)." },
                { q: "Tooling (multi)", a: "Docker, Swagger, ESLint, Prettier, Husky. Any combination, all independent." },
                { q: "Git & install", a: "Optionally initialize a git repo and install dependencies automatically." },
              ].map(({ q, a }, i) => (
                <div key={q} className="flex gap-4 py-3 border-b border-zinc-800/40 last:border-0">
                  <span className="text-[11px] font-mono text-zinc-600 mt-0.5 shrink-0 w-5 text-right">{i + 1}</span>
                  <div>
                    <p className="text-[13px] font-medium text-zinc-300 mb-0.5">{q}</p>
                    <p className="text-[12.5px] text-zinc-500 leading-relaxed">{a}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[13.5px] text-zinc-400 leading-relaxed mt-4">
              After the prompts, the CLI writes all files, installs dependencies, and prints a summary. The whole process takes under a minute.
            </p>

            <Callout type="info">
              The CLI currently supports <strong className="text-zinc-300">interactive mode only</strong>. There are no <IC>--yes</IC> or <IC>--template</IC> flags yet — all choices go through the prompt system.
            </Callout>
          </section>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════
              SECTION: WHAT YOU GET
          ════════════════════════════════════════════════════════════ */}
          <section id="what-you-get">
            <H2 id="what-you-get">What you get</H2>

            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-4">
              Every generated project — regardless of which options you chose — ships with this baseline. These are the files you always get, no matter what.
            </p>

            <div className="space-y-3 mb-6">
              {[
                {
                  name: "HTTP server",
                  desc: "Fully configured with CORS, JSON body parsing, and a global error handler. Pick Express, Fastify, or Hono — all three produce the same structure.",
                },
                {
                  name: "/api/health endpoint",
                  desc: "Returns status, timestamp, and uptime. Use it as a readiness check in Docker or a load balancer.",
                },
                {
                  name: "src/config/index.ts",
                  desc: "Reads environment variables from .env via dotenv and exports a typed config object. Every other file imports from here — no scattered process.env calls.",
                },
                {
                  name: "src/utils/logger.ts",
                  desc: "Lightweight logger with .info(), .warn(), .error(). No heavy dependencies — swap it for Winston or Pino later.",
                },
                {
                  name: ".env + .env.example",
                  desc: "All required keys pre-filled with safe placeholders. The .env.example has the same keys with values stripped — safe to commit.",
                },
                {
                  name: "npm scripts",
                  desc: "dev, build, and start scripts wired to the correct commands for your language and framework.",
                },
              ].map(({ name, desc }) => (
                <div key={name} className="flex gap-3 p-3 rounded-md border border-zinc-800/60 bg-zinc-900/20">
                  <IconCheck size={14} className="text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium text-zinc-300">{name}</p>
                    <p className="text-[12.5px] text-zinc-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[13.5px] text-zinc-400 leading-relaxed">
              On top of this baseline, you get whatever you asked for — database layer, auth middleware, Zod validators, Docker config, Swagger UI, and so on. Each is covered in the sections below.
            </p>
          </section>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════
              SECTION: QUICK START
          ════════════════════════════════════════════════════════════ */}
          <section id="quickstart">
            <H2 id="quickstart">Quick Start</H2>

            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-3">
              Run the scaffolder:
            </p>
            <Code code="npx create-tcx-backend" lang="bash" />

            <H3>After the prompts finish</H3>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-3">
              The CLI installs dependencies automatically. Once done:
            </p>
            <Code code={`cd your-project-name\nnpm run dev`} lang="bash" />

            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-3">
              Open <IC>http://localhost:5000/api/health</IC>. You should see:
            </p>
            <Code lang="json" code={`{
  "status": "OK",
  "timestamp": "2026-06-16T00:00:00.000Z",
  "uptime": 1.24
}`} />

            <p className="text-[13.5px] text-zinc-400 leading-relaxed">
              The server is running. Now edit <IC>.env</IC> with your real database credentials, run your first migration if applicable, and start building.
            </p>

            <H3>First-time setup with Prisma or Drizzle</H3>
            <Code lang="bash" code={`# Generate the client / migration files
npm run db:generate

# Run the migration against your database
npm run db:migrate`} />

            <Callout type="warn" title="Generate before starting">
              If you picked Prisma or Drizzle and try to run the server before generating, it will crash immediately — the client code does not exist yet.
            </Callout>

            <H3>Scaffold in the current directory</H3>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed">
              Enter <IC>.</IC> as the project name to scaffold directly into the current directory. The CLI warns if the directory is non-empty.
            </p>
          </section>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════
              SECTION: FRAMEWORKS
          ════════════════════════════════════════════════════════════ */}
          <section id="frameworks">
            <H2 id="frameworks">Frameworks</H2>

            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-4">
              Pick one framework at scaffold time. All three produce the same folder structure — only the framework-specific wiring inside <IC>src/app.ts</IC> differs.
            </p>

            <Table
              heads={["Framework", "Version", "Wiring"]}
              rows={[
                ["Express", "^4.19", "cors + express.json() + 4-arg error handler"],
                ["Fastify", "^4.28", "@fastify/cors + setErrorHandler()"],
                ["Hono",    "^4.4",  "hono/cors + @hono/node-server adapter"],
              ]}
            />

            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-3">
              The server entry point always follows the same pattern — connect the database, then start listening:
            </p>
            <Code lang="typescript" code={`// src/server.ts
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
              The database connection is awaited before the server starts. This prevents the app from accepting requests before it can actually query anything.
            </Callout>

            <H3>Which framework should I pick?</H3>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed">
              <strong className="text-zinc-300">Express</strong> if you want the largest ecosystem and the most community support. <strong className="text-zinc-300">Fastify</strong> if you care about raw performance and like its plugin architecture. <strong className="text-zinc-300">Hono</strong> if you want something modern, lightweight, and portable to edge runtimes later. All three are excellent for REST APIs.
            </p>
          </section>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════
              SECTION: DATABASES
          ════════════════════════════════════════════════════════════ */}
          <section id="databases">
            <H2 id="databases">Databases & ORMs</H2>

            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-4">
              The database layer lives in <IC>src/database/</IC>. Every option exports a <IC>connectDatabase()</IC> function that <IC>src/server.ts</IC> awaits on startup, plus a client or instance you import in your services.
            </p>

            <H3>Prisma</H3>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-3">
              The most batteries-included option. Generates <IC>prisma/schema.prisma</IC> with a starter <IC>User</IC> model and a singleton PrismaClient in <IC>src/database/index.ts</IC>. Supports <strong className="text-zinc-300">PostgreSQL, MySQL, SQLite</strong>.
            </p>
            <Code lang="typescript" code={`// src/database/index.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function connectDatabase() {
  await prisma.$connect();
}

// In any service file:
// import { prisma } from "../database";
// const user = await prisma.user.findUnique({ where: { id } });`} />

            <H3>Drizzle</H3>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-3">
              A TypeScript-first ORM with a SQL-like query builder. Generates <IC>drizzle.config.ts</IC>, a <IC>src/database/schema.ts</IC> with a <IC>users</IC> table, and a connection using the right driver. Supports <strong className="text-zinc-300">PostgreSQL, MySQL, SQLite</strong>.
            </p>
            <Code lang="typescript" code={`// src/database/schema.ts (PostgreSQL example)
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id:        serial("id").primaryKey(),
  email:     text("email").notNull().unique(),
  password:  text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});`} />

            <H3>Mongoose</H3>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-3">
              The classic MongoDB ODM. Generates <IC>connectDatabase()</IC> that calls <IC>mongoose.connect()</IC> using the <IC>MONGODB_URI</IC> from your <IC>.env</IC>. Only works with <strong className="text-zinc-300">MongoDB</strong>.
            </p>
            <Code lang="typescript" code={`// src/database/index.ts
import mongoose from "mongoose";
import { config } from "../config";

export async function connectDatabase() {
  await mongoose.connect(config.mongodbUri);
}`} />

            <H3>No ORM</H3>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed">
              Generates raw driver connection code — <IC>pg.Pool</IC> for PostgreSQL, <IC>mysql2</IC> for MySQL, <IC>better-sqlite3</IC> for SQLite, or the native MongoDB driver. Pick this when you want to write raw SQL or manage your own query layer.
            </p>

            <Callout type="warn" title="Run db:generate first">
              With Prisma or Drizzle, always run <IC>npm run db:generate</IC> before starting the server. The client code is generated — it does not exist until you run this.
            </Callout>
          </section>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════
              SECTION: AUTH
          ════════════════════════════════════════════════════════════ */}
          <section id="auth">
            <H2 id="auth">Authentication</H2>

            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-4">
              Auth is optional. Skip it for internal services, public APIs with no user accounts, or if you handle auth at a different layer. If you do want it, you get one of two strategies:
            </p>

            <H3>JWT <Badge accent>recommended</Badge></H3>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-3">
              Scaffolds two files and registers auth routes at <IC>/api/auth</IC>:
            </p>
            <div className="space-y-2 mb-4">
              <div className="p-3 rounded-md border border-zinc-800 bg-zinc-900/20 text-[13px]">
                <IC>auth.controller.ts</IC>
                <p className="text-zinc-500 mt-1.5 leading-relaxed">
                  <IC>POST /api/auth/register</IC> — hashes password with <IC>bcryptjs</IC>, saves the user, returns a JWT.<br />
                  <IC>POST /api/auth/login</IC> — verifies credentials, returns a signed JWT.
                </p>
              </div>
              <div className="p-3 rounded-md border border-zinc-800 bg-zinc-900/20 text-[13px]">
                <IC>auth.middleware.ts</IC>
                <p className="text-zinc-500 mt-1.5 leading-relaxed">
                  Exports a <IC>protect</IC> middleware. Reads <IC>Authorization: Bearer &lt;token&gt;</IC>, verifies with <IC>jsonwebtoken</IC>, attaches decoded payload to <IC>req.user</IC>. Returns <IC>401</IC> on missing or invalid token.
                </p>
              </div>
            </div>
            <Code lang="typescript" code={`// Protecting any route
import { protect } from "../middlewares/auth.middleware";

router.get("/me", protect, async (req, res) => {
  const user = await userService.findById(req.user.id);
  res.json({ user });
});`} />
            <Callout type="warn" title="Set JWT_SECRET before deploying">
              The generated <IC>.env</IC> has a placeholder value. Replace it with a long random string (<IC>openssl rand -base64 32</IC>). Never commit the real secret.
            </Callout>

            <H3>Better Auth</H3>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed">
              Scaffolds <IC>better-auth</IC> config in <IC>src/config/auth.ts</IC> and mounts the handler at <IC>/api/auth/*</IC>. Better Auth handles sessions, OAuth providers, email/password, email verification, and more out of the box. See the{" "}
              <a href="https://better-auth.com" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2">Better Auth docs</a>{" "}
              for provider configuration.
            </p>
          </section>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════
              SECTION: VALIDATION
          ════════════════════════════════════════════════════════════ */}
          <section id="validation">
            <H2 id="validation">Validation</H2>

            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-4">
              If you select Zod, the CLI generates a <IC>src/app/validators/</IC> directory with starter schemas. Define schemas in validator files, call <IC>safeParse()</IC> in your controller, and bail early if validation fails.
            </p>

            <Code lang="typescript" code={`// src/app/validators/auth.validator.ts
import { z } from "zod";

export const registerSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8, "At least 8 characters"),
  name:     z.string().min(1).optional(),
});

// Infer the TypeScript type directly from the schema
export type RegisterInput = z.infer<typeof registerSchema>;`} />

            <Code lang="typescript" code={`// src/app/controllers/auth.controller.ts
import { registerSchema } from "../validators/auth.validator";

export const register = async (req, res, next) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      fields: result.error.flatten().fieldErrors,
    });
  }

  // result.data is fully typed
  const { email, password } = result.data;
  // ...
};`} />

            <Callout type="tip">
              Use <IC>safeParse</IC> instead of <IC>parse</IC> in request handlers. It never throws — it returns a result object you can inspect, keeping error handling explicit and predictable.
            </Callout>
          </section>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════
              SECTION: API TYPE
          ════════════════════════════════════════════════════════════ */}
          <section id="api-type">
            <H2 id="api-type">API Type</H2>

            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-4">
              The CLI asks which API layer you want. This determines how your routes and controllers are structured.
            </p>

            <Table
              heads={["Type", "Status", "Description"]}
              rows={[
                ["REST", "Ready", "Traditional REST endpoints with controllers, services, and routes"],
                ["GraphQL", "In development", "Apollo Server integration with schema-first approach"],
                ["tRPC", "In development", "End-to-end type-safe API with tRPC server adapter"],
              ]}
            />

            <p className="text-[13.5px] text-zinc-400 leading-relaxed">
              <strong className="text-zinc-300">REST</strong> is fully scaffolded with controllers, services, routes, and middleware — the entire pipeline described in these docs. GraphQL and tRPC scaffolding is in active development. Selecting them currently generates the REST structure as a starting point.
            </p>

            <Callout type="info">
              Regardless of API type, the <IC>/api/health</IC> endpoint, database connection, error handling, and tooling are always generated the same way.
            </Callout>
          </section>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════
              SECTION: TOOLING
          ════════════════════════════════════════════════════════════ */}
          <section id="tooling">
            <H2 id="tooling">Tooling</H2>

            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-4">
              Tooling options are independent of each other and of the core project. Pick whichever ones match how you work.
            </p>

            <H3>Docker</H3>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-3">
              Generates a multi-stage <IC>Dockerfile</IC> and <IC>.dockerignore</IC>. The <IC>builder</IC> stage compiles TypeScript; the <IC>runner</IC> stage copies only compiled output and production dependencies.
            </p>
            <Code lang="dockerfile" code={`FROM node:22-alpine AS builder
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
            <p className="text-[13.5px] text-zinc-400 leading-relaxed">
              Generates <IC>src/config/swagger.ts</IC> with a starter OpenAPI 3.0 document and mounts Swagger UI at <IC>/api-docs</IC>. Currently <strong className="text-zinc-300">Express only</strong>. Open <IC>http://localhost:5000/api-docs</IC> to explore your API interactively.
            </p>

            <H3>ESLint</H3>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed">
              Generates <IC>eslint.config.js</IC> using the flat config format. TypeScript projects automatically get <IC>typescript-eslint</IC> with strict rules. Run with <IC>npm run lint</IC>.
            </p>

            <H3>Prettier</H3>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-3">
              Generates <IC>.prettierrc</IC> pre-configured with:
            </p>
            <Code lang="json" code={`{
  "singleQuote": true,
  "semi": true,
  "printWidth": 100,
  "trailingComma": "es5"
}`} />

            <H3>Husky + lint-staged</H3>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed">
              Adds a Git pre-commit hook via Husky and a <IC>.lintstagedrc</IC> that runs ESLint and Prettier against staged files before each commit. Ensures no unformatted or rule-violating code enters your history.
            </p>
          </section>

          <Divider />

          {/* ═══════════════════════════════════════════════════════════
              SECTION: SCRIPTS
          ════════════════════════════════════════════════════════════ */}
          <section id="scripts">
            <H2 id="scripts">Scripts</H2>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-4">
              Scripts in the generated project's <IC>package.json</IC>. Some are conditional based on your selections.
            </p>
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

          {/* ═══════════════════════════════════════════════════════════
              SECTION: STRUCTURE
          ════════════════════════════════════════════════════════════ */}
          <section id="structure">
            <H2 id="structure">Project Structure</H2>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-4">
              The generated project always uses this structure. Optional directories only appear if you selected the corresponding feature.
            </p>

            <Code lang="text" code={`your-project/
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

            <H3>The layered architecture</H3>
            <p className="text-[13.5px] text-zinc-400 leading-relaxed mb-3">
              The structure enforces a consistent data flow: <IC>route</IC> → <IC>middleware</IC> → <IC>controller</IC> → <IC>service</IC> → <IC>database</IC>. Each layer has one job.
            </p>
            <div className="space-y-2 mt-3">
              {[
                ["routes/", "Map HTTP paths to controller functions. No logic here."],
                ["controllers/", "Validate the request (Zod), call a service, return the response."],
                ["services/", "Own all business logic and database calls. Testable in isolation — no req/res objects."],
                ["database/", "Export the client and connection function. Services import from here."],
                ["config/", "One place for all environment config. Every other file imports from here."],
              ].map(([layer, desc]) => (
                <div key={layer as string} className="flex gap-3 text-[13px]">
                  <IC>{layer}</IC>
                  <span className="text-zinc-500 leading-relaxed">{desc}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-14 pt-6 border-t border-zinc-800/50 flex items-center justify-between">
              <p className="text-[11px] text-zinc-700 font-mono">MIT License</p>
              <Link href="/" className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors font-mono">
                <IconArrowLeft size={12} />back to home
              </Link>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
