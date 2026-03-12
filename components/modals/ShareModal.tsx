"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { Check, Copy, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ShareModal({ token, isPublic, promptId }: { token: string; isPublic: boolean; promptId: string }) {
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState(process.env.NEXT_PUBLIC_APP_URL ?? "");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const url = baseUrl ? new URL(`/share/${token}`, baseUrl).toString() : `/share/${token}`;

  async function copyUrl() {
    if (!isPublic) {
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 800);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
          <Dialog.Title className="font-display text-2xl">Share prompt</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-[var(--text-secondary)]">
            {isPublic
              ? "Anyone with this link can view the public version of the prompt."
              : "This prompt is currently private. Enable public sharing before using a share link."}
          </Dialog.Description>
          {isPublic ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[var(--surface-elevated)] p-4">
                <QRCodeSVG value={url} className="mx-auto" />
              </div>
              <div className="flex gap-2">
                <Input readOnly value={url} />
                <Button onClick={copyUrl} variant="secondary">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-[var(--surface-elevated)] p-4">
              <p className="text-sm text-[var(--text-secondary)]">Open the edit page and turn on the Public prompt setting to generate a working share URL.</p>
              <Button asChild className="mt-4" variant="outline">
                <Link href={`/prompts/${promptId}/edit`}>Open sharing settings</Link>
              </Button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
