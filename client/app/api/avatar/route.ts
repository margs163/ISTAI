import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { S3_BUCKET_NAME, s3_client } from "@/lib/s3";

dotenv.config();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json(
      { error: "Filename is required" },
      { status: 400 }
    );
  }

  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: filename,
    });

    const url = await getSignedUrl(s3_client, command, { expiresIn: 7200 });

    return NextResponse.json({ url: url });
  } catch (error) {
    console.error("Error downloading file from S3:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}
