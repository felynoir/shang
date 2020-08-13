import React from "react";
import { render } from "../test-utils";
import Modal from "./Modal";

describe("Modal component", () => {
  const setOpened = jest.fn();

  afterEach(() => {
    setOpened.mockReset();
  });

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

  it("should no render on opened is false", async () => {
    const ModalContainer = jest.fn();
    render(
      <Modal opened={false} setOpened={setOpened} render={ModalContainer} />
    );

    expect(ModalContainer).not.toHaveBeenCalled();
  });
});
