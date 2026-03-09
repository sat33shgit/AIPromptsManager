import { Suspense } from "react";

import { PromptsPageClient } from "@/components/prompts/PromptsPageClient";

export default function PromptsPage() {
  return (
    <Suspense
      fallback={
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-60 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]" />
          ))}
        </div>
      }
    >
      <PromptsPageClient />
    </Suspense>
  );
}
