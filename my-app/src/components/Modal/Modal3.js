import React from "react";
import "./Modal.css";

const Modal3 = ({
  modalTitle,
  modalBody,
  btnHandler,
  btnText,
  checkBtnHandler,
  checkBtnText,
}) => {
  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="title-close-btn">
          <div className="modal-title">{modalTitle}</div>
          <button onClick={checkBtnHandler}>X</button>
        </div>
        <div className="modal-body">
          <div>{modalBody}</div>
        </div>
        <div className="modal-footer">
          <button onClick={checkBtnHandler} id="modal-second-btn">
            {checkBtnText}
          </button>
          <button onClick={btnHandler}>{btnText}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal3;
