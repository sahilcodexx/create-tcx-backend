import type { Metadata } from "next";
import HomeClient from "./components/HomeClient";

export const metadata: Metadata = {
  title: "create-tcx-backend — Scaffold Your Backend in Seconds",
  description:
    "Stop setting up backends manually. Use create-tcx-backend to instantly scaffold production-ready Node.js backend apps with Express, Fastify, and more.",
  openGraph: {
    title: "create-tcx-backend — Scaffold Your Backend in Seconds",
    description:
      "Stop setting up backends manually. Instantly scaffold production-ready backend apps with a single command.",
  },
};

export default function Home() {
  return (
    <main>
      <h1 className="sr-only">
        create-tcx-backend — Create Your Backend App with a Package, Not
        Manually
      </h1>
      <HomeClient />
    </main>
  );
}
