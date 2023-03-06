import React, { useState } from "react";
import ShareScreenImg from "../../../../assets/images/share_screen.svg";
import {
  sendShareStatus,
  sendRecordingStatus,
} from "../../../../utils/webSocketApi";
import {
  toggleScreenSharing,
  toggleScreenRecording,
} from "../../../../utils/webRTCApi";
import { connect } from "react-redux";
import { setIsRecording, setIsShare } from "../../../../store/actions";
import Modal from "../../../../components/Modal/Modal";

const constrains = {
  audio: false,
  video: true,
};
const ShareScreenBtn = (props) => {
  const {
    isShare,
    isOtherShare,
    setIsShareAction,
    screenStream,
    setScreenStream,
    setIsRecordingAction,
    streamRecorder,
    setStreamRecorder,
  } = props;
  const [openOtherSharingModal, setOpenOtherSharingModal] = useState(false);

  const handler = async () => {
    if (isOtherShare) {
      //other is sharing, your sharing request will be stop
      setOpenOtherSharingModal(true);
    } else {
      //other not sharing and you want to share
      if (!isShare) {
        let stream = null;
        try {
          stream = await navigator.mediaDevices.getDisplayMedia(constrains);
        } catch (error) {
          console.log("share screen error: ", error);
        }
        if (stream) {
          //share screen
          //screenStream will update after render
          setScreenStream(stream);
          toggleScreenSharing(!isShare, stream);
          sendShareStatus(!isShare);
          setIsShareAction(true);
          const attendeeContainerEl = document.querySelector(
            ".share-screen-btn-img"
          ).parentNode.parentNode;
          attendeeContainerEl.classList.toggle("function-btn-selected");

          //if user click browser's "stop sharing"
          //this kind of end sharing, close recorder at record btn, because the recorder state still null here
          stream.getVideoTracks()[0].onended = async function (e) {
            toggleScreenSharing(false);
            sendShareStatus(false);
            sendRecordingStatus(false);
            toggleScreenRecording(false);
            setIsShareAction(false);
            setIsRecordingAction(false);
            setScreenStream(null);
            setStreamRecorder(null);

            const attendeeContainerEl = document.querySelector(
              ".share-screen-btn-img"
            ).parentNode.parentNode;
            attendeeContainerEl.classList.toggle("function-btn-selected");
          };
        }
      } else {
        // if user click screen share again when sharing, close share stream
        //switch back to video cam
        toggleScreenSharing(!isShare);
        sendShareStatus(!isShare);
        sendRecordingStatus(false);
        toggleScreenRecording(false, streamRecorder);
        setIsShareAction(false);
        setIsRecordingAction(false);
        setStreamRecorder(null);

        //stop sharing screen
        screenStream.getTracks().forEach((track) => {
          track.stop();
        });
        setScreenStream(null);

        const attendeeContainerEl = document.querySelector(
          ".share-screen-btn-img"
        ).parentNode.parentNode;
        attendeeContainerEl.classList.toggle("function-btn-selected");
      }

      // setIsShareAction(!isShare);
    }
  };

  function closeSharingRequest() {
    setOpenOtherSharingModal(false);
  }

  return (
    <>
      <div className="function-btn-container" onClick={handler}>
        <div>
          <img
            className="share-screen-btn-img function-btn-img"
            src={ShareScreenImg}
            alt=""
          />
          <div className="function-btn-name share-btn-name">
            {isShare ? "Stop share" : "Start share"}
          </div>
        </div>
      </div>
      {openOtherSharingModal && (
        <Modal
          modalTitle="Message"
          modalBody="others sharing! your sharing request will be cancelled."
          btnHandler={closeSharingRequest}
          btnText="OK"
        />
      )}
    </>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setIsShareAction: (isShare) => dispatch(setIsShare(isShare)),
    setIsRecordingAction: (isRecording) =>
      dispatch(setIsRecording(isRecording)),
  };
};

export default connect(
  mapStoreStateToProps,
  mapDispatchToProps
)(ShareScreenBtn);
