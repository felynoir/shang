import React from "react";
import DesignCanvas from "./DesignCanvas";
import Tools from "./Tools";

const Main = () => {
  return (
    <div className="flex flex-row">
      <Tools />
      <DesignCanvas />
    </div>
  );
};

export default Main;
