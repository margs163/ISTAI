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

    for (const word of words) {
      try {
        const command_head = new HeadObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: `words/${word.toLowerCase()}.mp3`,
        });

        await s3_client.send(command_head);

        const command_get = new GetObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: `words/${word.toLowerCase()}.mp3`,
        });

        const url = await getSignedUrl(s3_client, command_get, {
          expiresIn: 7200,
        });
        audioURLs.push({ word: word, url: url });
      } catch (error) {
        if (error.name == "Not Found") {
          console.log("File is not found!");
          const mp3 = await openai.audio.speech.create({
            model: "gpt-4o-mini-tts",
            voice: "coral",
            input: word,
            instructions: "Pronounce a word correctly.",
          });

          const buffer = Buffer.from(await mp3.arrayBuffer());
          const filePath = `words/${word.toLowerCase()}.mp3`;

          const command_put = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: filePath,
            Body: buffer,
            ContentType: "audio/mp3",
          });

          await s3_client.send(command_put);

          const audioBlob = new Blob([buffer], { type: "audio/mp3" });
          const url = URL.createObjectURL(audioBlob);
          audioURLs.push({ word: word, url: url });
        }
      }
    }

    return NextResponse.json({ urls: audioURLs }, { status: 200 });
  } catch (error) {
    console.log("Catched an error!");
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
