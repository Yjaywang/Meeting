import React, { useState } from "react";
import ErrorMessages from "../../../components/ErrorMessages";
import PasswordInput from "./PasswordInput";
import * as validFormat from "../../../utils/validFormat";
import loadingImg from "../../../assets/images/sing-in-loading.png";
import { patchPassword } from "../../../utils/fetchUserApi";
import AlertModal from "../../../components/Modal/AlertModal";

const Password: React.FC = () => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [checkPassword, setCheckPassword] = useState<string>("");
  const [changeErr, setChangeErr] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const isFormValid =
    validFormat.validatePassword(oldPassword) &&
    validFormat.validatePassword(newPassword) &&
    validFormat.validatePassword(checkPassword) &&
    validFormat.validateCheckPw(newPassword, checkPassword);

  async function changePwHandler() {
    if (!isFormValid) { return; }
    setLoading(true);
    try {
      const response = await patchPassword({
        password: oldPassword,
        newPassword: newPassword,
        confirmPassword: checkPassword,
      });

      if (response.ok) { setOpenModal(true); }
      if (response.error) { setChangeErr(response.message); }
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
  }

  return (
    <div className="flex justify-between max-[500px]:flex-col">
      <div className="flex justify-start flex-col">
        <PasswordInput
          oldPassword={oldPassword}
          setOldPassword={setOldPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          checkPassword={checkPassword}
          setCheckPassword={setCheckPassword}
        />
        <div className="w-[244px]">
          <ErrorMessages errMsg={changeErr} />
        </div>
      </div>
      <div
        className={`w-[100px] font-bold text-center h-[30px] rounded-md leading-[30px] cursor-pointer flex justify-center relative transition-colors duration-300 ${
          isFormValid
            ? "bg-primary text-white hover:bg-primary-hover"
            : "bg-muted text-black cursor-not-allowed"
        }`}
        onClick={changePwHandler}
      >
        EDIT
        {loading && <img src={loadingImg} className="w-[15px] absolute top-[9px] left-[9px]" alt="" />}
      </div>
      {openModal && (
        <AlertModal
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
