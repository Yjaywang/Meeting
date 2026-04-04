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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

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

  function toggleExpand(roomId: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(roomId)) {
        next.delete(roomId);
      } else {
        next.add(roomId);
      }
      return next;
    });
  }

  //compare the search
  const filteredRecordings = recordings.filter((recording) =>
    recording.content.toLowerCase().includes(searchQuery)
  );
  return (
    <div>
      <div className="flex justify-start">
        <InputTemplate
          type={"text"}
          value={searchQuery}
          onchangeHandler={handleSearchInputChange}
          placeholder={"Search recording..."}
        />
      </div>

      <div>
        {filteredRecordings.map((recording) => {
          const isExpanded = expandedIds.has(recording.roomId);
          return (
            <div key={recording.roomId} className="w-full mb-2.5">
              <div
                className={`w-full h-[50px] rounded-md px-2.5 border border-surface-dark flex justify-between items-center gap-2.5 transition-[background-color,color] duration-300 ${
                  isExpanded
                    ? "bg-primary text-white"
                    : "bg-surface-secondary"
                }`}
              >
                <div>{recording.content}</div>
                <img
                  className={`h-[25px] object-cover cursor-pointer transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  src={triangleImg}
                  alt=""
                  onClick={() => toggleExpand(recording.roomId)}
                />
              </div>
              <div
                className={`w-full transition-[height] duration-300 overflow-hidden ${
                  isExpanded ? "h-[360px]" : "h-0"
                }`}
              >
                <video
                  className="w-full h-full transition-[height] duration-300"
                  controls
                >
                  <source src={recording.url} type="video/webm" />
                </video>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecordingList;
