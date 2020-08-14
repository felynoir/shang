import React, { useState } from "react";
import { createContext, useContext } from "react";
import { fabric } from "fabric-with-gestures";
import { createFileList } from "../utils";
import RecordRTC from "recordrtc";
import { createFFmpeg } from "@ffmpeg/ffmpeg";
import { resolvePlugin } from "@babel/core";
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
      "video/webm;codecs=h265",
      "video/webm;codecs=vp8",
      "video/webm;codecs=daala",
      "video/webm;codecs=h264",
      "audio/webm;codecs=opus",
      "video/mpeg",
    ];
    console.log(types.filter((i) => MediaRecorder.isTypeSupported(i)));

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
          // const file = await convertStream(
          //   new Uint8Array(await new Blob(chunks).arrayBuffer())
          // );
          // const file = new File(chunks, name, { type: "video/webm" });
          const file = await convertStream(new Blob(chunks));
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

  const convertStream = (videoBlob: Blob): Promise<File> => {
    return new Promise((resolve, reject) => {
      var workerPath = "https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js";

      function processInWebWorker() {
        if (document.domain == "localhost") {
          workerPath =
            location.href.replace(location.href.split("/").pop(), "") +
            "ffmpeg_asm.js";
        }
        var blob = URL.createObjectURL(
          new Blob(
            [
              'importScripts("' +
                workerPath +
                '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});',
            ],
            {
              type: "application/javascript",
            }
          )
        );

        var worker = new Worker(blob);
        URL.revokeObjectURL(blob);
        return worker;
      }

      var aab;
      var buffersReady;
      var workerReady;
      var worker;
      var posted;

      var fileReader = new FileReader();
      fileReader.onload = function () {
        aab = this.result;
        postMessage();
      };
      fileReader.readAsArrayBuffer(videoBlob);

      if (!worker) {
        worker = processInWebWorker();
      }

      worker.onmessage = function (event) {
        var message = event.data;
        if (message.type == "ready") {
          console.log(
            '<a href="' +
              workerPath +
              '" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.'
          );

          workerReady = true;
          if (buffersReady) postMessage();
        } else if (message.type == "stdout") {
          console.log(message.data);
        } else if (message.type == "start") {
          console.log(
            '<a href="' +
              workerPath +
              '" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.'
          );
        } else if (message.type == "done") {
          console.log(JSON.stringify(message));

          var result = message.data[0];
          console.log(JSON.stringify(result));

          var blob = new File([result.data], "test.mp4", {
            type: "video/mp4",
          });

          console.log(blob);

          PostBlob(blob);
        }
      };
      var postMessage = function () {
        posted = true;

        worker.postMessage({
          type: "command",
          arguments: "-i video.webm -c:v mpeg4 -b:v 6400k -strict experimental output.mp4".split(
            " "
          ),
          files: [
            {
              data: new Uint8Array(aab),
              name: "video.webm",
            },
          ],
        });
      };
      function PostBlob(blob) {
        resolve(blob);
      }
    });
  };

  const convertStreamFFmpeg = async (buffData: Uint8Array): Promise<File> => {
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
