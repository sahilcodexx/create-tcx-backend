"use client";

import { useState } from "react";
import { IconBrandGithub, IconCheck, IconCopy, IconDownload } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("create-tcx-backend").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="h-screen w-full  flex items-center justify-center">
      <div className="max-w-md w-full flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <div className="font-mono">v1.0.0 </div>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              <IconDownload size={14} />
              24
            </div>
            <div className="flex items-center gap-1 ">
              <IconBrandGithub size={14} /> 50
            </div>
          </div>
        </div>
        <div className="text-3xl pt-4">
          Create Your Backend App with Package not maunally
        </div>
        <div className="w-full flex flex-col items-end relative pt-3">
          <p
            onClick={handleCopy}
            className="max-w-md text-sm leading-8 tracking-normal text-zinc-600/50 dark:text-zinc-400/50 font-mono border border-dashed border-neutral-500/60 dark:border-neutral-400/70 w-full px-4 py-0.5 cursor-pointer flex select-none"
          >
            create-tcx-
            <span className="text-neutral-700 dark:text-white/80 ">
              backend
            </span>
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
        </div>
        <div className="flex items-center justify-between font-mono pt-4 ">
          [Docs]<div className="flex gap-3">[github] [npm]</div>
        </div>
      </div>
    </div>
  );
}

