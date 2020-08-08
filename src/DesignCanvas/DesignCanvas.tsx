import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import { useCanvas } from "../Canvas";

const DesignCanvas = () => {
  const { createCanvas } = useCanvas();
  useEffect(() => {
    const canvas = new fabric.Canvas("canvas");
    createCanvas(canvas);
  }, []);

  return <canvas id="canvas"></canvas>;
};

export default DesignCanvas;
