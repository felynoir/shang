import * as React from "react";
import { render } from "react-dom";
import "./index.css";

class App extends React.Component {
  render() {
    return (
      <div class="bg-white rounded-lg p-6 shadow-lg">
        <img class="h-16 w-16 rounded-full mx-auto" src="avatar.jpg" />
        <div class="text-center">
          <h2 class="text-lg">Erin Lindford</h2>
          <div class="text-purple-500">Product Engineer</div>
          <div class="text-gray-600">erinlindford@example.com</div>
          <div class="text-gray-600">(555) 765-4321</div>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
