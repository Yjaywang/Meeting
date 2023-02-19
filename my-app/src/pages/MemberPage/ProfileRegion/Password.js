import React, { useState } from "react";
import ErrorMessages from "../../../components/ErrorMessages";
import PasswordInput from "./PasswordInput";
import * as validFormat from "../../../utils/validFormat";
import loadingImg from "../../../assets/images/sing-in-loading.png";
import { patchPassword } from "../../../utils/fetchUserApi";
import Modal from "../../../components/Modal/Modal";

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
    setOldPassword("");
    setNewPassword("");
    setCheckPassword("");
    //old password valid effect remove
    const pwOldInputContainerEl = document.querySelector(
      ".change-pw-old-input-container"
    );
    if (pwOldInputContainerEl) {
      const oldPwInputEl =
        pwOldInputContainerEl.querySelector(".template-input");
      oldPwInputEl.classList.remove("sign-in-up-format-success");
    }
    //new password valid effect remove
    const pwNewInputContainerEl = document.querySelector(
      ".change-pw-new-input-container"
    );
    if (pwNewInputContainerEl) {
      const newPwInputEl =
        pwNewInputContainerEl.querySelector(".template-input");
      newPwInputEl.classList.remove("sign-in-up-format-success");
    }
    //check password valid effect remove
    const pwCheckInputContainerEl = document.querySelector(
      ".change-pw-check-input-container"
    );
    if (pwCheckInputContainerEl) {
      const checkPwInputEl =
        pwCheckInputContainerEl.querySelector(".template-input");
      checkPwInputEl.classList.remove("sign-in-up-format-success");
    }
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
