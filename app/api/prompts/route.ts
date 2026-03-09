import { NextRequest } from "next/server";

import { handleApiError, ok } from "@/lib/api";
import { createPrompt, listPrompts } from "@/lib/data/repository";
import { promptQuerySchema, promptSchema } from "@/lib/validations/prompt";

export async function GET(request: NextRequest) {
  try {
    const parsed = promptQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams.entries()));
    const result = await listPrompts({
      ...parsed,
      tags: parsed.tags?.split(",").filter(Boolean)
    });
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = promptSchema.parse(await request.json());
    const result = await createPrompt({
      title: payload.title,
      description: payload.description,
      content: payload.content,
      category: payload.category,
      tags: payload.tags,
      model: payload.model,
      variables: payload.variables,
      attachments: payload.attachments,
      isPublic: payload.isPublic,
      shareToken: payload.shareToken
    });
    return ok(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
