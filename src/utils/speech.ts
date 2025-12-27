export const fetchSpeechSynthesis = async (text: string): Promise<Blob> => {
  const response = await fetch("/api/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Speech synthesis failed: ${response.status} ${response.statusText}`
    );
  }

  return response.blob();
};
