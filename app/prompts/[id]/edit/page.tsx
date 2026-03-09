import { notFound } from "next/navigation";

import { PromptForm } from "@/components/prompts/PromptForm";
import { getPrompt, listCategories } from "@/lib/data/repository";

export default async function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [prompt, categories] = await Promise.all([getPrompt(id), listCategories()]);

  if (!prompt) {
    notFound();
  }

  return <PromptForm prompt={prompt} categories={categories} />;
}
