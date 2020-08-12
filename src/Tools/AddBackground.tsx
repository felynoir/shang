import React, { useState } from "react";
import ReactDOM from "react-dom";
import AddPhotoSVG from "../assets/icons/add_photo_alternate-black-18dp.svg";
import { useCanvas } from "../hooks";
import Modal from "../Modal/Modal";

const AddBackground = () => {
  const { addImage, addVideo } = useCanvas();
  const [opened, setOpened] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>();

  const handleAction = (opened: boolean) => {
    setOpened(opened);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null) return;
    const file = event.target.files[0];
    setFile(file);
    // const objectURL = window.URL.createObjectURL(file);
  };

  const handleImportFile = () => {
    if (!file) return;
    const fileURL = window.URL.createObjectURL(file);
    if (file.type.includes("image")) {
      addImage(fileURL);
    } else {
      const id = `${file.name}-${Math.round(Math.random() * 10)}`;
      const videoEl = document.createElement("video");
      videoEl.id = id;
      videoEl.width = 400;
      videoEl.height = 400;
      videoEl.muted = true;
      videoEl.src = fileURL;
      addVideo(videoEl);
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-center rounded-full h-12 w-12 p-3 hover:bg-gray-200 cursor-pointer"
        onClick={() => setOpened(true)}
      >
        <img width="24" height="24" src={AddPhotoSVG} />
      </div>
      <Modal
        opened={opened}
        setOpened={handleAction}
        render={({ setOpened }) => (
          <div className="m-2 flex flex-col">
            <div className="text-xl">Import Image/Video</div>
            <div>
              <input type="file" onChange={(e) => handleFileChange(e)} />
            </div>
            <div>
              <button onClick={() => setOpened(false)}>Cancel</button>
              <button onClick={() => handleImportFile()}>Import</button>
            </div>
          </div>
        )}
      />
    </>
  );
};

export default AddBackground;
