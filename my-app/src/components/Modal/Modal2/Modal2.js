import React, { useState } from "react";
import "../Modal.css";
import CropImg from "./CropImg";
import loadingImg from "../../../assets/images/sing-in-loading.png";

const Modal2 = ({
  modalTitle,
  modalBody,
  btnText,
  preview,
  setPreview,
  closeBtnHandler,
  uploadBtnHandler,
  loading,
}) => {
  const [fileSizeErr, setFileSizeErr] = useState("");
  return (
    <div className="modal-background">
      <div className="modal2-container">
        <div className="title-close-btn">
          <div className="modal-title">{modalTitle}</div>
          <button onClick={closeBtnHandler}>X</button>
        </div>
        <div className="modal-body">
          <div className="modal2-body-text">{modalBody}</div>
          <CropImg
            preview={preview}
            setPreview={setPreview}
            setFileSizeErr={setFileSizeErr}
          />
          {fileSizeErr && (
            <div className="modal2-error-message">{fileSizeErr}</div>
          )}
          <img className="crop-img" alt="" />
        </div>
        <div className="modal-footer">
          {/* <button
        onClick={() => {
          setOpenModal(false);
        }}
        id="modal-cancel-btn"
      >
        Cancel
      </button> */}
          <button onClick={uploadBtnHandler}>
            {btnText}
            {loading && (
              <img src={loadingImg} className="change-avatar-loading" alt="" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal2;
