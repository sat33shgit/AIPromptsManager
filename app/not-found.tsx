import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="card-surface mx-auto max-w-xl p-8 text-center">
      <h1 className="font-display text-4xl">Not found</h1>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">The page or prompt you requested does not exist.</p>
      <Button asChild className="mt-5">
        <Link href="/prompts">Browse prompts</Link>
      </Button>
    </div>
  );
}
