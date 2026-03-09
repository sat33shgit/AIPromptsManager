"use client";

import Link from "next/link";
import { MoonStar, Plus, Search, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { Suspense } from "react";

import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/80 backdrop-blur-sm dark:bg-[rgba(18,18,16,0.8)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 md:h-16 md:px-6">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-lg">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)] text-white shadow-md">PV</span>
          <div className="hidden sm:block">
            <p className="font-display text-xl leading-none">PromptVault</p>
            <p className="text-xs text-[var(--text-secondary)]">Built for AI creators</p>
          </div>
        </Link>

        <div className="hidden flex-1 md:block">
          <Suspense fallback={<div className="h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)]" />}>
            <SearchBar />
          </Suspense>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Toggle dark mode"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {resolvedTheme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="md:hidden" aria-label="Search prompts">
            <Search className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link href="/prompts/new">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Prompt</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
