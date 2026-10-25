import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import geminiAi from "./config/ai.js";
import generate from "./config/nvidia.js";
import {
  historyOfQuestions,
  saveQuestions,
} from "./controller/questionController.js";
import { fetchDocument, saveDocument, fetchSig } from "./controller/pdfController.js";


const app = express();
const PORT = 4000;
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
  const data = {
    number: "2",
    subject: "data structure & algorithum",
    topic: "queue",
    type: "Short Answer",
    difficulty: "easy",
  };
  // const result = await geminiAi(data);
  const response = await generate(data);
  const result = JSON.parse(response);
  console.log("Task Done!!");
  console.log(result);
  res.send("Server is running");
});

app.post("/generate-newQuestion", saveQuestions);
app.get("/history", historyOfQuestions);

// Document route
app.get("/upload-signature", fetchSig);
app.post("/save-document", saveDocument);
app.get("/documents", fetchDocument);

const onServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

onServer();
