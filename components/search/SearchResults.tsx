import { EmptyState } from "@/components/common/EmptyState";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import type { Prompt } from "@/types";

export function SearchResults({ prompts, view }: { prompts: Prompt[]; view: "grid" | "list" }) {
  if (!prompts.length) {
    return (
      <EmptyState
        title="No prompts found"
        description="Try a different search term, remove a filter, or create a new prompt."
        actionHref="/prompts/new"
        actionLabel="Create prompt"
      />
    );
  }

  return <PromptGrid prompts={prompts} view={view} />;
}
