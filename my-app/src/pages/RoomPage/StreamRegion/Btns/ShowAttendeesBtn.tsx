import React from "react";
import AttendeeImg from "../../../../assets/images/attendee.svg";

interface ShowAttendeesBtnProps {
  isAttendee: boolean;
  setIsAttendee: (isAttendee: boolean) => void;
}

const ShowAttendeesBtn: React.FC<ShowAttendeesBtnProps> = ({ isAttendee, setIsAttendee }) => {
  const handler = () => {
    setIsAttendee(!isAttendee);
  };

  return (
    <div
      className={`text-center cursor-pointer rounded-lg transition-colors duration-300 h-[70px] w-[110px] flex items-center hover:bg-surface-dark max-[870px]:w-[50px] max-[870px]:justify-center max-[450px]:w-[35px] ${isAttendee ? "bg-gray-600" : ""}`}
      onClick={handler}
    >
      <div>
        <img
          className="h-[25px] object-cover"
          src={AttendeeImg}
          alt=""
        />
        <div className="text-muted text-sm w-[110px] max-[870px]:text-xs max-[870px]:w-[50px] max-[450px]:text-[8px] max-[450px]:w-[35px]">
          {isAttendee ? "Hide attendees" : "Show attendees"}
        </div>
      </div>
    </div>
  );
};

export default ShowAttendeesBtn;
