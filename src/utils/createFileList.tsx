export const createFileList = (files: File[]): FileList => {
  let getDataTransfer: any = () => new DataTransfer();
  try {
    getDataTransfer();
  } catch {
    getDataTransfer = () => new ClipboardEvent("").clipboardData;
  }
  const dataTransfer = getDataTransfer();
  files.map((file) => dataTransfer.items.add(file));
  return dataTransfer.files;
};
