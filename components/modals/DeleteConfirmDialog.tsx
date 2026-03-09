"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PromptAttachment } from "@/types";

export function DeleteConfirmDialog({
  promptId,
  title,
  attachments
}: {
  promptId: string;
  title: string;
  attachments: PromptAttachment[];
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    setLoading(true);
    await fetch(`/api/prompts/${promptId}`, { method: "DELETE" });
    router.push("/prompts");
    router.refresh();
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
          <AlertDialog.Title className="font-display text-2xl">Delete prompt</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-[var(--text-secondary)]">
            Type <span className="font-medium text-[var(--text-primary)]">{title}</span> to confirm permanent deletion.
          </AlertDialog.Description>
          <div className="mt-4 space-y-3">
            {attachments.length > 0 ? (
              <ul className="rounded-xl bg-[var(--surface-elevated)] p-3 text-sm text-[var(--text-secondary)]">
                {attachments.map((attachment) => (
                  <li key={attachment.key}>{attachment.name}</li>
                ))}
              </ul>
            ) : null}
            <Input value={value} onChange={(event) => setValue(event.target.value)} />
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialog.Cancel>
            <Button variant="destructive" disabled={value !== title || loading} onClick={onDelete}>
              {loading ? "Deleting..." : "Delete prompt"}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
