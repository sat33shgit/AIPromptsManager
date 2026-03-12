import { handleApiError, ok } from "@/lib/api";
import { createCategory, listCategories, deleteCategory } from "@/lib/data/repository";
import { categorySchema } from "@/lib/validations/prompt";

export async function GET() {
  try {
    return ok(await listCategories());
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = categorySchema.parse(await request.json());
    const category = await createCategory({
      name: payload.name,
      color: payload.color,
      icon: payload.icon
    });
    return ok(category, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = await request.json();
    if (!payload.ids || !Array.isArray(payload.ids)) {
      throw new Error("Invalid request: 'ids' must be an array");
    }
    
    for (const id of payload.ids) {
      await deleteCategory(id);
    }
    
    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
