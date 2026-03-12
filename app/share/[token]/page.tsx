import Link from "next/link";
import { notFound } from "next/navigation";

import { AttachmentListCard } from "@/components/common/AttachmentListCard";
import { CopyButton } from "@/components/common/CopyButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPromptByShareToken } from "@/lib/data/repository";

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const prompt = await getPromptByShareToken(token);

  if (!prompt) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-10">
      <Card>
        <CardHeader className="space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Shared prompt</p>
          <h1 className="font-display text-4xl">{prompt.title}</h1>
          <p className="text-[var(--text-secondary)]">{prompt.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-2xl bg-[var(--surface-elevated)] p-5">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-7">{prompt.content}</pre>
          </div>
          <AttachmentListCard attachments={prompt.attachments} />
          <div className="flex flex-wrap gap-3">
            <CopyButton promptId={prompt.id} content={prompt.content} />
            <Link href="/" className="inline-flex items-center rounded-lg border border-[var(--border)] px-4 py-2 text-sm">
              Create your own on AI Prompts Manager
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
