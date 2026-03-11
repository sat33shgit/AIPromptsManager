import { fail, handleApiError, ok } from "@/lib/api";
import { isR2Configured, putObject } from "@/lib/r2/client";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
  "text/markdown",
  "application/json",
  "application/pdf"
]);

function buildServeUrl(key: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/api/upload/serve?key=${encodeURIComponent(key)}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const promptId = formData.get("promptId") as string | null;

    if (!file) {
      return fail("No file provided", 400);
    }

    if (!promptId) {
      return fail("promptId is required", 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return fail("File size exceeds 10MB limit", 400);
    }

    const contentType = file.type || "application/octet-stream";
    if (!ALLOWED_TYPES.has(contentType)) {
      return fail(`File type ${contentType} is not allowed`, 400);
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const key = `prompts/${promptId}/${Date.now()}-${sanitizedName}`;

    if (isR2Configured()) {
      const buffer = Buffer.from(await file.arrayBuffer());
      await putObject(key, buffer, contentType, file.size);
    }

    return ok({
      key,
      name: file.name,
      url: buildServeUrl(key),
      size: file.size,
      type: contentType
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export const dynamic = "force-dynamic";
