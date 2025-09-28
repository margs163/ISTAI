import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
export const S3_REGION = process.env.S3_REGION;

export const s3_client = new S3Client({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY as string,
    secretAccessKey: AWS_SECRET_KEY as string,
  },
  region: S3_REGION,
});
