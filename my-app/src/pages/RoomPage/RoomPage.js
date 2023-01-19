import { React, useEffect } from "react";
import DisplayRoomId from "./DisplayRoomId";
import { connect } from "react-redux";
import AttendeesRegion from "./AttendeesRegion/AttendeesRegion";
import StreamRegion from "./StreamRegion/StreamRegion";
import * as webRTCApi from "../../utils/webRTCApi";
import Loading from "./Loading";

const RoomPage = (props) => {
  const { roomId, username, isHost, initLoading } = props;
  useEffect(() => {
    webRTCApi.startCall(isHost, username, roomId);
  });

  return (
    <div className="room-page-container">
      <AttendeesRegion />
      <StreamRegion />
      <DisplayRoomId roomId={roomId} />
      {initLoading && <Loading />}
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(RoomPage);
