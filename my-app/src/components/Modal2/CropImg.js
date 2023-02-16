import React, { useState, useEffect } from "react";
import Avatar from "react-avatar-edit";

const CropImg = ({ preview, setPreview }) => {
  const [src, setSrc] = useState(null);

  function onClose() {
    setPreview(null);
  }
  function onCrop(view) {
    setPreview(view);
  }

  // useEffect(() => {
  //   console.log(preview);
  // }, [preview]);
  return (
    <div className="crop-img-container">
      <Avatar
        width={360}
        height={200}
        onCrop={onCrop}
        onClose={onClose}
        src={src}
      />
      <div className="preview-container">
        {preview && <img src={preview} alt="" />}
      </div>
    </div>
  );
};

export default CropImg;
