"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconBrandGithub,
  IconCheck,
  IconCopy,
  IconDownload,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

const title = "Create Your Backend App with Package not manually";
const words = title.split(" ");
const lastWordIndex = words.length - 1;

export default function HomeClient() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("create-tcx-backend").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="max-w-md w-full flex flex-col gap-10">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 2, duration: 0.8 }}
            className="font-mono"
          >
            v1.0.0
          </motion.div>
          <motion.div
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 2, duration: 0.8 }}
            className="flex items-center justify-center gap-2"
          >
            <div className="flex items-center gap-1">
              <IconDownload size={14} />
              24
            </div>
            <div className="flex items-center gap-1">
              <IconBrandGithub size={14} /> 50
            </div>
          </motion.div>
        </div>

        {/* Animated title — word by word, char by char */}
        <div className="text-3xl pt-4">
          {words.map((word, i) => {
            const isLastWord = i === lastWordIndex;
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.2 * i, duration: 0.8 }}
                className="mr-2 inline-block"
              >
                {word.split("").map((char, j) => (
                  <motion.span
                    key={j}
                    className={`${
                      isLastWord
                        ? "text-black/70 font-medium dark:text-white/90"
                        : "text-black/30 dark:text-zinc-600"
                    }`}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
            );
          })}
        </div>

        {/* Command + copy button */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="w-full flex flex-col items-end relative pt-3"
        >
          <p
            onClick={handleCopy}
            className="max-w-md text-sm leading-8 tracking-normal text-zinc-600/50 dark:text-zinc-400/50 font-mono border border-dashed border-neutral-500/60 dark:border-neutral-400/70 w-full px-4 py-0.5 cursor-pointer flex select-none"
          >
            create-tcx-
            <span className="text-neutral-700 dark:text-white/80">backend</span>
            <span className="absolute right-5 top-5.5">
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-green-500"
                  >
                    <IconCheck size={14} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <IconCopy size={14} />
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </p>
          <span className="font-mono text-xs -rotate-10 absolute -top-2 -left-6 px-2 py-0.5 bg-amber-600 text-white">
            Create Now!
          </span>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="flex items-center justify-between font-mono pt-4"
        >
          <Link href="/docs">[Docs]</Link>
          <div className="flex gap-3">[github] [npm]</div>
        </motion.div>
      </div>
    </div>
  );
}
