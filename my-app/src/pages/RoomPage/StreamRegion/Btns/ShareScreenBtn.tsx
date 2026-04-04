import React, { useState } from "react";
import ShareScreenImg from "../../../../assets/images/share_screen.svg";
import { useSocket } from "../../../../contexts/SocketContext";
import { useWebRTC } from "../../../../contexts/WebRTCContext";
import { setIsRecording, setIsShare } from "../../../../store/slices/mediaSlice";
import AlertModal from "../../../../components/Modal/AlertModal";
import RecordRTC from "recordrtc";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectIsShare, selectIsOtherShare, selectSelfSocketId, selectIsCamOff, selectRoomId } from "../../../../store/selectors";

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
  const { sendShareStatus, sendRecordingStatus } = useSocket();
  const { toggleScreenSharing, toggleScreenRecording } = useWebRTC();
  const isShare = useAppSelector(selectIsShare);
  const isOtherShare = useAppSelector(selectIsOtherShare);
  const selfSocketId = useAppSelector(selectSelfSocketId);
  const isCamOff = useAppSelector(selectIsCamOff);
  const roomId = useAppSelector(selectRoomId);
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
          sendShareStatus(!isShare, selfSocketId, isCamOff, roomId);
          dispatch(setIsShare(true));

          //if user click browser's "stop sharing"
          //this kind of end sharing, close recorder at record btn, because the recorder state still null here
          stream.getVideoTracks()[0].onended = async function (e: Event) {
            toggleScreenSharing(false);
            sendShareStatus(false, selfSocketId, isCamOff, roomId);
            sendRecordingStatus(false, selfSocketId, roomId);
            toggleScreenRecording(false, undefined, roomId, selfSocketId);
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
        sendShareStatus(!isShare, selfSocketId, isCamOff, roomId);
        sendRecordingStatus(false, selfSocketId, roomId);
        toggleScreenRecording(false, streamRecorder, roomId, selfSocketId);
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
        <AlertModal
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
