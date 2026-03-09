"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="card-surface mx-auto max-w-xl p-8 text-center">
      <h2 className="font-display text-3xl">Something failed</h2>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">{error.message}</p>
      <Button className="mt-5" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
