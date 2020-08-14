import React, { useState } from "react";
import { createContext, useContext } from "react";
import { fabric } from "fabric-with-gestures";
import { createFileList } from "../utils";
import RecordRTC from "recordrtc";
import { createFFmpeg } from "@ffmpeg/ffmpeg";
// import * as CCapture from "ccapture.js";

interface MediaMetadataType {
  name?: string;
  duration?: number;
}

export interface CanvasContextType {
  canvas: any;
  mediaFileList: FileList | undefined;
  createCanvas(canvas: any): void;
  addImage(iamgeURL: string): void;
  addVideo(videoEl: HTMLVideoElement): void;
  loadCapturingCanvas(metadata: MediaMetadataType): Promise<FileList>;
}

export const CanvasContext = createContext<CanvasContextType | undefined>(
  undefined
);
export const useCanvas = () => {
  const ctx = useContext(CanvasContext);
  if (ctx === undefined) {
    throw new Error("Canvas Context must be used within CanvasProvider");
  }
  return ctx;
};

export const CanvasProvider: React.FC = ({ children }) => {
  const [canvas, setCanvas] = useState();
  const [mediaFileList, setMediaFileList] = useState<FileList>();

  const createCanvas = (canvas: any) => {
    setCanvas(canvas);
  };

  const addImage = (fileURL: string) => {
    fabric.Image.fromURL(fileURL, (oImg) => {
      canvas.add(oImg);
    });
  };

  const addVideo = (videoEl: HTMLVideoElement) => {
    console.log("addvideo", canvas.getWidth() / 2);
    var video1 = new fabric.Image(videoEl, {
      left: 200,
      top: 200,
      originX: "center",
      originY: "center",
      objectCaching: false,
    });
    canvas.add(video1);
    video1.getElement().play();

    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
      console.log("render");
    });
  };

  const loadCapturingCanvas = ({
    name = "myvid.webm",
    duration = 5000,
  }): Promise<FileList> => {
    var types = [
      "video/webm",
      "audio/webm",
      "video/webm;codecs=vp8",
      "video/webm;codecs=daala",
      "video/webm;codecs=h264",
      "audio/webm;codecs=opus",
      "video/mpeg",
    ];

    for (var i in types) {
      console.log(
        "Is " +
          types[i] +
          " supported? " +
          (MediaRecorder.isTypeSupported(types[i]) ? "Maybe!" : "Nope :(")
      );
    }

    return new Promise((resolve, reject) => {
      try {
        const canvasEl = document.getElementById("canvas") as HTMLCanvasElement;
        if (!canvasEl) {
          return reject("Canvas Element is not assign");
        }

        const chunks: Blob[] = [];
        const stream = new MediaStream();

        // Add main track
        // @ts-ignore: Type handling is conflict itself.
        const canvasStream = canvasEl.captureStream(60) as MediaStream;
        stream.addTrack(canvasStream.getTracks()[0]);

        // Loop each Video element in canvas for add audiotrack into stream
        canvas.getObjects().map((klass) => {
          const nodeName = klass?._element?.nodeName;
          if (nodeName === "VIDEO") {
            const el = klass?._element as HTMLVideoElement;
            // @ts-ignore: Type handling is conflict itself.
            const vidStream = el.captureStream() as MediaStream;
            stream.addTrack(vidStream.getAudioTracks()[0]);
          }
        });
        const options = {
          mimeType: "video/webm",
        };
        const rec = new MediaRecorder(stream, options);
        rec.ondataavailable = (e) => {
          chunks.push(e.data);
        };
        rec.onstart = (e) => {
          console.log("start rec");

          // Replay All Video
          canvas.getObjects().map((klass) => {
            console.log(klass);
            if (klass?._element?.nodeName === "VIDEO") {
              klass._element.pause();
              klass._element.currentTime = 0;
              klass._element.play();
            }
          });
        };
        rec.onstop = async (e) => {
          console.log("end rec => ", chunks);
          const file = await convertStream(
            new Uint8Array(await new Blob(chunks).arrayBuffer())
          );
          // const file = new File(chunks, name, { type: "video/webm" });
          const fileList = createFileList([file]);
          setMediaFileList(fileList);
          resolve(fileList);
        };
        rec.start();
        setTimeout(() => rec.stop(), duration);
      } catch (err) {
        reject(err);
      }
    });
  };

  const convertStream = async (buffData: Uint8Array): Promise<File> => {
    console.log("converting stream");
    const ffmpeg = createFFmpeg({
      log: true,
    });
    await ffmpeg.load();
    await ffmpeg.write("test.webm", buffData);
    await ffmpeg.transcode("test.webm", "myvid.mp4");
    const data = await ffmpeg.read("myvid.mp4");
    return new File([data.buffer], "myvid.mp4", { type: "video/mp4" });
  };

  const ctx = {
    canvas,
    mediaFileList,
    loadCapturingCanvas,
    addImage,
    addVideo,
    createCanvas,
  };

  return (
    <CanvasContext.Provider value={ctx}>{children}</CanvasContext.Provider>
  );
};
