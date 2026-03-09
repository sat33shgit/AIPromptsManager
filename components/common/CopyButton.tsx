"use client";

import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/useClipboard";

export function CopyButton({ promptId, content }: { promptId: string; content: string }) {
  const { copied, copy } = useClipboard();

  async function onCopy() {
    await copy(content);
    void fetch(`/api/prompts/${promptId}/copy`, { method: "POST" });
    toast.success("Prompt copied to clipboard");
  }

  return (
    <Button variant="secondary" size="sm" onClick={onCopy}>
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
