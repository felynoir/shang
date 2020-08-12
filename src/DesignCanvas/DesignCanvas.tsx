import React, { useState, useEffect, useRef } from "react";
import { fabric } from "fabric-with-gestures";
import { useCanvas } from "../hooks";

const ratio = [9, 16];

const DesignCanvas = () => {
  const { canvas, createCanvas } = useCanvas();
  const [dimension, setDimension] = useState<number[]>([0, 0]);
  const isFirst = useRef(true);

  useEffect(() => {
    const height = Math.floor(window.innerHeight / ratio[1]) * ratio[1];
    setDimension([(height / ratio[1]) * ratio[0], height]);
  }, []);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const canvas = new fabric.Canvas("canvas");
    createCanvas(canvas);
  }, [dimension]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <canvas
        id="canvas"
        className="shadow-md"
        width={dimension[0]}
        height={dimension[1]}
      ></canvas>
    </div>
  );
};

export default DesignCanvas;
