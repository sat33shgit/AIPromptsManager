import { cn } from "@/lib/utils/cn";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]",
        className
      )}
      {...props}
    />
  );
}
