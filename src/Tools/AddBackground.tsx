import React, { useState } from "react";

import AddPhotoSVG from "../assets/icons/add_photo_alternate-black-18dp.svg";
import { useCanvas } from "../hooks";
import Modal from "../Modal/Modal";

const AddBackground = () => {
  const { addImage } = useCanvas();
  const [opened, setOpened] = useState<boolean>(false);

  const handleAction = (opened) => {
    setOpened(opened);
  };

  return (
    <>
      <div
        className="flex items-center justify-center rounded-full h-12 w-12 p-3 hover:bg-gray-200 cursor-pointer"
        onClick={() => setOpened(true)}
      >
        <img width="24" height="24" src={AddPhotoSVG} />
      </div>
      <Modal opened={opened} setOpened={handleAction} />
    </>
  );
};

export default AddBackground;
