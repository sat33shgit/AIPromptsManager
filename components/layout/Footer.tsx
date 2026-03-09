import Link from "next/link";

import { Badge } from "@/components/ui/badge";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--surface-elevated)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div className="space-y-3">
          <p className="font-display text-2xl">PromptVault</p>
          <p className="max-w-sm text-sm text-[var(--text-secondary)]">
            A calm, high-signal workspace for writing, testing, and sharing AI prompts at scale.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold">Quick links</p>
          <div className="flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
            <Link href="/prompts">All Prompts</Link>
            <Link href="/prompts?sort=use_count">Popular</Link>
            <Link href="/prompts/new">Create Prompt</Link>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold">Stack</p>
          <div className="flex flex-wrap gap-2">
            <Badge>Vercel</Badge>
            <Badge>Cloudflare R2</Badge>
            <Badge>Postgres</Badge>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--border)] px-4 py-4 text-center text-xs text-[var(--text-secondary)]">
        PromptVault v0.1.0
      </div>
    </footer>
  );
}
