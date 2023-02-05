import React from "react";

const InputTemplate = ({ value, handler, spanValue }) => {
  return (
    <div className="template-input-group">
      <label className="template-input-filled">
        <input
          value={value}
          onChange={handler}
          className="template-input"
          required
        />
        <span className="template-placeholder">{spanValue}</span>
      </label>
    </div>
  );
};

export default InputTemplate;
