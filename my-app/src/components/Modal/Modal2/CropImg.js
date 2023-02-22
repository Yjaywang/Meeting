import React, { useState, useEffect } from "react";
import Avatar from "react-avatar-edit";

const CropImg = ({ preview, setPreview, setFileSizeErr }) => {
  const [src, setSrc] = useState(null);

  function onClose() {
    setPreview(null);
  }
  function onCrop(view) {
    setPreview(view);
  }

  function onBeforeFileLoad(elem) {
    //> 1 MB 1048576
    if (elem.target.files[0].size > 1048576) {
      setFileSizeErr("File is too big! please select < 1 MB");
      elem.target.value = "";
    }
  }
  useEffect(() => {
    setFileSizeErr("");
  }, [preview]);
  return (
    <div className="crop-img-container">
      <Avatar
        width={360}
        height={200}
        onCrop={onCrop}
        onClose={onClose}
        src={src}
        onBeforeFileLoad={onBeforeFileLoad}
      />
      <div className="preview-container">
        {preview && <img src={preview} alt="" />}
      </div>
    </div>
  );
};

export default CropImg;
