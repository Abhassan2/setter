import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import {
  historyOfQuestions,
  saveQuestions,
} from "./controller/questionController.js";
import {
  fetchDocument,
  saveDocument,
  fetchSig,
} from "./controller/documentController.js";
import geminiAi from "./config/ai.js";

const app = express();
const PORT = 4000;
connectDB();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.send("Server is running");
  // const data = {
  //   subject: "Data Structures & Algorithum",
  //   difficulty: "medium",
  //   type: "Short Answer",
  //   topic: "searching algorithums",
  //   number: "3",
  // };
  // const result = await geminiAi(data);
  // console.log(JSON.parse(result));

  // res.send(JSON.parse(result));
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
