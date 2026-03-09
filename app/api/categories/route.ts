import { handleApiError, ok } from "@/lib/api";
import { createCategory, listCategories } from "@/lib/data/repository";
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
