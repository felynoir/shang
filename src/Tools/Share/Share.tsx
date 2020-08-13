import React, { useState } from "react";
import ShareSVG from "../../assets/icons/share-black-18dp.svg";
import { useCanvas } from "../../hooks";
import Modal from "../../Modal";

const Share = () => {
  const { mediaFileList, loadCapturingCanvas } = useCanvas();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!mediaFileList) return;
    console.log("media files ", FileList);
    if (navigator.share === undefined) {
      console.log("Error: Unsupported feature: navigator.share()");
      window.open(URL.createObjectURL(mediaFileList[0]));
      return;
    }
    const data = {
      title: "web.dev",
      text: "Check out web.dev.",
      url: "https://web.dev/",
      files: mediaFileList,
    };
    console.log("all data", data, URL.createObjectURL(mediaFileList[0]));
    // @ts-ignore: Type is not defined
    if (!navigator.canShare || !navigator.canShare({ files: mediaFileList })) {
      console.log("Error: Unsupported feature: navigator.canShare()");
      return;
    }

    try {
      await navigator.share(data);
    } catch (error) {
      console.log("Error occur: ", error);
    }
  };

  const handleLoad = async () => {
    try {
      setLoading(true);
      await loadCapturingCanvas({});
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <>
      <div
        className={`flex items-center justify-center rounded-full h-12 w-12 p-3 cursor-pointer`}
        onClick={() => setOpened(true)}
      >
        <img width="24" height="24" src={ShareSVG} />
      </div>
      <Modal
        opened={opened}
        setOpened={setOpened}
        render={({ setOpened }) => (
          <div className="m-2 flex flex-col">
            <div className="text-xl">Export</div>
            {!mediaFileList && (
              <div>
                <button onClick={handleLoad} disabled={loading}>
                  {!loading
                    ? "Load Media"
                    : `Loading${new Array(Math.floor(Math.random() * 3 + 1))
                        .fill(undefined)
                        .map((val, idx) => ".")
                        .join("")}`}
                </button>
              </div>
            )}
            {mediaFileList && (
              <button onClick={handleExport}>Export Media</button>
            )}
          </div>
        )}
      />
    </>
  );
};

export default Share;
