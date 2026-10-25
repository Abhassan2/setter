import React, { useEffect, useState, useRef } from "react";
import "../css/Create.css";
import config from "../config.js";
import axios from "axios";
import Loader from "./Loader.jsx";
import { usePaper } from "../context/PaperContext.jsx";

function GenQuesForm() {
  const {
    isLoading,
    setIsLoading,
    generated,
    setGeneratedQuestions,
    showToast,
  } = usePaper();
  const hasQuestions = generated?.items?.length > 0;

  const controllerRef = useRef(null);

  const [subject, setSubject] = useState("Data Structures & Algorithum");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState(null);
  const [number, setNumber] = useState("1");
  const [type, setType] = useState("Very Short Answer");

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    controllerRef.current = new AbortController();
    const data = { subject, difficulty, type, topic, number };

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${config.API_URL}/generate-newQuestion`,
        data,
        {
          signal: controllerRef.current.signal,
          timeout: 120000,
        },
      );

      if (response.data.success) {
        showToast("Questions Generated successfully", "success");
        setGeneratedQuestions(response.data.result, type.toLowerCase());
      } else {
        showToast("No questions were returned. Please try again", "info");
      }
    } catch (error) {
      if (axios.isCancel(error)) return;

      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        showToast("Request timed out after 2 minutes", "error");
      } else if (error.response?.status === 408) {
        showToast("AI is taking too long. Please try again", "error");
      } else {
        console.error("API error:", error.message);
        showToast(error.message || "Something went wrong!", "error");
      }
    } finally {
      setIsLoading(false);
      controllerRef.current = null;
    }
  };

  useEffect(() => {
    if (Number(number) > 10) {
      alert("Number should be lie btw 1 & 10.");
      setNumber(10);
    } else if (Number(number) < 0 && Number(number) !== 0) {
      alert("Number should be lie btw 1 & 10.");
      setNumber(1);
    }
  }, [number]);

  useEffect(() => {});
  return (
    <form onSubmit={handleSubmit} className="create-paper-form">
      <h2 className="text-lg font-bold mb-2">Paper Details</h2>

      <label>Question Type:</label>
      <select value={type} onChange={(e) => setType(e.target.value)} required>
        <option>MCQ</option>
        <option>True/False</option>
        <option>Fill in the Blank</option>
        <option>Very Short Answer</option>
        <option>Short Answer</option>
        <option>Long Answer</option>
        <option>Numerical</option>
        <option>Case Study</option>
        <option>Assertion & Reason</option>
        <option>Coding/Programming</option>
      </select>

      <label>Subject:</label>
      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option>Data Structures & Algorithum</option>
        <option>Object Oriented Programming</option>
        <option>Computer Network</option>
        <option>Database Management System</option>
      </select>

      <label>Enter Topic</label>
      <input
        type="text"
        name="topic"
        value={topic}
        placeholder="Enter Topic"
        onChange={(e) => setTopic(e.target.value)}
        required
      />

      <label>No. of questions:</label>
      <input
        type="number"
        name="number"
        min={1}
        max={10}
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />

      <div className="difficulty-group">
        <h4>Difficulty Level:</h4>
        <div>
          <label htmlFor="easy">Easy:</label>
          <input
            type="radio"
            id="easy"
            name="difficulty"
            value="easy"
            checked={difficulty === "easy"}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          />

          <label htmlFor="medium">Medium:</label>
          <input
            type="radio"
            id="medium"
            name="difficulty"
            value="medium"
            checked={difficulty === "medium"}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          />

          <label htmlFor="hard">Hard:</label>
          <input
            type="radio"
            id="hard"
            name="difficulty"
            value="hard"
            checked={difficulty === "hard"}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          />
        </div>
      </div>

      <button type="submit" disabled={isLoading || hasQuestions}>
        {isLoading ? (
          <span
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Loader isLoading={isLoading} size="small" color="#000" />
            <span>Generating...</span>
          </span>
        ) : (
          "Generate Questions"
        )}
      </button>
    </form>
  );
}

export default React.memo(GenQuesForm);
