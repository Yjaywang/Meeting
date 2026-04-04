import React, { useEffect, useState } from "react";
import RecordingList from "./RecordingList";
import { getUserInfo } from "../../../utils/fetchUserApi";
import { IRecording } from "../../../types/models";

const RecordingRegion: React.FC = () => {
  const [recordingList, setRecordingList] = useState<IRecording[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getUserInfo();
        const list = response.data.recording_id;
        if (list) {
          setRecordingList(list);
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
    fetchData();
  }, []);

  return <RecordingList recordingList={recordingList} />;
};

export default RecordingRegion;
