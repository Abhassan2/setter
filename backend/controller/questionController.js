import generate from "../config/nvidia.js";
import Question from "../model/questionSchema.js";

export const saveQuestions = async (req, res) => {
  try {
    const { subject, topic, difficulty, number, type } = req.body;
    if (!subject || !topic || !difficulty || !number || !type) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Generate questions using AI
    const questions = await generate(req.body);
    const result =
      typeof questions === "string" ? JSON.parse(questions) : questions;

    const quesCollection = new Question({
      subject,
      topic,
      type,
      questions: result,
      difficultyLevel: difficulty,
    });
    await quesCollection.save();

    return res.status(201).json({
      success: true,
      message: "Questions generated and saved successfully",
      result,
    });
  } catch (error) {
    if (error.name === "AbortError" || error.name === "TimeoutError") {
      return res.status(408).json({
        success: false,
        message: "AI request timed out after 2 minutes. Please try again.",
      });
    }

    console.error("Error saving questions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save questions",
      error: error.message,
    });
  }
};

export const historyOfQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Question history fetched successfully",
      questions,
    });
  } catch (error) {
    console.error("Error fetching question history:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch question history",
      error: error.message,
    });
  }
};

