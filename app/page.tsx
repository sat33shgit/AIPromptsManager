import Link from "next/link";
import { ArrowRight, Flame, FolderKanban, Sparkles, TrendingUp } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { Sidebar } from "@/components/layout/Sidebar";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardStats, listCategories, listPrompts } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [stats, categories, promptPage] = await Promise.all([
    getDashboardStats(),
    listCategories(),
    listPrompts({ limit: 50 })
  ]);

  const statItems = [
    { label: "Total prompts", value: stats.totalPrompts, icon: FolderKanban },
    { label: "Categories", value: stats.totalCategories, icon: Sparkles },
    { label: "Most used", value: stats.mostUsedPrompt?.title ?? "None yet", icon: TrendingUp },
    { label: "This week", value: stats.promptsThisWeek, icon: Flame }
  ];

  return (
    <div className="flex gap-8">
      <Sidebar categories={categories} prompts={promptPage.data} />
      <div className="min-w-0 flex-1 space-y-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statItems.map((item) => (
            <Card key={item.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-2xl bg-[var(--accent-subtle)] p-3 text-[var(--accent)]">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">{item.label}</p>
                  <p className="mt-1 text-lg font-semibold">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl">Recent prompts</h2>
              <p className="text-sm text-[var(--text-secondary)]">Freshly updated prompt work.</p>
            </div>
            <Button asChild variant="ghost">
              <Link href="/prompts">View all</Link>
            </Button>
          </div>
          {stats.recentPrompts.length ? (
            <PromptGrid prompts={stats.recentPrompts} />
          ) : (
            <EmptyState title="No prompts yet" description="Create your first prompt to populate the dashboard." />
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-display text-3xl">Popular prompts</h2>
            <p className="text-sm text-[var(--text-secondary)]">Sorted by copy volume.</p>
          </div>
          <PromptGrid prompts={stats.popularPrompts} />
        </section>
      </div>
    </div>
  );
}
