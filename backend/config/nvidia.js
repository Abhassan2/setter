import "dotenv/config";
import OpenAI from "openai";

const nvidia = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
  timeout: 120000,
});

const generate = async (data) => {
  const prompt = `
    Return the result strictly as a valid JSON array. Do not include any explanation, 
    introductory text, markdown, or code fences. Output only the array

    Generate ${data?.number} questions for ${data.subject} on the topic "${data.topic}".

    Question Type: ${data.type}
    Difficulty Level: ${data.difficulty}

    Ensure each question is accurate, clear, non-repetitive, appropriate for its difficulty level, and aligned with the specified marks.

    Generate exactly the requested number of questions and related to difficulty level.
    Return only the questions.
    `;

  try {
    console.log("Processing......");
    
    const response = await nvidia.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    if(response.choices[0].message.content){
      console.log("Task Done...");
      return response.choices[0].message.content;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default generate;
