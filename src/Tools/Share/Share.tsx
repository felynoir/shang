import React, { useState, useRef } from "react";
import ShareSVG from "../../assets/icons/share-black-18dp.svg";
import { useCanvas } from "../../hooks";

const Share = () => {
  const [video, setVideo] = useState<File>();
  const firstRef = useRef(true);

  const takeAction = () => {
    if (firstRef.current) {
      startRecordingCanvas();
      // firstRef.current = false;
      return;
    }
  };

  const startRecordingCanvas = () => {
    alert("start");
    const chunks: Blob[] = [];
    const canvas = document.getElementById("canvas");
    const stream = canvas.captureStream();
    const rec = new MediaRecorder(stream);
    rec.ondataavailable = (e) => {
      chunks.push(e.data);
      console.log(e.data);
    };
    rec.onstop = (e) => {
      console.log(chunks);
      exportVideo(new File(chunks, "mylove.mp4", { type: "video/webm" }));
    };
    rec.start();
    setTimeout(() => rec.stop(), 3000); // stop recording in 3s
  };

  const exportVideo = async (video: File) => {
    console.log(video);
    if (navigator.share === undefined) {
      console.log("Error: Unsupported feature: navigator.share()");
      window.open(URL.createObjectURL(video));
      return;
    }
    // if (!navigator.canShare || !navigator.canShare({ files })) {
    //   console.log("Error: Unsupported feature: navigator.canShare()");
    //   return;
    // }
    const data = {
      title: "web.dev",
      text: "Check out web.dev.",
      url: "https://web.dev/",
      files: [video],
    };
    const fileList = new FileList();
    fileList.console.log(data);
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