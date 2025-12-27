import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);
const exists = promisify(fs.exists);

const TEMP_DIR = path.join(process.cwd(), ".temp_audio");

// 一時的な保存ディレクトリを作成する
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const auth = btoa(
      `${process.env.VOISONA_TALK_USERNAME}:${process.env.VOISONA_TALK_PASSWORD}`
    );

    const filename = `speech_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}.wav`;
    const outputFilePath = path.join(TEMP_DIR, filename);

    // 音声合成キューを生成する
    const createResponse = await fetch(
      "http://localhost:32766/api/talk/v1/speech-syntheses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          force_enqueue: true,
          language: "ja_JP",
          text,
          destination: "file",
          output_file_path: outputFilePath,
        }),
      }
    );

    if (!createResponse.ok) {
      return NextResponse.json(
        {
          error: `Upstream error: ${createResponse.status} ${createResponse.statusText}`,
        },
        { status: createResponse.status }
      );
    }

    const createData = await createResponse.json();
    const uuid = createData.uuid;

    // 音声ファイルが生成されるまで待機する
    let isComplete = false;
    let attempts = 0;
    const maxAttempts = 10; // 10 * 500ms = 5 seconds timeout

    while (!isComplete && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;

      const statusResponse = await fetch(
        `http://localhost:32766/api/talk/v1/speech-syntheses/${uuid}`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      if (!statusResponse.ok) {
        continue;
      }

      const statusData = await statusResponse.json();
      if (statusData.state === "succeeded") {
        isComplete = true;
      } else if (statusData.state === "failed") {
        throw new Error("Speech synthesis failed in VoiSona");
      }
    }

    if (!isComplete || !(await exists(outputFilePath))) {
      throw new Error("Speech synthesis timed out");
    }

    const audioBuffer = await readFile(outputFilePath);

    // バックグラウンドでクリーンアップ処理
    const cleanup = async () => {
      try {
        await unlink(outputFilePath).catch((e) =>
          console.error("Failed to delete temp file:", e)
        );

        await fetch(
          `http://localhost:32766/api/talk/v1/speech-syntheses/${uuid}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Basic ${auth}`,
            },
          }
        ).catch((e) => console.error("Failed to delete VoiSona request:", e));
      } catch (e) {
        console.error("Cleanup failed:", e);
      }
    };

    cleanup();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (error: unknown) {
    console.error("Speech proxy error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
