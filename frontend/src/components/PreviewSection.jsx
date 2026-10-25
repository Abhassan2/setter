import { useState, useEffect } from "react";
import Loader from "./Loader.jsx";
import { usePaper } from "../context/PaperContext.jsx";

export default function PreviewSection() {
  const { isLoading, generated, addToPaper, clearGenerated, paperQuestions } = usePaper();
  const { items: questions, type } = generated;

  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]);
  }, [questions]);

  const isAlreadyAdded = (q) => (paperQuestions[type] ?? []).includes(q);

  const toggle = (q) => {
    if(isAlreadyAdded(q)) {
      alert("This question is already added to the paper.");
      return;
    }

    setSelected((prev) =>
      prev.includes(q) ? prev.filter((x) => x !== q) : [...prev, q]
    );
  };

  const handleAdd = () => {
    if (selected?.length === 0) {
      alert("Please choose questions");
      return;
    }
    addToPaper(type, selected);
    setSelected([]);
  };

  return (
    <section className="preview-section">
      <h3>Preview Questions</h3>

      {isLoading ? (
        <div style={{ margin: "auto" }}>
          <Loader
            isLoading={isLoading}
            size="medium"
            showLabel={true}
            label="Progressing..."
            color="rgba(170, 59, 255, 0.968)"
          />
        </div>
      ) : questions?.length > 0 ? (
        <div className="preview-box">
          {questions.map((q, i) => (
            <div key={i} className="preview-item">
              <input
                type="checkbox"
                id={`q-${i}`}
                checked={selected.includes(q)}
                onChange={() => toggle(q)}
              />
              <label htmlFor={`q-${i}`}>{q}</label>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ margin: "auto" }}>
          <p>No questions available.</p>
        </div>
      )}

      <div className="preview-action">
        <button
          className="add-btn"
          disabled={questions?.length === 0}
          onClick={handleAdd}
        >
          Add
        </button>

        {questions?.length > 0 && (
          <button className="clear-btn" onClick={clearGenerated}>
            Clear
          </button>
        )}
      </div>
    </section>
  );
}