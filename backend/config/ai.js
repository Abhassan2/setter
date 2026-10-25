import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function geminiAi(data) {
  const prompt = `
    Generate questions for ${data.subject} on the topic "${data.topic}".

    Easy: ${data.easy} questions
    Medium: ${data.medium} questions
    Hard: ${data.hard} questions

    Question Type: ${data.type}
    Marks: ${data.marks}

    Ensure each question is accurate, clear, non-repetitive, appropriate for its difficulty level, and aligned with the specified marks.

    Generate exactly the requested number of questions for each difficulty.
    Return only the questions in an array format.
    `;

  try {
    console.log("Gemini request started");
    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt,
    });

    return interaction.output_text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export default geminiAi;
