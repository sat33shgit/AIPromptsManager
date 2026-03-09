import { fail, handleApiError, ok } from "@/lib/api";
import { getPromptByShareToken } from "@/lib/data/repository";

export async function GET(_: Request, context: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await context.params;
    const prompt = await getPromptByShareToken(token);
    if (!prompt) {
      return fail("Shared prompt not found", 404);
    }
    return ok(prompt);
  } catch (error) {
    return handleApiError(error);
  }
}
