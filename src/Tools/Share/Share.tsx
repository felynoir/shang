import React, { useState, useRef } from "react";
import ShareSVG from "../../assets/icons/share-black-18dp.svg";
import { useCanvas } from "../../hooks";

const Share = () => {
  const { canvas } = useCanvas();
  const firstRef = useRef(true);

  const exportVideo = async (video: File) => {
    console.log("export vid", video);
    if (navigator.share === undefined) {
      console.log("Error: Unsupported feature: navigator.share()");
      window.open(URL.createObjectURL(video));
      return;
    }
    const files = getFileList(video);
    const data = {
      title: "web.dev",
      text: "Check out web.dev.",
      url: "https://web.dev/",
      files,
    };
    console.log("all data", data, URL.createObjectURL(files[0]));

    if (!navigator.canShare || !navigator.canShare({ files })) {
      console.log("Error: Unsupported feature: navigator.canShare()");
      return;
    }

    try {
      await navigator.share(data);
    } catch (error) {
      console.log("Error occur: ", error);
    }
  };

  return (
    <>
      <div
        className={`flex items-center justify-center rounded-full h-12 w-12 p-3 cursor-pointer ${
          video ? "" : "bg-red-700"
        }`}
        onClick={() => takeAction()}
      >
        <img width="24" height="24" src={ShareSVG} />
      </div>
      <div id="log"></div>
      <div id="log2"></div>
    </>
  );
};

export default Share;
