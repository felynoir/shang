import React from "react";

import AddBackground from "./AddBackground";

const ItemList: React.FC = ({ children }) => {
  return (
    <div className="flex items-center justify-center rounded-full h-12 w-12 p-3 cursor-pointer hover:bg-gray-200">
      {children}
    </div>
  );
};

const Tools = () => {
  return (
    <div className="flex flex-col p-4 bg-white shadow-lg">
      {["A", "B", AddBackground].map((item) => (
        <div className="mt-2">
          <ItemList>
            <AddBackground />
          </ItemList>
        </div>
      ))}
    </div>
  );
};

export default Tools;
