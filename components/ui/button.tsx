import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--accent)] px-4 py-2 text-white hover:bg-[var(--accent-hover)]",
        secondary: "bg-[var(--surface-elevated)] px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--border-muted)]",
        outline: "border border-[var(--border)] bg-[var(--surface)] px-4 py-2 hover:bg-[var(--surface-elevated)]",
        ghost: "px-3 py-2 hover:bg-[var(--surface-elevated)]",
        destructive: "bg-[var(--destructive)] px-4 py-2 text-white hover:opacity-90"
      },
      size: {
        default: "h-10",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-5"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});

Button.displayName = "Button";

export { Button, buttonVariants };
