import { useState } from "react";
import { generateResponse } from "@/utils/gemini";

export const useGemini = () => {
  const [userMessage, setUserMessage] = useState<string>("");
  const [geminiMessage, setGeminiMessage] = useState<string>("");
  const [historyList, setHistoryList] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    setUserMessage(message);
    setGeminiMessage("");

    const response = await generateResponse(message, historyList);

    setGeminiMessage(response);
    setHistoryList([...historyList, message, response]);
    setIsLoading(false);
  };

  return {
    userMessage,
    geminiMessage,
    isLoading,
    sendMessage,
  };
};
