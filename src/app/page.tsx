"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useGemini } from "@/hooks/useGemini";
import clsx from "clsx";
import Image from "next/image";
import { synthesizeSpeech } from "@/utils/speech";

export default function Home() {
  const { userMessage, geminiMessage, isLoading, sendMessage } = useGemini();
  const [input, setInput] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput("");
  };

  useEffect(() => {
    if (geminiMessage) {
      synthesizeSpeech(geminiMessage);
    }
  }, [geminiMessage]);

  return (
    <main className={styles.main}>
      <Image
        src="/chise.png"
        alt="chise"
        className={styles.chiseImage}
        width={1706}
        height={1553}
        loading="eager"
      />
      {geminiMessage ? (
        <p
          key={geminiMessage}
          className={clsx(styles.responseContent, styles.Message)}
        >
          {geminiMessage}
        </p>
      ) : isLoading ? (
        <p
          key="loading"
          className={clsx(styles.responseContent, styles.Loading)}
        >
          考え中・・・
        </p>
      ) : (
        <p className={clsx(styles.responseContent, styles.Placeholder)}>
          知声に話しかけてみてね
        </p>
      )}

      <div className={styles.bottomArea}>
        {userMessage && (
          <div className={styles.userMessageBubble} key={userMessage}>
            {userMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            className={styles.inputField}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={isLoading || !input.trim()}
          >
            送信
          </button>
        </form>
      </div>
    </main>
  );
}
