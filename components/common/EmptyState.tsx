import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  actionHref = "/prompts/new",
  actionLabel = "Create your first prompt"
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <Card className="flex flex-col items-center gap-4 border-dashed px-6 py-12 text-center">
      <div className="rounded-full bg-[var(--accent-subtle)] p-4 text-[var(--accent)]">
        <Sparkles className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h2 className="font-display text-2xl">{title}</h2>
        <p className="mx-auto max-w-md text-sm text-[var(--text-secondary)]">{description}</p>
      </div>
      <Button asChild>
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </Card>
  );
}
