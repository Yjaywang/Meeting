import React, { useState } from "react";
import triangleImg from "../../../assets/images/triangle.svg";
import InputTemplate from "../../../components/InputTemplate";
import { IRecording } from "../../../types/models";

interface RecordingItem {
  roomId: string;
  recordingTime: string;
  content: string;
  url: string;
}

interface RecordingListProps {
  recordingList: IRecording[];
}

const RecordingList: React.FC<RecordingListProps> = ({ recordingList }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  //prepare data
  const recordings: RecordingItem[] = recordingList.map((data) => ({
    roomId: data.roomId,
    recordingTime: data.recordingTime,
    content: `roomId: ${data.roomId}, time: ${data.recordingTime}`,
    url: data.url,
  }));

  function handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value.toLowerCase());
  }

  function extendHandler(e: React.MouseEvent<HTMLImageElement>) {
    const triangleImgEl = e.target as HTMLImageElement;
    triangleImgEl.classList.toggle("rotate-180");

    const recordingListTitleEl = triangleImgEl.parentElement;
    recordingListTitleEl?.classList.toggle("title-container-select");
    const videoEl = triangleImgEl.parentElement?.parentElement?.querySelector("video");
    const videoContainerEl = triangleImgEl.parentElement?.parentElement?.querySelector(
      ".recording-list-video-container"
    );
    videoEl?.classList.toggle("height-zero");
    videoContainerEl?.classList.toggle("height-zero");
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
          <div key={recording.roomId} className="recording-list-container">
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
