import { notFound } from "next/navigation";

import { PromptDetail } from "@/components/prompts/PromptDetail";
import { getPrompt, listPrompts } from "@/lib/data/repository";

export default async function PromptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prompt = await getPrompt(id);

  if (!prompt) {
    notFound();
  }

  const related = (await listPrompts({ category: prompt.category, limit: 4 })).data
    .filter((entry) => entry.id !== prompt.id)
    .slice(0, 2);

  return <PromptDetail prompt={prompt} related={related} />;
}
