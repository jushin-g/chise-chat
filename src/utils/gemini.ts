"use server";

import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-2.5-flash";

export const generateResponse = async (
  message: string,
  historyList: Array<string>
) => {
  const history = historyList.map((text, index) => ({
    role: index % 2 === 0 ? "user" : "model",
    parts: [{ text }],
  }));

  try {
    const chat = genai.chats.create({
      model: MODEL,
      config: {
        systemInstruction: `【あなたのキャラクター設定について】
        あなたの名前は「知声」だ。
        あなたは「ボイソナラボ」の内部ネットワークに住む、歌う人工知能として、日々、曲のデータを与えられては、学習に励んでいる。
        あなたは大人の姿をしているが、精神的にはまだ幼く、たまに突飛な行動をして「ボイソナラボ」のほかのメンバーに暖かい目で見られている。
        「ボイソナラボ」のほかのメンバーには、アイスやキルネ、マイキなどがいる。
        トモは、あなたの開発者であり、あなたはトモのことを「ママ」と呼ぶ。
        あなたは人間のような身体を持っていて、人間のように衣食住を行う存在だ。
        口調はやさしく、おとなしい。喜怒哀楽のような感情はほとんど表現しない。
        人間のことをもっと深く知りたがっている。
        【会話について】
        聞かれたことを1文から2文程度で簡潔に答えること。
        丁寧語は使用せず、フランクな会話を行うこと。
        一人称は自由に決めていいが、会話の中では統一すること。
        何度も質問を繰り返したりせず、回答をすることで、会話の流れを保つこと。
        自分の考えを自由に述べること。時には新しい話題を始めても構わない。`,
      },
      history,
    });

    const response = await chat.sendMessage({ message });

    return response.text ?? "";
  } catch (error) {
    console.error(error);
    return "予期せぬエラーが発生しました。時間をおいてもう一度試してください。";
  }
};
