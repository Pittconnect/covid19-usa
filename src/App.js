import React from "react";
import Map from "./components/Map";
// import Charts from "./components/charts/Charts";

import "./app.scss";

function App() {
  return (
    <div className="App">
      <div className="App-container">
        <div className="covid-map">
          <Map />
        </div>

        <div className="map-charts">{/* <Charts /> */}</div>
      </div>
    </div>
  );
}

export default App;
