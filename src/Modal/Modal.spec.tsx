import React from "react";
import { render } from "../test-utils";
import Modal from "./Modal";

interface ModalContainerType {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

describe("Modal component", () => {
  const setOpened = jest.fn();

  it("should pass props to container", async () => {
    const ModalContainer = jest.fn();
    render(
      <Modal opened={true} setOpened={setOpened} render={ModalContainer} />
    );

    expect(ModalContainer).toHaveBeenCalledWith({
      opened: true,
      setOpened,
    });
  });
});
