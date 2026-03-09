"use client";

import { useState } from "react";

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 500);
  }

  return { copied, copy };
}
