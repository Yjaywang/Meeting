import React, { useState } from "react";
import triangleImg from "../../../assets/images/triangle.svg";
import InputTemplate from "../../../components/InputTemplate";

const RecordingList = ({ recordingList }) => {
  const [searchQuery, setSearchQuery] = useState("");

  //prepare data
  const recordings = recordingList.map((data) => ({
    roomId: data.roomId,
    recordingTime: data.recordingTime,
    content: `roomId: ${data.roomId}, time: ${data.recordingTime}`,
    url: data.url,
  }));

  function handleSearchInputChange(event) {
    setSearchQuery(event.target.value.toLowerCase());
  }

  function extendHandler(e) {
    const triangleImgEl = e.target;
    triangleImgEl.classList.toggle("rotate-180");

    const recordingListTitleEl = e.target.parentElement;
    recordingListTitleEl.classList.toggle("title-container-select");
    const videoEl = e.target.parentElement.parentElement.querySelector("video");
    const videoContainerEl = e.target.parentElement.parentElement.querySelector(
      ".recording-list-video-container"
    );
    videoEl.classList.toggle("height-zero");
    videoContainerEl.classList.toggle("height-zero");
  }

  //compare the search
  const filteredRecordings = recordings.filter((recording) =>
    recording.content.toLowerCase().includes(searchQuery)
  );
  return (
    <div>
      <div className="recording-search-input">
        <InputTemplate
          type={"text"}
          value={searchQuery}
          onchangeHandler={handleSearchInputChange}
          placeholder={"Search recording..."}
        />
      </div>

      <div>
        {filteredRecordings.map((recording) => (
          <div key={recording.id} className="recording-list-container">
            <div className="recording-list-title-container">
              <div className="recording-list-text">{recording.content}</div>
              <img
                className="triangle-img"
                src={triangleImg}
                alt=""
                onClick={extendHandler}
              />
            </div>
            <div className="recording-list-video-container height-zero">
              <video className="recording-list-video height-zero" controls>
                <source src={recording.url} type="video/webm" />
              </video>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordingList;
