import { ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { PromptAttachment } from "@/types";

export function AttachmentListCard({ attachments }: { attachments: PromptAttachment[] }) {
  if (!attachments.length) {
    return null;
  }

  return (
    <Card className="bg-[var(--surface-elevated)]">
      <CardHeader>
        <p className="font-semibold">Attachments ({attachments.length})</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {attachments.map((attachment) => (
          <a
            key={attachment.key}
            href={`/api/upload/serve?key=${encodeURIComponent(attachment.key)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-[var(--accent)]"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            {attachment.name}
          </a>
        ))}
      </CardContent>
    </Card>
  );
}