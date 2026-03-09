import { PromptCard } from "@/components/prompts/PromptCard";
import type { Prompt } from "@/types";

export function PromptGrid({ prompts, view = "grid" }: { prompts: Prompt[]; view?: "grid" | "list" }) {
  const className = view === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-3";

  return (
    <div className={className}>
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} view={view} />
      ))}
    </div>
  );
}
