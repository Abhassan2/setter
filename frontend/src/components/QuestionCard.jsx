import React from "react";
import { usePaper } from "../context/PaperContext";

function QuestionCard({ question, item, count }) {
  const { toggleAddQuestion, paperQuestions } = usePaper();
  const isAdded = (paperQuestions[item?.type] ?? []).includes(question);

  return (
    <div className="question-card">
      <div className="question-content">
        <span className="question-number">#</span>

        <p>{question}</p>
      </div>

      <div className="question-info">
        <span className="question-date">
          {new Date(item?.createdAt).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>

        <div className="question-actions">
          <button
            className="add-btn"
            onClick={() => toggleAddQuestion(question, item?.type)}
          >
            {isAdded ? "Remove" : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(QuestionCard);
