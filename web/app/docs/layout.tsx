import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs — create-tcx-backend",
  description:
    "Full documentation for create-tcx-backend: frameworks, databases, ORMs, authentication, validation, tooling, and project structure.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
