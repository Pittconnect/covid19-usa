import React, { useState, useEffect } from "react";

import Peity from "../peity/Peity";

const recountDataVector = (from = 2, to = 20) =>
  Array.from({ length: Math.floor(Math.random() * to) + from }, () =>
    Math.floor(Math.random() * 40)
  );

const Charts = () => {
  const [dataVector, setDataVector] = useState(() => recountDataVector(3, 15));

//   const changeDataVector = () => setDataVector(() => recountDataVector(3, 15));

//   useEffect(() => {
//     console.log("dataVector: ", dataVector);
//   }, [dataVector]);

  const updateChartValues = (prevVector) => {
    const random = Math.round(Math.random() * 10) + 1;
    prevVector.shift();
    prevVector.push(random);
    return prevVector;
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ margin: "10px" }}>
        <Peity
          type="line"
          data={dataVector}
          options={{
            height: 90,
            width: 90,
            strokeWidth: 0,
            fill: "#fa744f",
          }}
          updatingChart={updateChartValues}
        />
      </div>
      <div style={{ margin: "10px" }}>
        <Peity
          type="pie"
          data={dataVector}
          options={{
            height: 90,
            width: 90,
            strokeWidth: 0,
            fill: ["#202040", "#543864", "#ff6363", "#ffbd69"],
          }}
          updatingChart={updateChartValues}
        />
      </div>
      <div style={{ margin: "10px" }}>
        <Peity
          type="donut"
          data={dataVector}
          options={{
            height: 90,
            width: 90,
            strokeWidth: 0,
            fill: ["#120136", "#035aa6", "#40bad5", "#fcbf1e"],
          }}
          updatingChart={updateChartValues}
        />
      </div>
      <div style={{ margin: "10px" }}>
        <Peity
          type="bar"
          data={dataVector}
          options={{
            height: 90,
            width: 90,
            strokeWidth: 0,
            fill: ["#f4e04d"],
            padding: 0.1,
          }}
          updatingChart={updateChartValues}
        />
      </div>
      {/* <button onClick={changeDataVector}>test</button> */}
    </div>
  );
};

export default Charts;
