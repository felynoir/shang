import React, { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import { useCanvas } from "../Canvas";

const ratio = [9, 16];

const DesignCanvas = () => {
  const { createCanvas } = useCanvas();
  const [dimension, setDimension] = useState<number[]>([0, 0]);
  const isFirst = useRef(true);

  useEffect(() => {
    setDimension([
      (window.innerHeight / ratio[1]) * ratio[0],
      window.innerHeight,
    ]);
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
    <canvas id="canvas" width={dimension[0]} height={dimension[1]}></canvas>
  );
};

export default DesignCanvas;
