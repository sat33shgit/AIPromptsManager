import Link from "next/link";
import { Globe, Lock } from "lucide-react";

import { AttachmentListCard } from "@/components/common/AttachmentListCard";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { CopyButton } from "@/components/common/CopyButton";
import { TagBadge } from "@/components/common/TagBadge";
import { DeleteConfirmDialog } from "@/components/modals/DeleteConfirmDialog";
import { ShareModal } from "@/components/modals/ShareModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate, formatNumber } from "@/lib/utils/format";
import type { Prompt } from "@/types";

export function PromptDetail({ prompt, related }: { prompt: Prompt; related: Prompt[] }) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <CategoryBadge name={prompt.category} />
            <Badge className="gap-1">
              {prompt.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
              {prompt.isPublic ? "Public" : "Private"}
            </Badge>
            {prompt.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <h1 className="font-display text-4xl">{prompt.title}</h1>
              <p className="max-w-3xl text-[var(--text-secondary)]">{prompt.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyButton promptId={prompt.id} content={prompt.content} />
              <ShareModal token={prompt.shareToken} isPublic={prompt.isPublic} promptId={prompt.id} />
              <Button asChild variant="outline" size="sm">
                <Link href={`/prompts/${prompt.id}/edit`}>Edit</Link>
              </Button>
              <DeleteConfirmDialog promptId={prompt.id} title={prompt.title} attachments={prompt.attachments} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-2xl bg-[var(--surface-elevated)] p-5">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-[var(--text-primary)]">{prompt.content}</pre>
          </div>
          <div className="space-y-4">
            <Card className="bg-[var(--surface-elevated)]">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Model</span>
                  <span>{prompt.model || "Custom"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Created</span>
                  <span>{formatDate(prompt.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Updated</span>
                  <span>{formatDate(prompt.updatedAt)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Uses</span>
                  <span>{formatNumber(prompt.useCount)}</span>
                </div>
              </CardContent>
            </Card>
            <AttachmentListCard attachments={prompt.attachments} />
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl">Related prompts</h2>
            <p className="text-sm text-[var(--text-secondary)]">Similar category and model suggestions.</p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/prompts">Browse all</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {related.map((item) => (
            <Link key={item.id} href={`/prompts/${item.id}`} className="card-surface p-4 transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--text-secondary)]">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
