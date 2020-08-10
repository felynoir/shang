import React, { useState } from "react";
import { createContext, useContext } from "react";

export interface CanvasContextType {
  canvas: any;
  createCanvas(canvas: any): void;
  addImage(iamge: any): void;
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

  const createCanvas = (canvas: any) => {
    setCanvas(canvas);
  };

  const addImage = (image: any) => {};

  return (
    <CanvasContext.Provider value={{ canvas, addImage, createCanvas }}>
      {children}
    </CanvasContext.Provider>
  );
};
