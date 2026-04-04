import React, { useRef, useEffect } from "react";
import type { PeerState } from "../../../store/slices/peersSlice";
import { getStream } from "../../../utils/streamStore";
import MicOnImg from "../../../assets/images/mic_open.svg";
import MicOffImg from "../../../assets/images/mic_close.svg";
import PeopleImg from "../../../assets/images/people.svg";
import soundEffect from "../../../assets/sounds/crrect_answer2.mp3";

interface VideoTileProps {
  peer: PeerState;
  width: number;
  height: number;
  isSharer?: boolean;
}

const VideoTile: React.FC<VideoTileProps> = ({ peer, width, height, isSharer }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevEmotionRef = useRef(peer.emotion);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Bind MediaStream to <video>
  useEffect(() => {
    const video = videoRef.current;
    const stream = getStream(peer.socketId);
    if (video && stream) {
      video.srcObject = stream;
    }
  }, [peer.socketId]);

  // Play sound on new emotion
  useEffect(() => {
    if (peer.emotion && peer.emotion !== prevEmotionRef.current) {
      if (!audioRef.current) audioRef.current = new Audio(soundEffect);
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    prevEmotionRef.current = peer.emotion;
  }, [peer.emotion]);

  const isSpeaking = peer.micVolume.result === "speaking";
  const volHeight = isSpeaking
    ? Math.min(Math.abs(((peer.micVolume.avgAudioLevel - 128) / 30) * 100), 100)
    : 0;

  return (
    <div
      className={`relative bg-gray-600 border-[5px] box-border rounded-lg overflow-hidden shrink-0 ${
        isSpeaking ? "border-success" : "border-gray-600"
      } ${isSharer ? "absolute top-[195px]" : ""}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Status bar: recording */}
      <div className="flex absolute z-[1]">
        {peer.isRecording && (
          <div className="flex items-center gap-[5px] rounded-lg bg-[rgba(26,26,26,0.5)] text-muted pl-[2px] pr-[5px]">
            <div className="w-2.5 h-2.5 rounded-full bg-danger animate-blink" />
            <div>REC</div>
          </div>
        )}
      </div>

      {/* Emotion */}
      {peer.emotion && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[80px] z-[2] pointer-events-none">
          {peer.emotion}
        </div>
      )}

      {/* Avatar overlay when cam is off */}
      {peer.isCamOff && !isSharer && (
        <div className="absolute inset-0 flex items-center justify-center z-[1]">
          <img
            className="h-[80px] w-[80px] object-cover rounded-full"
            src={peer.avatar || PeopleImg}
            alt=""
          />
        </div>
      )}

      {/* Video element */}
      <video
        className="w-full h-full"
        ref={videoRef}
        autoPlay
        muted
      />

      {/* Bottom bar: mic icon + volume + name */}
      <div className="absolute bottom-0 left-0 right-0 z-[1]">
        <div className="flex items-center gap-2.5 bg-[rgba(26,26,26,0.5)] rounded-lg text-muted pl-[2px] pr-[5px]">
          <img
            className="h-4 object-cover"
            src={peer.isMuted ? MicOffImg : MicOnImg}
            alt=""
          />
          <div className="w-1 h-[20px] bg-[rgba(255,255,255,0.3)] rounded-sm overflow-hidden flex items-end">
            <div
              className="w-full bg-success rounded-sm transition-[height] duration-200"
              style={{ height: `${volHeight}%` }}
            />
          </div>
          <div className="flex items-center">
            <span>{peer.username}</span>
            {peer.isHost && <span className="ml-[5px]">(Host)</span>}
            {peer.isShare && <span className="ml-[5px]">(sharing)</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTile;
