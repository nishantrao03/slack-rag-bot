import dotenv from "dotenv";
import OpenAI from "openai";

import path from "path";
import { fileURLToPath } from "url";

// Resolve the path to the .env file in the project root (one level up)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

/**
 * messages: Array<{ role: string, content: string }>
 * tools: Array<Object> | null
 * stream: boolean
 */
export async function callGemini(messages, tools = null, stream = false) {
  try {
    const client = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });

    // ---------- STREAMING ----------
    if (stream) {
      return await client.chat.completions.create({
        model: "gemini-2.5-flash-lite",
        messages,
        tools: tools ?? undefined,
        stream: true
      });
    }

    // ---------- NORMAL ----------
    const response = await client.chat.completions.create({
      model: "gemini-2.5-flash",
      messages,
      tools: tools ?? undefined
    });

    return response;

  } catch (error) {
    console.error("Error while calling Gemini API");
    console.error("Type:", error.constructor.name);
    console.error("Message:", error.message);
    return null;
  }
}

export default callGemini;