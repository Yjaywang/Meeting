import React from "react";

interface InputTemplateProps {
  value: string;
  onchangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  spanValue?: string;
  type: string;
  keyDownHandler?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  inputClassName?: string;
}

const InputTemplate: React.FC<InputTemplateProps> = ({
  value,
  onchangeHandler,
  spanValue,
  type,
  keyDownHandler,
  placeholder,
  inputClassName,
}) => {
  return (
    <div className="relative mb-2.5 flex justify-center">
      <label className="relative">
        <input
          value={value || ""}
          onChange={onchangeHandler}
          className={`peer border-2 border-solid h-6 text-[1.0625rem] leading-[147.6%] p-2.5 rounded-md transition-all duration-300 w-[220px] outline-none focus:border-primary hover:border-primary ${inputClassName || ""}`}
          type={type}
          onKeyDown={keyDownHandler}
          placeholder={placeholder}
          required
        />
        <span className="absolute top-2.5 left-2.5 text-base font-normal text-muted transition-[top] duration-300 peer-focus:top-0 peer-focus:text-xs peer-focus:mb-8 peer-valid:top-0 peer-valid:text-xs peer-valid:mb-8">
          {spanValue}
        </span>
      </label>
    </div>
  );
};

export default InputTemplate;
