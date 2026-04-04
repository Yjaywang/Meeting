import React, { useState } from "react";
import RecordStartImg from "../../../../assets/images/record_start.svg";
import RecordStopImg from "../../../../assets/images/record_stop.svg";
import { setIsRecording } from "../../../../store/actions";
import { toggleScreenRecording } from "../../../../utils/webRTCApi";
import { sendRecordingStatus } from "../../../../utils/webSocketApi";
import RecordRTC from "recordrtc";
import Modal3 from "../../../../components/Modal/Modal3";
import Modal from "../../../../components/Modal/Modal";
import loadingImg from "../../../../assets/images/sing-in-loading.png";
import { useNavigate } from "react-router-dom";
import { ApiErrorResponse } from "../../../../types/api";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";

interface RecordBtnProps {
  screenStream: MediaStream | null;
  streamRecorder: RecordRTC | null;
  setStreamRecorder: (recorder: RecordRTC | null) => void;
}

const RecordBtn: React.FC<RecordBtnProps> = (props) => {
  const { screenStream, streamRecorder, setStreamRecorder } = props;
  const dispatch = useAppDispatch();
  const isSignIn = useAppSelector((state) => state.user.isSignIn);
  const isRecording = useAppSelector((state) => state.media.isRecording);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openAccessModal, setOpenAccessModal] = useState(false);
  const [openRecordingModal, setOpenRecordingModal] = useState(false);
  const [recordingResponse, setRecordingResponse] = useState("");

  const handler = async () => {
    if (isSignIn) {
      if (!isRecording) {
        const recorder = new RecordRTC(screenStream as MediaStream, {
          type: "video",
          mimeType: "video/webm;codecs=vp8",
        });
        sendRecordingStatus(!isRecording);
        toggleScreenRecording(!isRecording, recorder);
        dispatch(setIsRecording(!isRecording));
        setStreamRecorder(recorder);
      } else {
        setLoading(true);
        sendRecordingStatus(!isRecording);
        try {
          const response = await toggleScreenRecording(
            !isRecording,
            streamRecorder
          );

          const errorResponse = response as ApiErrorResponse | undefined;
          if (errorResponse?.error) {
            setRecordingResponse(errorResponse.message);
          }
        } catch (error) {
          console.log("error: ", error);
        } finally {
          setLoading(false);
          setOpenRecordingModal(true);
          dispatch(setIsRecording(!isRecording));
          setStreamRecorder(null);
        }
      }
    } else {
      setOpenAccessModal(true);
    }
  };

  function signInBtnHandler() {
    setOpenAccessModal(false);
    navigate("/signIn");
  }
  function checkBtnHandler() {
    setOpenAccessModal(false);
  }
  function checkRecordingHandler() {
    setOpenRecordingModal(false);
  }

  return (
    <div className="text-center cursor-pointer rounded-lg transition-colors duration-300 h-[70px] w-[110px] flex items-center hover:bg-surface-dark max-[870px]:w-[50px] max-[870px]:justify-center max-[450px]:w-[35px]">
      <div className="relative" onClick={handler}>
        <img
          className="h-[25px] object-cover"
          src={isRecording ? RecordStopImg : RecordStartImg}
          alt=""
        />
        <div className="text-muted text-sm w-[110px] max-[870px]:text-xs max-[870px]:w-[50px] max-[450px]:text-[8px] max-[450px]:w-[35px]">
          {isRecording ? "Stop record" : "Start record"}
        </div>
        {loading && (
          <img src={loadingImg} className="absolute top-0 right-[15px] w-[15px] h-[15px]" alt="" />
        )}
      </div>
      {openAccessModal && (
        <Modal3
          modalTitle="Request For SignIn"
          modalBody="You're currently no access for this function, leave for signIn then enjoy it."
          btnHandler={signInBtnHandler}
          btnText="Sign In"
          checkBtnHandler={checkBtnHandler}
          checkBtnText="Not now"
        />
      )}
      {openRecordingModal && (
        <Modal
          modalTitle="Message"
          modalBody={recordingResponse || "Recording upload success"}
          btnHandler={checkRecordingHandler}
          btnText="OK"
        />
      )}
    </div>
  );
};

export default RecordBtn;
