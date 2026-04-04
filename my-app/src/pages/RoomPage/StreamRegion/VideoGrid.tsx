import React from "react";
import VideoTile from "./VideoTile";
import { useAppSelector } from "../../../store/hooks";
import { selectAllPeers } from "../../../store/selectors";
import { selectIsOtherShare, selectIsShare } from "../../../store/selectors";

interface VideoGridProps {
  width: number;
  height: number;
  isSidebarOpen: boolean;
}

function getGridLayout(count: number): { widthRatio: number; heightRatio: number } {
  if (count <= 1) return { widthRatio: 0.95, heightRatio: 0.95 };
  if (count <= 2) return { widthRatio: 0.95, heightRatio: 0.48 };
  if (count <= 4) return { widthRatio: 0.48, heightRatio: 0.48 };
  if (count <= 6) return { widthRatio: 0.3, heightRatio: 0.48 };
  if (count <= 9) return { widthRatio: 0.3, heightRatio: 0.3 };
  if (count <= 12) return { widthRatio: 0.22, heightRatio: 0.3 };
  if (count <= 16) return { widthRatio: 0.22, heightRatio: 0.22 };
  if (count <= 20) return { widthRatio: 0.18, heightRatio: 0.22 };
  return { widthRatio: 0.18, heightRatio: 0.18 };
}

const VideoGrid: React.FC<VideoGridProps> = ({ width, height, isSidebarOpen }) => {
  const peers = useAppSelector(selectAllPeers);
  const isShare = useAppSelector(selectIsShare);
  const isOtherShare = useAppSelector(selectIsOtherShare);

  const isAnySharingMode = isShare || isOtherShare;
  const sharerPeer = isAnySharingMode ? peers.find((p) => p.isShare) : null;
  const viewerPeers = sharerPeer ? peers.filter((p) => p.socketId !== sharerPeer.socketId) : peers;

  if (isAnySharingMode) {
    // Sharing layout: sharer gets large area, viewers in a top strip
    const sidebarOffset = isSidebarOpen ? 300 : 0;
    const portalWidth = width - sidebarOffset;
    const viewerH = 182;
    const viewerW = 300;
    const sharerW = portalWidth;
    const sharerH = height - 195;

    return (
      <div className="flex flex-col h-full" style={{ width: `${portalWidth}px` }}>
        {/* Viewer strip */}
        <div className="flex gap-[5px] overflow-x-auto h-[195px] items-center justify-center shrink-0 flex-wrap">
          {viewerPeers.map((peer) => (
            <VideoTile key={peer.socketId} peer={peer} width={viewerW} height={viewerH} />
          ))}
        </div>
        {/* Sharer area */}
        {sharerPeer && (
          <VideoTile
            key={sharerPeer.socketId}
            peer={sharerPeer}
            width={sharerW}
            height={sharerH > 0 ? sharerH : 0}
          />
        )}
      </div>
    );
  }

  // Normal grid layout
  const { widthRatio, heightRatio } = getGridLayout(peers.length);
  const sidebarOffset = isSidebarOpen ? 300 : 0;
  const tileW = Math.max(Math.round((width - sidebarOffset) * widthRatio), 300);
  const tileH = Math.round(height * heightRatio);

  return (
    <div className="flex items-center justify-center h-full mt-[5px]">
      <div className="flex justify-center h-full gap-[5px] flex-wrap overflow-y-auto content-baseline">
        {peers.map((peer) => (
          <VideoTile key={peer.socketId} peer={peer} width={tileW} height={tileH} />
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;
