import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY;
const secretAccessKey = process.env.R2_SECRET_KEY;

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.warn("Missing R2 credentials in environment variables. Uploads will fail.");
}

export const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId || ''}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || '',
    secretAccessKey: secretAccessKey || '',
  },
});
