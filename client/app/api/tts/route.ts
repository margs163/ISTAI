import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { S3_BUCKET_NAME, s3_client } from "@/lib/s3";

dotenv.config();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileKey = searchParams.get("fileKey");

  if (!fileKey) {
    return NextResponse.json(
      { error: "No file key specified." },
      { status: 500 }
    );
  }

  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileKey as string,
    });

    const { Body, ContentType } = await s3_client.send(command);
    if (!Body) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const chunks: Buffer[] = [];
    // @ts-expect-error Body object is an iterator
    for await (const chunk of Body) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": ContentType ?? "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error fetching audio from S3 bucket: ", error);
    return NextResponse.json(
      { error: "Failed to fetch audio" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const audioFile = form.get("audio");

    console.log("RECIEVED AUDIO FILE FROM CLIENT");

    if (!audioFile) {
      return NextResponse.json(
        { error: "No formdata field audio" },
        { status: 400 }
      );
    }

    // @ts-expect-error it is an iterator
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const filePath = `reading-files/${uuidv4()}.wav`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: filePath,
      Body: buffer,
      ContentType: "audio/wav",
    });

    await s3_client.send(command);

    return NextResponse.json(
      {
        message: "Audio was uploaded to S3",
        filePath: filePath,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to upload an audio file to S3." },
      { status: 500 }
    );
  }
}
