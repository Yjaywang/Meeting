import React, { useState } from "react";
import CropImg from "./CropImg";
import loadingImg from "../../../assets/images/sing-in-loading.png";

interface Modal2Props {
  modalTitle: string;
  modalBody: string;
  btnText: string;
  preview: string | null;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  closeBtnHandler: () => void;
  uploadBtnHandler: () => void;
  loading: boolean;
}

const Modal2: React.FC<Modal2Props> = ({
  modalTitle,
  modalBody,
  btnText,
  preview,
  setPreview,
  closeBtnHandler,
  uploadBtnHandler,
  loading,
}) => {
  const [fileSizeErr, setFileSizeErr] = useState<string>("");
  return (
    <div className="w-full h-full bg-[rgba(200,200,200,0.3)] flex justify-center items-center absolute top-0 left-0 z-[9]">
      <div className="w-[360px] rounded-md bg-surface shadow-modal flex flex-col p-2.5 z-[9]">
        <div className="flex justify-between">
          <div className="font-bold h-[30px] leading-[30px] pl-1.5 text-lg">{modalTitle}</div>
          <button className="bg-danger border-none text-[25px] text-white cursor-pointer rounded-md transition-colors duration-300 hover:bg-danger-hover" onClick={closeBtnHandler}>X</button>
        </div>
        <div className="modal-body">
          <div className="p-[7px]">{modalBody}</div>
          <CropImg
            preview={preview}
            setPreview={setPreview}
            setFileSizeErr={setFileSizeErr}
          />
          {fileSizeErr && (
            <div className="text-center text-danger">{fileSizeErr}</div>
          )}
          <img className="w-[150px] object-cover" alt="" />
        </div>
        <div className="flex-[20%] flex justify-center items-center">
          <button className="relative w-[120px] h-[45px] m-2.5 border border-surface-secondary bg-primary text-white rounded-md text-base cursor-pointer transition-colors duration-300 font-bold hover:bg-primary-hover" onClick={uploadBtnHandler}>
            {btnText}
            {loading && (
              <img src={loadingImg} className="w-[15px] absolute top-3.5 left-2.5" alt="" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal2;
