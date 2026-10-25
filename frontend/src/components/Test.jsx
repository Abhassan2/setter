import "../css/PaperLayout.css";
import React, { useState, useEffect } from "react";
import { usePaper } from "../context/PaperContext.jsx";

const SECTION_A_TYPE = "very short answer";

const DEFAULT_OPTIONS = {
  college: "NGF COLLEGE OF ENGINEERING & TECHNOLOGY",
  exam: "MID-TERM EXAMINATION 2026",
  program: "B.Tech (CSE/ AI/ML)",
  subject: "Mathematics-I",
  maxMarks: "30",
  time: "1.5 Hours",
  sectionATitle: "Section A – Compulsory Short Answer Questions",
  sectionAMarks: "3 × 2 = 6 Marks",
  sectionBTitle: "Section B – Attempt any three of the rest of the questions",
  sectionBMarks: "24 Marks",
  fontSize: "14",
};

const loadOptions = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("paperOptions"));
    return { ...DEFAULT_OPTIONS, ...(saved ?? {}) };
  } catch {
    return DEFAULT_OPTIONS;
  }
};

function PaperLayoutt() {
  const { paperQuestions, removeFromPaper } = usePaper();
  const [options, setOptions] = useState(loadOptions);

  useEffect(() => {
    localStorage.setItem("paperOptions", JSON.stringify(options));
  }, [options]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOptions((prev) => ({ ...prev, [name]: value }));
  };

  const resetOptions = () => setOptions(DEFAULT_OPTIONS);

  // keep the original type key so removeFromPaper can find it
  const allQuestions = Object.entries(paperQuestions).flatMap(([type, qs]) =>
    qs.map((q) => ({ type, q })),
  );
  const sectionA = allQuestions.filter(
    ({ type }) => type.toLowerCase() === SECTION_A_TYPE,
  );
  const sectionB = allQuestions.filter(
    ({ type }) => type.toLowerCase() !== SECTION_A_TYPE,
  );

  const field = (label, name, type = "text") => (
    <div className="option-field">
      <label htmlFor={`opt-${name}`}>{label}</label>
      <input
        id={`opt-${name}`}
        type={type}
        name={name}
        value={options[name]}
        onChange={handleChange}
      />
    </div>
  );

  const handlePrint = () => {
    const oldTitle = document.title;

    const date = new Date();
    const monthYear = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    document.title = `${options.subject} - ${monthYear}`;

    window.print();

    document.title = oldTitle;
  };

  return (
    <div className="paper-layout-page">
      <h1 className="layout-heading">Paper Layout</h1>
      <hr />

      <div className="paper-layout-grid">
        {/* LEFT: layout options */}
        <aside className="layout-options">
          <h3>Layout Options</h3>

          <fieldset>
            <legend>Header</legend>
            {field("College name", "college")}
            {field("Exam title", "exam")}
            {field("Program", "program")}
            {field("Subject", "subject")}
            {field("Max marks", "maxMarks")}
            {field("Time", "time")}
          </fieldset>

          <fieldset>
            <legend>Section A</legend>
            {field("Title", "sectionATitle")}
            {field("Marks text", "sectionAMarks")}
          </fieldset>

          <fieldset>
            <legend>Section B</legend>
            {field("Title", "sectionBTitle")}
            {field("Marks text", "sectionBMarks")}
          </fieldset>

          <fieldset>
            <legend>Style</legend>
            <div className="option-field">
              <label htmlFor="opt-fontSize">Font size</label>
              <select
                id="opt-fontSize"
                name="fontSize"
                value={options.fontSize}
                onChange={handleChange}
              >
                <option value="12">Small (12px)</option>
                <option value="14">Medium (14px)</option>
                <option value="16">Large (16px)</option>
                <option value="18">Extra large (18px)</option>
              </select>
            </div>
          </fieldset>

          <div className="option-actions">
            <button type="button" onClick={handlePrint}>
              Print
            </button>
            <button type="button" className="secondary" onClick={resetOptions}>
              Reset
            </button>
          </div>
        </aside>

        {/* RIGHT: paper */}
        <div className="paper-wrapper">
          <div
            className="question-paper"
            style={{ fontSize: `${options.fontSize}px` }}
          >
            {/* Header */}
            <div className="paper-header">
              <h1>{options.college}</h1>
              <h2>{options.exam}</h2>
              <h2>{options.program}</h2>
              <h2>{options.subject}</h2>

              <div className="exam-info">
                <div>
                  <strong>Max Marks:</strong> <span>{options.maxMarks}</span>
                </div>
                <span>
                  <strong>Time:</strong> <span>{options.time}</span>
                </span>
              </div>
            </div>

            {/* Section A */}
            <div className="question-section">
              <div className="section-title">
                <h4>{options.sectionATitle}</h4>
                <span>{options.sectionAMarks}</span>
              </div>

              <div className="question">
                <ol>
                  {sectionA.length > 0 ? (
                    sectionA.map(({ type, q }) => (
                      <li key={`${type}-${q}`}>
                        {q}{" "}
                        <button
                          className="remove-btn"
                          onClick={() => removeFromPaper(type, q)}
                          aria-label="Remove question"
                        >
                          ×
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>For Example: Define a rational number.</li>
                  )}
                </ol>
              </div>
            </div>

            {/* Section B */}
            <div className="question-section">
              <div className="section-title">
                <h4>{options.sectionBTitle}</h4>
                <span>{options.sectionBMarks}</span>
              </div>

              <div className="question">
                <ol>
                  {sectionB.length > 0 ? (
                    sectionB.map(({ type, q }) => (
                      <li key={`${type}-${q}`}>
                        {q}{" "}
                        <button
                          className="remove-btn"
                          onClick={() => removeFromPaper(type, q)}
                          aria-label="Remove question"
                        >
                          ×
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>For Example: Explain what a linear equation is.</li>
                  )}
                </ol>
              </div>
            </div>

            {/* Footer */}
            <div className="paper-footer">
              <span>Page 1</span>
              <strong>*** End of Question Paper ***</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PaperLayoutt);
