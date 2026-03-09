import { PromptForm } from "@/components/prompts/PromptForm";
import { listCategories } from "@/lib/data/repository";

export default async function NewPromptPage() {
  const categories = await listCategories();
  return <PromptForm categories={categories} />;
}
