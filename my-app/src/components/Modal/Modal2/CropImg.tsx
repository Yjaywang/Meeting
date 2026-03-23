import React, { useState, useEffect } from "react";
import Avatar from "react-avatar-edit";

interface CropImgProps {
  preview: string | null;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  setFileSizeErr: React.Dispatch<React.SetStateAction<string>>;
}

const CropImg: React.FC<CropImgProps> = ({ preview, setPreview, setFileSizeErr }) => {
  const [src, setSrc] = useState<string | null>(null);

  function onClose(): void {
    setPreview(null);
  }
  function onCrop(view: string): void {
    setPreview(view);
  }

  function onBeforeFileLoad(elem: React.ChangeEvent<HTMLInputElement>): void {
    //> 1 MB 1048576
    if (elem.target.files && elem.target.files[0].size > 1048576) {
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
        src={src as string}
        onBeforeFileLoad={onBeforeFileLoad}
      />
      <div className="preview-container">
        {preview && <img src={preview} alt="" />}
      </div>
    </div>
  );
};

export default CropImg;
