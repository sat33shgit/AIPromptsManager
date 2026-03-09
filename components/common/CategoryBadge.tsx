import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

export function CategoryBadge({ name, color, className }: { name?: string; color?: string; className?: string }) {
  if (!name) {
    return null;
  }

  return (
    <Badge className={cn("gap-2", className)}>
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color ?? "#2563EB" }} />
      {name}
    </Badge>
  );
}
