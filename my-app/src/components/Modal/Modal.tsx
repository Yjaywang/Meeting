import React from "react";

interface ModalProps {
  modalTitle: string;
  modalBody: string;
  btnHandler: () => void;
  btnText: string;
}

const Modal: React.FC<ModalProps> = ({ modalTitle, modalBody, btnHandler, btnText }) => {
  return (
    <div className="w-full h-full bg-[rgba(200,200,200,0.3)] flex justify-center items-center absolute top-0 left-0 z-[9]">
      <div className="w-[360px] rounded-md bg-surface shadow-modal flex flex-col p-2.5 z-[20]">
        <div className="flex justify-between">
          <div className="font-bold h-[30px] leading-[30px] pl-1.5 text-lg">{modalTitle}</div>
          <button className="bg-danger border-none text-[25px] text-white cursor-pointer rounded-md transition-colors duration-300 hover:bg-danger-hover" onClick={btnHandler}>X</button>
        </div>
        <div className="flex-[50%] flex justify-center items-center text-center my-5 px-1.5">
          <div>{modalBody}</div>
        </div>
        <div className="flex-[20%] flex justify-center items-center">
          <button className="w-[100px] h-[45px] m-2.5 border border-surface-secondary bg-surface-secondary rounded-md text-base cursor-pointer transition-colors duration-300 font-bold hover:bg-gray-300" onClick={btnHandler}>{btnText}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
