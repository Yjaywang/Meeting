import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.accessKeyId || !process.env.secretAccessKey) {
  throw new Error("Missing AWS credentials: accessKeyId and secretAccessKey must be set");
}

if (!process.env.CDN_URL) {
  throw new Error("Missing CDN_URL environment variable");
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  },
});

export default s3Client;
