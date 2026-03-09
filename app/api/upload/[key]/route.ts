import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { fail, handleApiError, ok } from "@/lib/api";
import { r2Client } from "@/lib/r2/client";

export async function DELETE(_: Request, context: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await context.params;
    const objectKey = decodeURIComponent(key);

    if (!r2Client || !process.env.CLOUDFLARE_R2_BUCKET_NAME) {
      return ok({ success: true });
    }

    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: objectKey
      })
    );

    return ok({ success: true });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to delete upload", 500);
  }
}

export const dynamic = "force-dynamic";
