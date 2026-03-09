import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

export const r2Client =
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

export async function presignPutObject(command: object) {
  if (!r2Client) {
    return null;
  }

  return getSignedUrl(r2Client, command as never, { expiresIn: 60 * 15 });
}

export async function deleteObject(key: string) {
  if (!r2Client || !process.env.CLOUDFLARE_R2_BUCKET_NAME) {
    return;
  }

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key
    })
  );
}
