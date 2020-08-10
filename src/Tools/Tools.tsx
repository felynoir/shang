import React from "react";

import AddBackground from "./AddBackground";

const Tools = () => {
  return (
    <div className="flex flex-col p-4 bg-white shadow-lg">
      {["A", "B", AddBackground].map((item) => (
        <div className="mt-2">
          <AddBackground />
        </div>
      ))}
    </div>
  );
};

export default Tools;
