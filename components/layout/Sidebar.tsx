import Link from "next/link";
import { Clock3, Star } from "lucide-react";

import { CategoryBadge } from "@/components/common/CategoryBadge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Category, Prompt } from "@/types";

export function Sidebar({ categories, prompts }: { categories: Category[]; prompts: Prompt[] }) {
  const tags = [...new Set(prompts.flatMap((prompt) => prompt.tags))].slice(0, 12);

  return (
    <aside className="hidden w-72 shrink-0 md:block">
      <div className="sticky top-24 space-y-4">
        <Card>
          <CardHeader>
            <p className="text-sm font-semibold">Quick filters</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/prompts?sort=updated_at" className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Clock3 className="h-4 w-4" />
              Recent
            </Link>
            <Link href="/prompts?sort=use_count" className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Star className="h-4 w-4" />
              Popular
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-sm font-semibold">Categories</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.map((category) => (
              <Link key={category.id} href={`/prompts?category=${encodeURIComponent(category.name)}`} className="flex items-center justify-between">
                <CategoryBadge name={category.name} color={category.color} />
                <span className="text-xs text-[var(--text-muted)]">
                  {prompts.filter((prompt) => prompt.category === category.name).length}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-sm font-semibold">Tags</p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/prompts?tags=${encodeURIComponent(tag)}`}
                className="rounded-full bg-[var(--surface-elevated)] px-3 py-1 text-xs text-[var(--text-secondary)]"
              >
                #{tag}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
