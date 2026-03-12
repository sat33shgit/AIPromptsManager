import { memo } from "react";
import Link from "next/link";
import { Globe, Lock, Paperclip, Pencil } from "lucide-react";

import { CategoryBadge } from "@/components/common/CategoryBadge";
import { CopyButton } from "@/components/common/CopyButton";
import { TagBadge } from "@/components/common/TagBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatNumber, formatRelativeDate } from "@/lib/utils/format";
import type { Prompt } from "@/types";

export const PromptCard = memo(function PromptCard({ prompt, view = "grid" }: { prompt: Prompt; view?: "grid" | "list" }) {
  if (view === "list") {
    return (
      <Card className="p-4 transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <Link href={`/prompts/${prompt.id}`} className="text-lg font-semibold">
              {prompt.title}
            </Link>
            <p className="line-clamp-2 text-sm text-[var(--text-secondary)]">{prompt.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge name={prompt.category} />
            {prompt.tags.slice(0, 2).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {prompt.attachments.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <Paperclip className="h-3 w-3" />{prompt.attachments.length}
              </span>
            )}
            <span className="text-xs text-[var(--text-muted)]">{formatRelativeDate(prompt.updatedAt)}</span>
            <span className="text-xs text-[var(--text-muted)]">{formatNumber(prompt.useCount)} uses</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="transition duration-200 hover:-translate-y-1 hover:scale-[1.01]">
      <Card className="h-full transition hover:border-[var(--accent)] hover:shadow-md">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <CategoryBadge name={prompt.category} />
            {prompt.model ? <Badge className="bg-[var(--accent-subtle)] text-[var(--accent)]">{prompt.model}</Badge> : null}
          </div>
          <div className="space-y-2">
            <Link href={`/prompts/${prompt.id}`} className="line-clamp-2 text-xl font-semibold">
              {prompt.title}
            </Link>
            <p className="line-clamp-3 text-sm text-[var(--text-secondary)]">{prompt.description}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {prompt.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {prompt.tags.length > 3 ? <Badge>+{prompt.tags.length - 3} more</Badge> : null}
          </div>
          <div className="border-t border-dashed border-[var(--border)] pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <CopyButton promptId={prompt.id} content={prompt.content} />
              <Badge className="gap-1">
                {prompt.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                {prompt.isPublic ? "Public" : "Private"}
              </Badge>
              <Link href={`/prompts/${prompt.id}/edit`} className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>{formatRelativeDate(prompt.updatedAt)}</span>
              <div className="flex items-center gap-3">
                {prompt.attachments.length > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />{prompt.attachments.length}
                  </span>
                )}
                <span>{formatNumber(prompt.useCount)} uses</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
