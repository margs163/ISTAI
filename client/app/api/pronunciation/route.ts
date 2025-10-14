import { S3_BUCKET_NAME, s3_client } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { openai } from "@/lib/openai";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const words = searchParams.getAll("words");
    const audioURLs = [];

    console.log("Words TTS endpoint was hit!", { words });

    for (const word of words) {
      const fileKey = `words/${word.toLowerCase()}.mp3`;

      try {
        const headCommand = new HeadObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileKey,
        });

        await s3_client.send(headCommand);
        console.log(`File found in S3: ${fileKey}`);

        const getCommand = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileKey,
        });

        const url = await getSignedUrl(s3_client, getCommand, {
          expiresIn: 7200,
        });
        audioURLs.push({ word, url });
      } catch (error) {
        if (
    // @ts-expect-error Body object is an iterator
          error.name === "NoSuchKey" ||
    // @ts-expect-error Body object is an iterator
          error.$metadata?.httpStatusCode === 404
        ) {
          console.log(`File not found in S3: ${fileKey}, generating new audio`);

          const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "coral",
            input: word,
            instructions: "Pronounce a word correctly.",
          });

          const buffer = Buffer.from(await mp3.arrayBuffer());

          const putCommand = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileKey,
            Body: buffer,
            ContentType: "audio/mp3",
          });

          await s3_client.send(putCommand);
          console.log(`Uploaded new file to S3: ${fileKey}`);

          const getCommand = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileKey,
          });

          const url = await getSignedUrl(s3_client, getCommand, {
            expiresIn: 7200,
          });
          audioURLs.push({ word, url });
        } else {
          console.error(`Error checking S3 file ${fileKey}:`, error);
          throw error;
        }
      }
    }

    return NextResponse.json({ urls: audioURLs }, { status: 200 });
  } catch (error) {
    console.error("Error in TTS endpoint:", error);
    // @ts-expect-error Body object is an iterator
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
