import React, { useState } from "react";
import ErrorMessages from "../../../components/ErrorMessages";
import PasswordInput from "./PasswordInput";
import * as validFormat from "../../../utils/validFormat";
import loadingImg from "../../../assets/images/sing-in-loading.png";
import { patchPassword } from "../../../utils/fetchUserApi";
import Modal from "../../../components/Modal";

const Password = (props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [changeErr, setChangeErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  async function changePwHandler() {
    if (
      !validFormat.validatePassword(oldPassword) ||
      !validFormat.validatePassword(newPassword) ||
      !validFormat.validatePassword(checkPassword)
    ) {
      return;
    }
    setLoading(true);
    try {
      const response = await patchPassword({
        password: oldPassword,
        newPassword: newPassword,
        confirmPassword: checkPassword,
      });

      if (response.ok) {
        setOpenModal(true);
      }
      if (response.error) {
        setChangeErr(response.message);
      }
    } catch (error) {
      console.log("error: ", error);
    }
    setLoading(false);
  }

  function closeModal() {
    setOpenModal(false);
    window.location.reload();
  }
  return (
    <div className="change-pw-container">
      <div className="change-pw-region-I">
        <PasswordInput
          oldPassword={oldPassword}
          setOldPassword={setOldPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          checkPassword={checkPassword}
          setCheckPassword={setCheckPassword}
        />
        <div className="change-pw-error-message">
          <ErrorMessages errMsg={changeErr} />
        </div>
      </div>
      <div
        className="change-pw-region-II change-pw-btn"
        onClick={changePwHandler}
      >
        EDIT
        {loading && <img src={loadingImg} className="change-loading" alt="" />}
      </div>
      {openModal && (
        <Modal
          modalTitle="Message"
          modalBody="Change password success!"
          btnHandler={closeModal}
          btnText="OK"
        />
      )}
    </div>
  );
};

export default Password;
