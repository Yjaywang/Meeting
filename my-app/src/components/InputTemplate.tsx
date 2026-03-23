import React from "react";

interface InputTemplateProps {
  value: string;
  onchangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  spanValue?: string;
  type: string;
  keyDownHandler?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputTemplate: React.FC<InputTemplateProps> = ({
  value,
  onchangeHandler,
  spanValue,
  type,
  keyDownHandler,
  placeholder,
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
          placeholder={placeholder}
          required
        />
        <span className="template-placeholder">{spanValue}</span>
      </label>
    </div>
  );
};

export default InputTemplate;
