import { PutObjectCommand } from "@aws-sdk/client-s3";

import { fail, handleApiError, ok } from "@/lib/api";
import { presignPutObject, r2Client } from "@/lib/r2/client";
import { uploadSchema } from "@/lib/validations/prompt";

export async function POST(request: Request) {
  try {
    const payload = uploadSchema.parse(await request.json());
    const filename = payload.filename.replace(/[^a-zA-Z0-9._-]/g, "-");
    const key = `prompts/${payload.promptId}/${Date.now()}-${filename}`;
    const publicBase = process.env.CLOUDFLARE_R2_PUBLIC_URL;

    if (!r2Client || !process.env.CLOUDFLARE_R2_BUCKET_NAME || !publicBase) {
      return ok({
        key,
        uploadUrl: null,
        publicUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/upload/mock/${encodeURIComponent(key)}`
      });
    }

    const uploadUrl = await presignPutObject(
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: key,
        ContentType: payload.contentType
      })
    );

    if (!uploadUrl) {
      return fail("Failed to generate upload URL", 500);
    }

    return ok({
      key,
      uploadUrl,
      publicUrl: `${publicBase.replace(/\/$/, "")}/${key}`
    });
  } catch (error) {
    return handleApiError(error);
  }
}
