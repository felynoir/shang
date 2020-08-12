import React from "react";
import { render } from "@testing-library/react";
// import { CanvasProvider } from "hooks";

const renderFakeContext = (ui: any, options: any = {}) => {
  const { sideBarCtx, themeCtx, noteCtx, ...rest } = options;

  const Wrapper: React.FC = ({ children }) => <>{children}</>;

  return render(ui, { wrapper: Wrapper, ...rest });
};

export * from "@testing-library/react";
export { renderFakeContext as render };
