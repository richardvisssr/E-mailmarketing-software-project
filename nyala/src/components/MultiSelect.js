// MultiSelect.js
import React from "react";

function MultiSelect({ options, selectedOptions, onChange }) {
  return (
    <>
      {options.map((option, index) => (
        <div key={index} className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id={`subscription${index}`}
            value={option}
            checked={selectedOptions.includes(option)}
            onChange={onChange}
          />
          <label className="form-check-label" htmlFor={`subscription${index}`}>
            {option}
          </label>
        </div>
      ))}
    </>
  );
}

export default MultiSelect;
