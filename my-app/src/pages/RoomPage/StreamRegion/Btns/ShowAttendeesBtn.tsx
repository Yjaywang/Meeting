import React from "react";
import AttendeeImg from "../../../../assets/images/attendee.svg";

interface ShowAttendeesBtnProps {
  isAttendee: boolean;
  setIsAttendee: (isAttendee: boolean) => void;
}

const ShowAttendeesBtn: React.FC<ShowAttendeesBtnProps> = ({ isAttendee, setIsAttendee }) => {
  const handler = () => {
    setIsAttendee(!isAttendee);
    const attendeeContainerEl =
      (document.querySelector(".attendee-btn-img") as HTMLElement).parentNode!.parentNode as HTMLElement;
    attendeeContainerEl.classList.toggle("function-btn-selected");

    const attendeeRegionContainerEl = document.querySelector(
      ".attendee-region-container"
    ) as HTMLElement;
    attendeeRegionContainerEl.classList.toggle("hide");

    //chat or attendee not hide, remove container hide
    const attendeeChatContainerEl = document.querySelector(
      ".attendee-chat-region-container"
    ) as HTMLElement;
    const chatRegionContainerEl = document.querySelector(
      ".chat-region-container"
    ) as HTMLElement;
    if (
      !attendeeRegionContainerEl.classList.contains("hide") ||
      !chatRegionContainerEl.classList.contains("hide")
    ) {
      attendeeChatContainerEl.classList.remove("width-zero");
    } else {
      attendeeChatContainerEl.classList.add("width-zero");
    }
  };

  return (
    <div className="function-btn-container" onClick={handler}>
      <div>
        <img
          className="attendee-btn-img function-btn-img"
          src={AttendeeImg}
          alt=""
        />
        <div className="function-btn-name">
          {isAttendee ? "Hide attendees" : "Show attendees"}
        </div>
      </div>
    </div>
  );
};

export default ShowAttendeesBtn;
