import React, { useState } from "react";
import peopleImg from "../../../assets/images/people.svg";
import editImg from "../../../assets/images/edit.svg";
import ErrorMessages from "../../../components/ErrorMessages";
import { connect } from "react-redux";
import { setUsername } from "../../../store/actions";
import UsernameInput from "./UsernameInput";
import Modal from "../../../components/Modal";
import { patchUsername } from "../../../utils/fetchUserApi";
import * as validFormat from "../../../utils/validFormat";
import loadingImg from "../../../assets/images/sing-in-loading.png";

const BasicInfo = (props) => {
  const { username, email, avatar, setUsernameAction } = props;
  const [newUsername, setNewUsername] = useState("");
  const [changeNameErr, setChangeNameErr] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  function closeModal() {
    setOpenModal(false);
    window.location.reload();
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
        setOpenModal(true);
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
    <div className="basic-info-container">
      <div className="basic-info-region-I">
        {avatar ? (
          <img className="basic-info-avatar" src={avatar} alt="" />
        ) : (
          <img className="basic-info-avatar" src={peopleImg} alt="" />
        )}
        <div className="basic-info-edit-container">
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
      {openModal && (
        <Modal
          modalTitle="Message"
          modalBody="Change username success!"
          btnHandler={closeModal}
          btnText="OK"
        />
      )}
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
