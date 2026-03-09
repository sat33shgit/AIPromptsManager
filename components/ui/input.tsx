import * as React from "react";

import { cn } from "@/lib/utils/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "focus-ring h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm placeholder:text-[var(--text-muted)]",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
