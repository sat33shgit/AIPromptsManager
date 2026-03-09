import Link from "next/link";
import { ArrowRight, Flame, FolderKanban, Sparkles, TrendingUp } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { Sidebar } from "@/components/layout/Sidebar";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardStats, listCategories, listPrompts } from "@/lib/data/repository";

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
        <section className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(37,99,235,0.14),rgba(255,255,255,0.74))] p-8 shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--text-secondary)]">AI Prompt Manager</p>
              <h1 className="max-w-2xl font-display text-5xl leading-tight text-balance">
                Organize high-value prompts with a design that feels deliberate.
              </h1>
              <p className="max-w-2xl text-sm text-[var(--text-secondary)]">
                Create, search, share, and refine prompts across models, categories, and attachments without turning
                your workspace into a spreadsheet.
              </p>
            </div>
            <Button asChild size="lg" className="whitespace-nowrap">
              <Link href="/prompts/new">
                Start a new prompt
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

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

        {stats.starredPrompts.length ? (
          <section className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl">Pinned prompts</h2>
                <p className="text-sm text-[var(--text-secondary)]">Quick access to high-leverage workflows.</p>
              </div>
            </div>
            <PromptGrid prompts={stats.starredPrompts} />
          </section>
        ) : null}

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
