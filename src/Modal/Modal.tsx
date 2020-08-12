import React from "react";

export interface ModalContainerType {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Props {
  opened: boolean;
  render: React.FC<ModalContainerType>;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: React.FC<Props> = ({ opened, setOpened, children, render }) => {
  console.log("opened", opened);
  if (!opened) return null;
  return (
    <div className="z-10 fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
      <div
        className="fixed inset-0 transition-opacity"
        onClick={() => setOpened(!open)}
      >
        <div className="absolute inset-0 bg-gray-500 opacity-25"></div>
      </div>
      <div
        className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
        role="dialog"
        aria-modal="true"
      >
        {render({ opened, setOpened })}
      </div>
    </div>
  );
};

export default Modal;
