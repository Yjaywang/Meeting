import { React, useEffect } from "react";
import { connect } from "react-redux";
import AttendeesRegion from "./AttendeesRegion/AttendeesRegion";
import FunctionRegion from "./StreamRegion/FunctionRegion";
import * as webRTCApi from "../../utils/webRTCApi";
import Loading from "./Loading";
import "./RoomPage.css";

const RoomPage = (props) => {
  const { roomId, username, isHost, initLoading } = props;
  useEffect(() => {
    webRTCApi.startCall(isHost, username, roomId);
  }, []);

  return (
    <div className="room-page-container">
      {initLoading && <Loading />}

      <div className="room-page-panel-I">
        <div className="video-region-container">
          <div className="video-region">
            <div id="videos-portal"></div>
          </div>
          <div className="share-region"></div>
        </div>
        <div className="attendee-chat-region-container width-zero">
          <AttendeesRegion />
        </div>
      </div>
      <div className="room-page-panel-II">
        <FunctionRegion roomId={roomId} />
      </div>
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(RoomPage);
