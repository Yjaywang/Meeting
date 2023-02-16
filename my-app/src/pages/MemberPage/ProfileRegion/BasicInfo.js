import React, { useState, useEffect } from "react";
import peopleImg from "../../../assets/images/people.svg";
import editImg from "../../../assets/images/edit.svg";
import ErrorMessages from "../../../components/ErrorMessages";
import { connect } from "react-redux";
import { setUsername } from "../../../store/actions";
import UsernameInput from "./UsernameInput";
import Modal from "../../../components/Modal";
import Modal2 from "../../../components/Modal2/Modal2";
import { patchUsername } from "../../../utils/fetchUserApi";
import * as validFormat from "../../../utils/validFormat";
import loadingImg from "../../../assets/images/sing-in-loading.png";

const BasicInfo = (props) => {
  const { username, email, avatar, setUsernameAction } = props;
  const [newUsername, setNewUsername] = useState("");
  const [changeNameErr, setChangeNameErr] = useState("");
  const [openUsernameModal, setOpenUsernameModal] = useState(false);
  const [openCropModal, setOpenCropModal] = useState(false);
  const [openAvatarModal, setOpenAvatarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  function closeUsernameModal() {
    setOpenUsernameModal(false);
    window.location.reload();
  }

  function closeAvatarModal() {
    setOpenAvatarModal(false);
    window.location.reload();
  }

  function closeCropModal() {
    setOpenCropModal(false);
  }

  async function uploadAvatar() {
    setOpenCropModal(false);
  }

  async function changeNameHandler() {
    if (!validFormat.validateUsername(newUsername)) {
      return;
    }

    setLoading(true);
    try {
      const response = await patchUsername({
        username: newUsername,
      });
      if (response.ok) {
        setUsernameAction(newUsername);
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

  useEffect(() => {
    setLoading(true);
  }, []);
  function changeAvatarPanel() {}
  return (
    <div className="basic-info-container">
      <div className="basic-info-region-I">
        {avatar ? (
          <img className="basic-info-avatar" src={avatar} alt="" />
        ) : (
          <img className="basic-info-avatar" src={peopleImg} alt="" />
        )}
        <div className="basic-info-edit-container" onClick={changeAvatarPanel}>
          <img className="basic-info-edit" src={editImg} alt="" />
        </div>
      </div>
      <div className="basic-info-region-II">
        <div className="basic-info-title">
          username
          <div className="basic-info-username">{username}</div>
          <UsernameInput
            newUsername={newUsername}
            setNewUsername={setNewUsername}
          />
        </div>
        <div className="basic-info-title">
          email
          <div className="basic-info-email">{email}</div>
        </div>
        <div className="basic-info-error">
          <ErrorMessages errMsg={changeNameErr} />
        </div>
      </div>
      <div
        className="basic-info-region-III basic-info-username-edit-btn"
        onClick={changeNameHandler}
      >
        EDIT
        {loading && <img src={loadingImg} className="change-loading" alt="" />}
      </div>
      {openUsernameModal && (
        <Modal
          modalTitle="Message"
          modalBody="Change username success!"
          btnHandler={closeUsernameModal}
          btnText="OK"
        />
      )}
      {openAvatarModal && (
        <Modal
          modalTitle="Message"
          modalBody="Change avatar success!"
          btnHandler={closeAvatarModal}
          btnText="OK"
        />
      )}
      <Modal2
        modalTitle="Change Avatar"
        modalBody="only allowed .jpg/png file and less than 2MB"
        uploadBtnHandler={uploadAvatar}
        closeBtnHandler={closeCropModal}
        btnText="Upload"
        preview={preview}
        setPreview={setPreview}
        loading={loading}
      />
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUsernameAction: (username) => dispatch(setUsername(username)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(BasicInfo);
