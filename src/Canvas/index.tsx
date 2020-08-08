import React, { useState } from "react";
import { createContext, useContext } from "react";

export const CanvasContext = createContext({
  canvas: undefined,
  createCanvas: (canvas) => {},
});
export const useCanvas = () => useContext(CanvasContext);
export const CanvasProvider: React.FC = ({ children }) => {
  const [canvas, setCanvas] = useState();

  const createCanvas = (canvas) => {
    setCanvas(canvas);
  };

  return (
    <CanvasContext.Provider value={{ canvas, createCanvas }}>
      {children}
    </CanvasContext.Provider>
  );
};
