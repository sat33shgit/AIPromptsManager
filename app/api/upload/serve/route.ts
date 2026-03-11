import { NextRequest } from "next/server";

import { fail } from "@/lib/api";
import { getSignedDownloadUrl } from "@/lib/r2/client";

/**
 * GET /api/upload/serve?key=prompts/xxx/file.png
 *
 * Generates a short-lived presigned GET URL for a private R2 object
 * and redirects the browser to it.
 */
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");

  if (!key) {
    return fail("Missing 'key' parameter", 400);
  }

  const signedUrl = await getSignedDownloadUrl(key);

  if (!signedUrl) {
    return fail("Storage is not configured", 503);
  }

  return Response.redirect(signedUrl, 302);
}

export const dynamic = "force-dynamic";
