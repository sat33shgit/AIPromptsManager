import { fail, handleApiError, ok } from "@/lib/api";
import { getPrompt, incrementPromptUse } from "@/lib/data/repository";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const prompt = await getPrompt(id);
    if (!prompt) {
      return fail("Prompt not found", 404);
    }
    await incrementPromptUse(id);
    return ok({ content: prompt.content });
  } catch (error) {
    return handleApiError(error);
  }
}
