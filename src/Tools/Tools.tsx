import React from "react";

import AddBackground from "./AddBackground";
import Share from "./Share";

const Tools = () => {
  return (
    <div className="flex flex-col p-4 bg-white shadow-lg">
      <div className="mt-2">
        <AddBackground />
      </div>
      <div className="mt-2">
        <Share />
      </div>
    </div>
  );
};

export default Tools;
