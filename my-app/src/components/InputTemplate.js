import React from "react";

const InputTemplate = ({
  value,
  onchangeHandler,
  spanValue,
  type,
  keyDownHandler,
}) => {
  return (
    <div className="template-input-group">
      <label className="template-input-filled">
        <input
          value={value || ""}
          onChange={onchangeHandler}
          className="template-input"
          type={type}
          onKeyDown={keyDownHandler}
          required
        />
        <span className="template-placeholder">{spanValue}</span>
      </label>
    </div>
  );
};

export default InputTemplate;
