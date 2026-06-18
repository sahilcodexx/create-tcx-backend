import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "create-tcx-backend — Scaffold Your Backend in Seconds",
    template: "%s | create-tcx-backend",
  },
  description:
    "Create production-ready backend apps instantly with create-tcx-backend. A powerful CLI tool to scaffold Express, Fastify, and more — no manual setup required.",
  keywords: [
    "create-tcx-backend",
    "backend scaffolding",
    "CLI tool",
    "Node.js backend",
    "Express generator",
    "backend boilerplate",
    "npm package",
    "TypeScript backend",
  ],
  authors: [{ name: "tcx" }],
  creator: "tcx",
  metadataBase: new URL("https://create-tcx-backend.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "create-tcx-backend",
    title: "create-tcx-backend — Scaffold Your Backend in Seconds",
    description:
      "Create production-ready backend apps instantly with create-tcx-backend. No manual setup required.",
  },
  twitter: {
    card: "summary_large_image",
    title: "create-tcx-backend — Scaffold Your Backend in Seconds",
    description:
      "Create production-ready backend apps instantly. A powerful CLI to scaffold your backend — no manual setup required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
