import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function geminiAi(data) {
  const prompt = `
    Return the result strictly as a valid JSON array. Do not include any explanation, 
    introductory text, markdown, or code fences. Output only the array

    Generate ${data?.number} questions for ${data.subject} on the topic "${data.topic}".

    Question Type: ${data.type}
    Difficulty Level: ${data.difficulty}

    Ensure each question is accurate, clear, non-repetitive, appropriate for its difficulty level.

    Generate exactly the requested number of questions and related to difficulty level.
    Return only the questions.
    `;

  try {
    console.log("Thinking......");
    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt,
    });
    console.log("Task done...");
    
    return interaction.output_text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export default geminiAi;
