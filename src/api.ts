import { get } from "svelte/store";
import { selectedModel } from "./stores";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function getLLMResponse(input: string): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    console.error("OpenRouter API key is not set");
    return "Error: API key is not configured.";
  }

  const model = get(selectedModel);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: "user", content: input }],
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    return "Error: Unable to get response from LLM.";
  }
}
