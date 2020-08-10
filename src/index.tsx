import * as React from "react";
import { render } from "react-dom";
import "./index.css";
import { CanvasProvider } from "./hooks";

import Main from "./Main";

class App extends React.Component {
  render() {
    return (
      <CanvasProvider>
        <Main />
      </CanvasProvider>
    );
  }
}

render(<App />, document.getElementById("app"));
