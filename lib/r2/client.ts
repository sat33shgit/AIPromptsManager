import { DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;

const r2Client =
  accountId && accessKeyId && secretAccessKey
    ? new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey
        }
      })
    : null;

/**
 * Check whether R2 storage is configured.
 */
export function isR2Configured() {
  return r2Client !== null && !!bucketName;
}

/**
 * Generate a presigned GET URL for downloading/viewing a private object.
 * Expires in 1 hour by default.
 */
export async function getSignedDownloadUrl(key: string, expiresIn = 3600) {
  if (!r2Client || !bucketName) {
    return null;
  }

  return getSignedUrl(
    r2Client,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    }),
    { expiresIn }
  );
}

/**
 * Upload a file buffer to R2.
 */
export async function putObject(key: string, body: Buffer, contentType: string, contentLength: number) {
  if (!r2Client || !bucketName) {
    return false;
  }

  const { PutObjectCommand } = await import("@aws-sdk/client-s3");

  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
      ContentLength: contentLength
    })
  );

  return true;
}

/**
 * Delete an object from R2.
 */
export async function deleteObject(key: string) {
  if (!r2Client || !bucketName) {
    return;
  }

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    })
  );
}
