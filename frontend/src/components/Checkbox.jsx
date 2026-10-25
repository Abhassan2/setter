import React from "react";

function Checkbox({ array, selecting, setSelecting }) {
  const handleCheckbox = (e, question) => {
    const { checked } = e.target;

    setSelecting((prev) => {
      let oldQuestions = [ ...prev ];

      if (checked) {
        oldQuestions = oldQuestions.includes(question)
          ? oldQuestions
          : [...oldQuestions, question];
      } else {
        oldQuestions = oldQuestions.filter((item) => item !== question);
      }

      return oldQuestions;
    });
  };

  return (
    <>
      {array.map((q, index) => (
        <div key={index}>
          <input
            type="checkbox"
            id={index}
            checked={selecting.includes(q)}
            onChange={(e) => handleCheckbox(e, q)}
          />
          <label className="lable" htmlFor={index}>
            {q}
          </label>
        </div>
      ))}
    </>
  );
}

export default React.memo(Checkbox);
