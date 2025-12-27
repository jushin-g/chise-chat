"use server";

export const synthesizeSpeech = async (text: string) => {
  if (!text) {
    return;
  }

  const auth = btoa(
    `${process.env.VOISONA_TALK_USERNAME}:${process.env.VOISONA_TALK_PASSWORD}`
  );

  // 音声合成キューを生成する
  await fetch(
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
};
