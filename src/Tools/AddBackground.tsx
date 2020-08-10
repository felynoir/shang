import React from "react";

import AddPhotoSVG from "../assets/icons/add_photo_alternate-black-18dp.svg";
import { useCanvas } from "../hooks";

const AddBackground = () => {
  const { addImage } = useCanvas();

  const handleAction = () => {
    alert("action");
  };

  return (
    <div onClick={handleAction}>
      <img width="24" height="24" src={AddPhotoSVG} />
    </div>
  );
};

export default AddBackground;
