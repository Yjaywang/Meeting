import React, { useState } from "react";
import Modal3 from "../../components/Modal3";
import { useHistory } from "react-router-dom";
import Modal from "../../components/Modal";

const PreviewPage = () => {
  const history = useHistory();
  const [openAccessModal, setOpenAccessModal] = useState(false);
  const [openRecordingModal, setOpenRecordingModal] = useState(false);
  function signInBtnHandler() {
    setOpenAccessModal(false);
    history.push("/signin");
  }
  function checkBtnHandler() {
    setOpenAccessModal(false);
  }
  function checkRecordingHandler() {
    setOpenRecordingModal(false);
  }
  return (
    <div>
      {openAccessModal && (
        <Modal3
          modalTitle="Message"
          modalBody="HHHHHHHHHHHHHHHHHHHHHHHHHHHHH"
          btnHandler={signInBtnHandler}
          btnText="Sign In"
          checkBtnHandler={checkBtnHandler}
          checkBtnText="OK"
        />
      )}
      {openRecordingModal && (
        <Modal
          modalTitle="Message"
          modalBody="Sign up success, will redirect to sign in page"
          btnHandler={checkRecordingHandler}
          btnText="OK"
        />
      )}
    </div>
  );
};

export default PreviewPage;
