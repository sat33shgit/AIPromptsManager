import { handleApiError, ok } from "@/lib/api";
import { deleteObject } from "@/lib/r2/client";

export async function DELETE(_: Request, context: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await context.params;
    await deleteObject(decodeURIComponent(key));
    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

export const dynamic = "force-dynamic";
