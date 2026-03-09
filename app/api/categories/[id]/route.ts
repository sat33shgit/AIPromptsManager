import { fail, handleApiError, ok } from "@/lib/api";
import { deleteCategory } from "@/lib/data/repository";

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const category = await deleteCategory(id);
    if (!category) {
      return fail("Category not found", 404);
    }
    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
