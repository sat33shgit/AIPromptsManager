import * as React from "react";

import { cn } from "@/lib/utils/cn";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "focus-ring min-h-[120px] w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)]",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
