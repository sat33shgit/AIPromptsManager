"use client";

import { useMemo } from "react";
import { Grid2X2, List, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { EmptyState } from "@/components/common/EmptyState";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePrompts } from "@/hooks/usePrompts";
import { useUiStore } from "@/store/ui";

export function PromptsPageClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { listView, toggleListView } = useUiStore();
  const queryParams = useMemo(
    () => ({
      q: params.get("q") ?? undefined,
      category: params.get("category") ?? undefined,
      tags: params.get("tags") ?? undefined,
      model: params.get("model") ?? undefined,
      sort: params.get("sort") ?? "updated_at",
      order: params.get("order") ?? "desc",
      page: params.get("page") ?? 1,
      limit: 20
    }),
    [params]
  );
  const { data, isLoading } = usePrompts(queryParams);

  const prompts = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-4xl">All prompts</h1>
          <p role="status" className="text-sm text-[var(--text-secondary)]">
            Showing {prompts.length} of {total} prompts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleListView}>
            {listView === "grid" ? <List className="h-4 w-4" /> : <Grid2X2 className="h-4 w-4" />}
            {listView === "grid" ? "List view" : "Grid view"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push("/prompts?sort=use_count")}>
            <SlidersHorizontal className="h-4 w-4" />
            Popular
          </Button>
        </div>
      </div>

      <SearchBar />

      <Card>
        <CardContent className="flex flex-wrap gap-2 p-4">
          {["Marketing", "Coding", "Research", "Writing"].map((category) => (
            <Button
              key={category}
              variant={params.get("category") === category ? "default" : "secondary"}
              size="sm"
              onClick={() => router.push(`/prompts?category=${category}`)}
            >
              {category}
            </Button>
          ))}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-60 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]" />
          ))}
        </div>
      ) : prompts.length ? (
        <PromptGrid prompts={prompts} view={listView} />
      ) : (
        <EmptyState title="No prompts match these filters" description="Reset your search or create a new prompt." />
      )}
    </div>
  );
}
