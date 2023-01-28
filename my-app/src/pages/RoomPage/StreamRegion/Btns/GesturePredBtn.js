import React, { useState } from "react";
import TensorflowOnImg from "../../../../assets/images/tensorflow_on.svg";
import TensorflowOffImg from "../../../../assets/images/tensorflow_off.svg";

const GesturePredBtn = () => {
  const [isPred, setIsPred] = useState(false);
  const handler = () => {
    setIsPred(!isPred);

    const predictBtnImgEl =
      document.querySelector(".Predict-btn-img").parentNode.parentNode;
    predictBtnImgEl.classList.toggle("function-btn-selected");
  };

  return (
    <div className="function-btn-container" onClick={handler}>
      <div>
        <img
          className="Predict-btn-img function-btn-img"
          src={isPred ? TensorflowOnImg : TensorflowOffImg}
          alt=""
        />
        <div className="function-btn-name">
          {isPred ? "Predict on" : "Predict off"}
        </div>
      </div>
    </div>
  );
};

export default GesturePredBtn;
