import React, { useState } from "react";
import peopleImg from "../../../assets/images/people.svg";
import editImg from "../../../assets/images/edit.svg";
import ErrorMessages from "../../../components/ErrorMessages";
import { setAvatar, setDefaultUsername } from "../../../store/actions";
import UsernameInput from "./UsernameInput";
import Modal from "../../../components/Modal/Modal";
import Modal2 from "../../../components/Modal/Modal2/Modal2";
import { patchAvatar, patchUsername } from "../../../utils/fetchUserApi";
import * as validFormat from "../../../utils/validFormat";
import loadingImg from "../../../assets/images/sing-in-loading.png";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

const BasicInfo: React.FC = () => {
  const dispatch = useAppDispatch();
  const defaultUsername = useAppSelector((state) => state.user.defaultUsername);
  const email = useAppSelector((state) => state.user.email);
  const avatar = useAppSelector((state) => state.user.avatar);
  const [newUsername, setNewUsername] = useState<string>("");
  const [changeNameErr, setChangeNameErr] = useState<string>("");
  const [changeAvatarErr, setChangeAvatarErr] = useState<string>("");
  const [openUsernameModal, setOpenUsernameModal] = useState<boolean>(false);
  const [openCropModal, setOpenCropModal] = useState<boolean>(false);
  const [openAvatarModal, setOpenAvatarModal] = useState<boolean>(false);
  const [openAvatarErrorModal, setOpenAvatarErrorModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [avatarLoading, setAvatarLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);

  function closeUsernameModal() {
    setOpenUsernameModal(false);
    setNewUsername("");
  }

  function closeAvatarModal() { setOpenAvatarModal(false); }
  function closeAvatarErrorModal() { setOpenAvatarErrorModal(false); }
  function closeCropModal() { setOpenCropModal(false); }
  function changeAvatarPanel() { setOpenCropModal(true); }

  async function uploadAvatar() {
    if (!preview) {
      setOpenCropModal(false);
      setOpenAvatarErrorModal(true);
      setChangeAvatarErr("file empty! please upload image and crop it.");
      return;
    }

    setAvatarLoading(true);
    const tempData = preview.split(";");
    const contentType = tempData[0].split(":")[1];
    const imageData = tempData[1].split(",")[1];
    const inputData = { contentType: contentType, imageData: imageData };

    try {
      const response = await patchAvatar(inputData);
      if (response.ok) {
        const avatarUrl = response.data.Url;
        dispatch(setAvatar(avatarUrl));
        setPreview(null);
        setOpenCropModal(false);
        setOpenAvatarModal(true);
      }
      if (response.error) {
        setOpenCropModal(false);
        setOpenAvatarErrorModal(true);
        setChangeAvatarErr(response.message);
      }
    } catch (error) {
      console.log("error: ", error);
    }

    setAvatarLoading(false);
  }

  const isUsernameValid = validFormat.validateUsername(newUsername);

  async function changeNameHandler() {
    if (!isUsernameValid) { return; }

    setLoading(true);
    try {
      const response = await patchUsername({ username: newUsername });
      if (response.ok) {
        dispatch(setDefaultUsername(newUsername));
        setOpenUsernameModal(true);
      }
      if (response.error) {
        setChangeNameErr(response.message);
      }
    } catch (error) {
      console.log("error: ", error);
    }
    setLoading(false);
  }

  return (
    <div className="flex justify-between w-full gap-[50px] max-[1000px]:flex-col max-[1000px]:gap-5">
      <div className="group relative w-[200px] h-[200px]">
        <img className="w-full object-cover rounded-full h-full transition-all duration-300" src={avatar || peopleImg} alt="" />
        <div
          className="rounded-b-full w-[200px] h-[100px] bg-[rgba(17,17,17,0.3)] text-center flex flex-col justify-center items-center absolute bottom-0 opacity-0 cursor-pointer transition-opacity duration-300 ease-in-out group-hover:opacity-100 hover:opacity-100"
          onClick={changeAvatarPanel}
        >
          <img className="w-[30px] object-cover rounded-md cursor-pointer" src={editImg} alt="" />
        </div>
      </div>
      <div className="flex flex-auto justify-between max-[500px]:flex-col">
        <div>
          <div className="text-2xl font-bold mb-5">
            username
            <div className="text-sm font-normal text-muted mb-[5px]">{defaultUsername}</div>
            <UsernameInput newUsername={newUsername} setNewUsername={setNewUsername} />
          </div>
          <div className="text-2xl font-bold mb-5">
            email
            <div className="text-sm font-normal text-muted mb-[5px]">{email}</div>
          </div>
          <div className="w-[244px]">
            <ErrorMessages errMsg={changeNameErr} />
          </div>
        </div>
        <div
          className={`w-[100px] font-bold text-center h-[30px] rounded-md leading-[30px] cursor-pointer flex justify-center relative transition-colors duration-300 ${
            isUsernameValid
              ? "bg-primary text-white hover:bg-primary-hover"
              : "bg-muted text-black cursor-not-allowed"
          }`}
          onClick={changeNameHandler}
        >
          EDIT
          {loading && <img src={loadingImg} className="w-[15px] absolute top-[9px] left-[9px]" alt="" />}
        </div>
      </div>

      {openUsernameModal && (
        <Modal modalTitle="Message" modalBody="Change username success!" btnHandler={closeUsernameModal} btnText="OK" />
      )}
      {openAvatarModal && (
        <Modal modalTitle="Message" modalBody="Change avatar success!" btnHandler={closeAvatarModal} btnText="OK" />
      )}
      {openCropModal && (
        <Modal2 modalTitle="Change Avatar" modalBody="only allowed .jpg/png file and less than 1MB" uploadBtnHandler={uploadAvatar} closeBtnHandler={closeCropModal} btnText="Upload" preview={preview} setPreview={setPreview} loading={avatarLoading} />
      )}
      {openAvatarErrorModal && (
        <Modal modalTitle="Error Message" modalBody={changeAvatarErr} btnHandler={closeAvatarErrorModal} btnText="OK" />
      )}
    </div>
  );
};

export default BasicInfo;
