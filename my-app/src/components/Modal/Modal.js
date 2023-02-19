import React from "react";
import "./Modal.css";

const Modal = ({ modalTitle, modalBody, btnHandler, btnText }) => {
  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="title-close-btn">
          <div className="modal-title">{modalTitle}</div>
          <button onClick={btnHandler}>X</button>
        </div>
        <div className="modal-body">
          <div>{modalBody}</div>
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
          <button onClick={btnHandler}>{btnText}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
