//-----------------fix first user no socket id issue--------------------------------------------------
export function updateDomId(selfSocketId) {
  try {
    const containerEl = document.querySelector(".video-container");
    if (containerEl.id === "video-container-") {
      const videoMicEl = document.querySelector(".video-mic-img");
      const videoVolBarEl = document.querySelector(".video-vol-bar");
      const videoNameEl = document.querySelector(".video-name");
      const videoElementEl = document.querySelector(".video-element");
      const videoAvatarImgEl = document.querySelector(".video-avatar");
      const videoNameStatusEl = document.querySelector(".video-name-status");
      const videoNameHoseEl = document.querySelector(".video-name-host");
      const videoStatusContainerEl = document.querySelector(
        ".video-status-container"
      );
      const videoRecordingContainerEl = document.querySelector(
        ".video-recording-container"
      );
      const videoEmotionImgEl = document.querySelector(".video-emotion");

      containerEl.id = `video-container-${selfSocketId}`;
      videoMicEl.id = `mic-img-${selfSocketId}`;
      videoVolBarEl.id = `vol-bar-${selfSocketId}`;
      videoNameEl.id = `username-${selfSocketId}`;
      videoElementEl.id = `video-${selfSocketId}`;
      videoAvatarImgEl.id = `video-avatar-${selfSocketId}`;
      videoNameStatusEl.id = `user-status-${selfSocketId}`;
      videoNameHoseEl.id = `user-host-${selfSocketId}`;
      videoStatusContainerEl.id = `video-status-${selfSocketId}`;
      videoRecordingContainerEl.id = `video-recording-${selfSocketId}`;
      videoEmotionImgEl.id = `video-emotion-${selfSocketId}`;
    }
  } catch (error) {
    console.log("modify self dom id error: ", error);
  }
}
