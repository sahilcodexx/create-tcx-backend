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
} from "@tabler/icons-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

/* ─── Sidebar nav ─────────────────────────────────────────────────────────── */
const NAV_ITEMS: NavItem[] = [
  { id: "overview",   label: "Overview",          icon: <IconTerminal2 size={16} /> },
  { id: "quickstart", label: "Quick Start",        icon: <IconPackage size={16} /> },
  { id: "frameworks", label: "Frameworks",         icon: <IconApi size={16} /> },
  { id: "databases",  label: "Databases & ORMs",   icon: <IconDatabase size={16} /> },
  { id: "auth",       label: "Authentication",     icon: <IconShield size={16} /> },
  { id: "validation", label: "Validation",         icon: <IconCheck size={16} /> },
  { id: "tooling",    label: "Tooling",            icon: <IconSettings size={16} /> },
  { id: "scripts",    label: "Scripts",            icon: <IconTerminal2 size={16} /> },
  { id: "structure",  label: "Project Structure",  icon: <IconFolderOpen size={16} /> },
];

/* ─── Code block with copy ────────────────────────────────────────────────── */
function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-white/[0.08] bg-white/[0.03] my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
        <span className="text-xs font-mono text-zinc-500">{language}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          {copied ? (
            <>
              <IconCheck size={13} className="text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <IconCopy size={13} />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-zinc-300 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ─── Section heading ─────────────────────────────────────────────────────── */
function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-xl font-semibold text-white/90 mt-8 mb-3 scroll-mt-20 flex items-center gap-2 group"
    >
      {children}
      <a
        href={`#${id}`}
        className="text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity text-lg"
      >
        #
      </a>
    </h2>
  );
}

/* ─── Badge ───────────────────────────────────────────────────────────────── */
function Badge({ children, color = "zinc" }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    zinc:   "bg-zinc-800 text-zinc-300 border-zinc-700",
    green:  "bg-green-950 text-green-400 border-green-800",
    amber:  "bg-amber-950 text-amber-400 border-amber-800",
    blue:   "bg-blue-950 text-blue-400 border-blue-800",
    purple: "bg-purple-950 text-purple-400 border-purple-800",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${colors[color] ?? colors.zinc}`}>
      {children}
    </span>
  );
}

/* ─── Feature table row ───────────────────────────────────────────────────── */
function TableRow({ cells }: { cells: (string | React.ReactNode)[] }) {
  return (
    <tr className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
      {cells.map((cell, i) => (
        <td key={i} className={`px-4 py-3 text-sm ${i === 0 ? "font-mono text-amber-400 font-medium" : "text-zinc-400"}`}>
          {cell}
        </td>
      ))}
    </tr>
  );
}

/* ─── Main page ───────────────────────────────────────────────────────────── */
export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  /* Intersection observer to highlight active nav item */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-20% 0px -70% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  /* ── Sidebar ── */
  const Sidebar = () => (
    <aside className="flex flex-col gap-1 w-56 shrink-0">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3 px-3">
        Documentation
      </p>
      {NAV_ITEMS.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-left transition-all duration-150 w-full ${
            activeSection === id
              ? "bg-amber-600/15 text-amber-400 border border-amber-600/30"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent"
          }`}
        >
          <span className={activeSection === id ? "text-amber-400" : "text-zinc-600"}>
            {icon}
          </span>
          {label}
          {activeSection === id && (
            <IconChevronRight size={12} className="ml-auto text-amber-500" />
          )}
        </button>
      ))}

      <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col gap-2">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-all border border-transparent"
        >
          <IconBrandGithub size={16} /> GitHub
        </a>
        <a
          href="https://npmjs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-all border border-transparent"
        >
          <IconBrandNpm size={16} /> npm
        </a>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300">
      {/* ── Top nav bar ── */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-4">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {sidebarOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <IconArrowLeft size={16} />
              <span className="font-mono text-sm hidden sm:inline">create-tcx-backend</span>
            </Link>
          </div>

          <nav className="flex items-center gap-1">
            <span className="font-mono text-xs text-zinc-600 mr-2 hidden sm:inline">v1.0.0</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors rounded-md hover:bg-white/[0.04]"
            >
              <IconBrandGithub size={18} />
            </a>
            <a
              href="https://npmjs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors rounded-md hover:bg-white/[0.04]"
            >
              <IconBrandNpm size={18} />
            </a>
          </nav>
        </div>
      </header>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="max-w-6xl mx-auto flex px-6 py-6 gap-8">
        {/* ── Desktop sidebar ── */}
        <div className="hidden lg:block sticky top-24 self-start h-fit">
          <Sidebar />
        </div>

        {/* ── Mobile sidebar drawer ── */}
        <div
          className={`fixed top-14 left-0 bottom-0 z-30 w-64 bg-[#0d0d0d] border-r border-white/[0.06] p-6 transition-transform duration-300 lg:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>

        {/* ── Main content ── */}
        <main ref={contentRef} className="flex-1 min-w-0 max-w-3xl">

          {/* Page title */}
          <div className="mb-6 pb-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 mb-4">
              <Badge color="amber">docs</Badge>
              <Badge color="green">v1.0.0</Badge>
              <Badge>Node.js ≥22</Badge>
            </div>
            <h1 className="text-3xl font-bold text-white/95 mb-3 leading-tight">
              create-tcx-backend
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Scaffold production-ready Node.js backends with a single command.
              Pick your framework, database, auth strategy, and tooling — the
              CLI wires everything together.
            </p>
          </div>

          {/* ── Overview ── */}
          <section id="overview">
            <SectionHeading id="overview">
              <IconTerminal2 size={22} className="text-amber-500" />
              Overview
            </SectionHeading>
            <p className="text-zinc-400 leading-relaxed mb-4">
              <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">create-tcx-backend</code> is
              an interactive CLI that generates a fully configured, opinionated Node.js backend
              based on your choices. No templates to clone. No config files to copy-paste.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-6">
              Every project includes:
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "A working HTTP server with CORS and JSON parsing pre-configured",
                "A src/config/ module that loads environment variables via dotenv",
                "A src/utils/logger.ts utility with info, warn, and error methods",
                "A /api/health endpoint that returns uptime and server status",
                "A centralized error handler (Express middleware or framework-equivalent)",
                "A .env and .env.example with all required keys pre-filled",
                "A package.json with the correct scripts for your language and framework",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-zinc-400 text-sm">
                  <IconCheck size={15} className="text-green-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* ── Quick start ── */}
          <section id="quickstart">
            <SectionHeading id="quickstart">
              <IconPackage size={22} className="text-amber-500" />
              Quick Start
            </SectionHeading>
            <p className="text-zinc-400 leading-relaxed mb-2">
              Run the scaffolder with <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">npx</code>:
            </p>
            <CodeBlock code="npx create-tcx-backend" language="bash" />
            <p className="text-zinc-400 text-sm leading-relaxed mt-4">
              The interactive prompts will guide you through selecting your framework,
              language (TypeScript or JavaScript), database, ORM, authentication strategy,
              and optional tooling.
            </p>
            <div className="mt-6 p-4 rounded-lg border border-amber-600/20 bg-amber-600/5">
              <p className="text-sm text-amber-400/80">
                <span className="font-semibold text-amber-400">Requirements:</span>{" "}
                Node.js <code className="font-mono">≥ 22.0.0</code>
              </p>
            </div>
          </section>

          {/* ── Frameworks ── */}
          <section id="frameworks">
            <SectionHeading id="frameworks">
              <IconApi size={22} className="text-amber-500" />
              Frameworks
            </SectionHeading>
            <p className="text-zinc-400 leading-relaxed mb-6">
              All three frameworks generate a{" "}
              <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">src/app.ts</code>{" "}
              and a{" "}
              <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">src/server.ts</code>{" "}
              that calls <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">connectDatabase()</code>{" "}
              before starting the listener.
            </p>
            <div className="overflow-x-auto rounded-lg border border-white/[0.06] bg-white/[0.02]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Framework</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Version</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <TableRow cells={["Express", "^4.19", "Includes cors, express.json(), and a 4-argument error handler"]} />
                  <TableRow cells={["Fastify", "^4.28", "Uses @fastify/cors and setErrorHandler"]} />
                  <TableRow cells={["Hono", "^4.4", "Uses @hono/node-server adapter and hono/cors"]} />
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Databases ── */}
          <section id="databases">
            <SectionHeading id="databases">
              <IconDatabase size={22} className="text-amber-500" />
              Databases &amp; ORMs
            </SectionHeading>

            {/* Prisma */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white/80 mb-2 flex items-center gap-2">
                Prisma <Badge color="blue">ORM</Badge>
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                Generates a <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">prisma/schema.prisma</code> with
                a <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">User</code> model and a PrismaClient singleton
                in <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">src/database/index.ts</code>.
                Adds <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">db:generate</code> and{" "}
                <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">db:migrate</code> scripts.
              </p>
              <div className="flex gap-2">
                <Badge color="green">PostgreSQL</Badge>
                <Badge color="green">MySQL</Badge>
                <Badge color="green">SQLite</Badge>
              </div>
            </div>

            {/* Drizzle */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white/80 mb-2 flex items-center gap-2">
                Drizzle <Badge color="purple">ORM</Badge>
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                Generates a{" "}
                <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">drizzle.config.ts</code>,
                a schema file with a <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">users</code> table,
                and a connection setup using the appropriate driver (<code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">pg</code>,{" "}
                <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">mysql2</code>, or{" "}
                <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">better-sqlite3</code>).
              </p>
              <div className="flex gap-2">
                <Badge color="green">PostgreSQL</Badge>
                <Badge color="green">MySQL</Badge>
                <Badge color="green">SQLite</Badge>
              </div>
            </div>

            {/* Mongoose */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white/80 mb-2 flex items-center gap-2">
                Mongoose <Badge color="zinc">ODM</Badge>
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                Generates a <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">connectDatabase()</code> function
                using the native Mongoose <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">connect()</code> call.
                Reads <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">MONGODB_URI</code> from <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">.env</code>.
              </p>
              <Badge color="green">MongoDB</Badge>
            </div>

            {/* No ORM */}
            <div>
              <h3 className="text-lg font-semibold text-white/80 mb-2">No ORM</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Generates native driver connection code (e.g.,{" "}
                <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">pg.Pool</code>,{" "}
                <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">mysql2</code>,{" "}
                <code className="font-mono text-amber-400 text-sm bg-amber-950/30 px-1.5 py-0.5 rounded">better-sqlite3</code>, or the MongoDB native driver).
              </p>
            </div>
          </section>

          {/* ── Auth ── */}
          <section id="auth">
            <SectionHeading id="auth">
              <IconShield size={22} className="text-amber-500" />
              Authentication
            </SectionHeading>

            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              {/* JWT */}
              <div className="p-5 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-base font-semibold text-white/80 mb-1 flex items-center gap-2">
                  JWT <Badge color="amber">recommended</Badge>
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed mt-2">
                  Adds an <code className="font-mono text-amber-400">auth.middleware.ts</code> with a{" "}
                  <code className="font-mono text-amber-400">protect</code> middleware and an{" "}
                  <code className="font-mono text-amber-400">auth.controller.ts</code> with{" "}
                  <code className="font-mono text-amber-400">register</code> &amp;{" "}
                  <code className="font-mono text-amber-400">login</code> using <code className="font-mono text-amber-400">bcryptjs</code>.
                </p>
                <div className="mt-3 text-xs font-mono text-zinc-600">POST /api/auth/register</div>
                <div className="text-xs font-mono text-zinc-600">POST /api/auth/login</div>
              </div>

              {/* Better Auth */}
              <div className="p-5 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-base font-semibold text-white/80 mb-1">Better Auth</h3>
                <p className="text-zinc-500 text-xs leading-relaxed mt-2">
                  Scaffolds the <code className="font-mono text-amber-400">better-auth</code> configuration
                  in <code className="font-mono text-amber-400">src/config/auth.ts</code> and mounts the
                  auth handler at <code className="font-mono text-amber-400">/api/auth</code>.
                </p>
              </div>
            </div>

            <p className="text-zinc-500 text-sm">
              The JWT <code className="font-mono text-amber-400 bg-amber-950/30 px-1 py-0.5 rounded text-xs">protect</code> middleware
              reads the <code className="font-mono text-amber-400 bg-amber-950/30 px-1 py-0.5 rounded text-xs">Authorization: Bearer &lt;token&gt;</code> header,
              verifies it with <code className="font-mono text-amber-400 bg-amber-950/30 px-1 py-0.5 rounded text-xs">jsonwebtoken</code>,
              and attaches the decoded payload to <code className="font-mono text-amber-400 bg-amber-950/30 px-1 py-0.5 rounded text-xs">req.user</code>.
            </p>
          </section>

          {/* ── Validation ── */}
          <section id="validation">
            <SectionHeading id="validation">
              <IconCheck size={22} className="text-amber-500" />
              Validation
            </SectionHeading>
            <div className="p-5 rounded-lg border border-white/[0.06] bg-white/[0.02] mb-4">
              <h3 className="text-base font-semibold text-white/80 mb-2">Zod</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Adds a <code className="font-mono text-amber-400 bg-amber-950/30 px-1 py-0.5 rounded text-xs">src/app/validators/</code> directory
                with example schemas for validating request bodies. The generated validators export
                Zod schemas you can use with <code className="font-mono text-amber-400 bg-amber-950/30 px-1 py-0.5 rounded text-xs">safeParse()</code> in
                your controllers.
              </p>
            </div>
            <CodeBlock
              language="typescript"
              code={`import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// In your controller:
const result = registerSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ errors: result.error.flatten() });
}`}
            />
          </section>

          {/* ── Tooling ── */}
          <section id="tooling">
            <SectionHeading id="tooling">
              <IconSettings size={22} className="text-amber-500" />
              Tooling
            </SectionHeading>
            <div className="overflow-x-auto rounded-lg border border-white/[0.06] bg-white/[0.02]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Option</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">What it generates</th>
                  </tr>
                </thead>
                <tbody>
                  <TableRow cells={["Docker", "Multi-stage Dockerfile (builder → runner on node:22-alpine) and .dockerignore"]} />
                  <TableRow cells={["Swagger", "src/config/swagger.ts with OpenAPI 3.0 document, mounts UI at /api-docs (Express only)"]} />
                  <TableRow cells={["ESLint", "eslint.config.js using flat config format; TypeScript projects also get typescript-eslint"]} />
                  <TableRow cells={["Prettier", ".prettierrc with singleQuote: true, semi: true, printWidth: 100"]} />
                  <TableRow cells={["Husky", "prepare script and .lintstagedrc that runs ESLint + Prettier on staged src/ files"]} />
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Scripts ── */}
          <section id="scripts">
            <SectionHeading id="scripts">
              <IconTerminal2 size={22} className="text-amber-500" />
              Scripts
            </SectionHeading>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Scripts available in the generated project's <code className="font-mono text-amber-400 bg-amber-950/30 px-1 py-0.5 rounded text-xs">package.json</code>:
            </p>
            <div className="overflow-x-auto rounded-lg border border-white/[0.06] bg-white/[0.02]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Script</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Command</th>
                  </tr>
                </thead>
                <tbody>
                  <TableRow cells={["dev", "tsx watch src/server.ts (TS) or nodemon src/server.js (JS)"]} />
                  <TableRow cells={["build", "tsc (TypeScript only)"]} />
                  <TableRow cells={["start", "node dist/server.js (TS) or node src/server.js (JS)"]} />
                  <TableRow cells={["db:generate", "prisma generate or drizzle-kit generate"]} />
                  <TableRow cells={["db:migrate", "prisma migrate dev or drizzle-kit migrate"]} />
                  <TableRow cells={["prepare", "husky (if Husky was selected)"]} />
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Project Structure ── */}
          <section id="structure">
            <SectionHeading id="structure">
              <IconFolderOpen size={22} className="text-amber-500" />
              Project Structure
            </SectionHeading>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              The generated project follows this directory structure:
            </p>
            <CodeBlock
              language="text"
              code={`src/
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
└── server.ts               # Starts the server after DB connects`}
            />

            {/* Footer */}
            <div className="mt-20 pt-8 border-t border-white/[0.06] flex items-center justify-between">
              <p className="text-xs text-zinc-600 font-mono">MIT License</p>
              <Link
                href="/"
                className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
              >
                <IconArrowLeft size={13} />
                Back to home
              </Link>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
