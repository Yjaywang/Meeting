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
import { setIsRecording, setIsShare } from "../../../../store/actions";
import Modal from "../../../../components/Modal/Modal";
import RecordRTC from "recordrtc";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";

interface ShareScreenBtnProps {
  screenStream: MediaStream | null;
  setScreenStream: (stream: MediaStream | null) => void;
  streamRecorder: RecordRTC | null;
  setStreamRecorder: (recorder: RecordRTC | null) => void;
}

const constrains: MediaStreamConstraints = {
  audio: false,
  video: true,
};
const ShareScreenBtn: React.FC<ShareScreenBtnProps> = (props) => {
  const {
    screenStream,
    setScreenStream,
    streamRecorder,
    setStreamRecorder,
  } = props;
  const dispatch = useAppDispatch();
  const isShare = useAppSelector((state) => state.media.isShare);
  const isOtherShare = useAppSelector((state) => state.media.isOtherShare);
  const [openOtherSharingModal, setOpenOtherSharingModal] = useState(false);

  const handler = async () => {
    if (isOtherShare) {
      //other is sharing, your sharing request will be stop
      setOpenOtherSharingModal(true);
    } else {
      //other not sharing and you want to share
      if (!isShare) {
        let stream: MediaStream | null = null;
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
          dispatch(setIsShare(true));

          //if user click browser's "stop sharing"
          //this kind of end sharing, close recorder at record btn, because the recorder state still null here
          stream.getVideoTracks()[0].onended = async function (e: Event) {
            toggleScreenSharing(false);
            sendShareStatus(false);
            sendRecordingStatus(false);
            toggleScreenRecording(false);
            dispatch(setIsShare(false));
            dispatch(setIsRecording(false));
            setScreenStream(null);
            setStreamRecorder(null);
          };
        }
      } else {
        // if user click screen share again when sharing, close share stream
        //switch back to video cam
        toggleScreenSharing(!isShare);
        sendShareStatus(!isShare);
        sendRecordingStatus(false);
        toggleScreenRecording(false, streamRecorder);
        dispatch(setIsShare(false));
        dispatch(setIsRecording(false));
        setStreamRecorder(null);

        //stop sharing screen
        screenStream!.getTracks().forEach((track) => {
          track.stop();
        });
        setScreenStream(null);
      }
    }
  };

  function closeSharingRequest() {
    setOpenOtherSharingModal(false);
  }

  return (
    <>
      <div
        className={`text-center cursor-pointer rounded-lg transition-colors duration-300 h-[70px] w-[110px] flex items-center hover:bg-surface-dark max-[870px]:w-[50px] max-[870px]:justify-center max-[450px]:w-[35px] ${isShare ? "bg-gray-600" : ""}`}
        onClick={handler}
      >
        <div>
          <img
            className="h-[25px] object-cover"
            src={ShareScreenImg}
            alt=""
          />
          <div className="text-muted text-sm w-[110px] max-[870px]:text-xs max-[870px]:w-[50px] max-[450px]:text-[8px] max-[450px]:w-[35px] text-success">
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

export default ShareScreenBtn;
