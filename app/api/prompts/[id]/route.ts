import { fail, handleApiError, ok } from "@/lib/api";
import { deletePrompt, getPrompt, updatePrompt } from "@/lib/data/repository";
import { deleteObject } from "@/lib/r2/client";
import { promptSchema } from "@/lib/validations/prompt";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const prompt = await getPrompt(id);
    if (!prompt) {
      return fail("Prompt not found", 404);
    }
    return ok(prompt);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const payload = promptSchema.partial().parse(await request.json());
    const prompt = await updatePrompt(id, {
      ...payload,
      description: payload.description ?? undefined,
      category: payload.category ?? undefined,
      model: payload.model ?? undefined
    });
    if (!prompt) {
      return fail("Prompt not found", 404);
    }
    return ok(prompt);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const prompt = await deletePrompt(id);
    if (!prompt) {
      return fail("Prompt not found", 404);
    }

    // Clean up attachments from R2
    await Promise.all(
      prompt.attachments.map((attachment) => deleteObject(attachment.key))
    );

    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

