import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "テキストは必須です" },
        { status: 400 }
      );
    }

    const auth = btoa(
      `${process.env.VOISONA_TALK_USERNAME}:${process.env.VOISONA_TALK_PASSWORD}`
    );

    // 音声合成キューを生成する
    const response = await fetch(
      `${process.env.VOISONA_TALK_API_ORIGIN}/api/talk/v1/speech-syntheses`,
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
          voice_name: "chis-a_ja_JP",
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "音声合成キューの生成に失敗しました" },
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "予期せぬエラーが発生しました" },
      { status: 500 }
    );
  }
}
