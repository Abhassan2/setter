import "../css/PaperLayout.css";
import React, { useState, useEffect } from "react";
import { usePaper } from "../context/PaperContext.jsx";
import html2pdf from "html2pdf.js";
import axios from "axios";
import config from "../config.js";

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

function PaperLayout() {
  const { paperQuestions, setPaperQuestions, removeFromPaper, showToast, uploadDocument } = usePaper();
  const [options, setOptions] = useState(loadOptions);

  useEffect(() => {
    localStorage.setItem("paperOptions", JSON.stringify(options));
  }, [options]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOptions((prev) => ({ ...prev, [name]: value }));
  };

  const resetOptions = () => {
    setOptions(DEFAULT_OPTIONS);
  };

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

  const handlePrint = async () => {
    try {
      const printContent = document.getElementById("print-content");
      if (!printContent) return;

      const date = new Date();
      const monthYear = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      
      const printTitle = `${options.subject} - ${monthYear}`;
      const pdfBlob = await html2pdf()
        .set({
          margin: 0,
          filename: `${printTitle}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            onclone: (clonedDoc) => {
              clonedDoc.querySelectorAll(".remove-btn").forEach((btn) => {
                btn.style.setProperty("display", "none", "important");
              });
            },
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
        })
        .from(printContent)
        .outputPdf("blob");

      const pdfFile = new File([pdfBlob], `${printTitle}.pdf`, {
        type: "application/pdf",
      });


      // upload document on cloudinary
      await uploadDocument(pdfFile);

      const pdfUrl = URL.createObjectURL(pdfBlob);
      // const link = document.createElement("a");

      // link.href = pdfUrl;
      // link.download = `${printTitle}.pdf`;
      // link.click();
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    } catch (error) {
      console.error(
        "PDF upload failed:",
        error?.response?.data || error.message,
      );

      alert(error?.response?.data?.message || "Failed to upload PDF");
    }
  };

  return (
    <div className="paper-layout-page">
      <h1 className="layout-heading">Paper Layout</h1>

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
              Save as PDF
            </button>
            <button type="button" className="secondary" onClick={resetOptions}>
              Reset
            </button>
          </div>
        </aside>

        {/* RIGHT: paper */}
        <div className="paper-wrapper" id="print-content">
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

export default React.memo(PaperLayout);
