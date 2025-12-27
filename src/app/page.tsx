"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useGemini } from "@/hooks/useGemini";
import clsx from "clsx";

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
      fetch("/api/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: geminiMessage,
        }),
      });
    }
  }, [geminiMessage]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.responseArea}>
          {geminiMessage ? (
            <p
              key={geminiMessage}
              className={clsx(styles.responseContent, styles.message)}
            >
              {geminiMessage}
            </p>
          ) : (
            isLoading && (
              <p
                key="loading"
                className={clsx(styles.responseContent, styles.loading)}
              >
                考え中・・・
              </p>
            )
          )}
          {!geminiMessage && !isLoading && (
            <p className={clsx(styles.responseContent, styles.placeholder)}>
              知声に話しかけてみてね
            </p>
          )}
        </div>

        <div className={styles.bottomArea}>
          {userMessage && (
            <div className={styles.userMessageBubble}>{userMessage}</div>
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
    </div>
  );
}
