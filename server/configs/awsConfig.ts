import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.accessKeyId as string,
    secretAccessKey: process.env.secretAccessKey as string,
  },
});

export default s3Client;
