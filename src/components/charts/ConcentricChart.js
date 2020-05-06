import React from "react";

const d3 = window.d3;

const Circle = ({
  data,
  sqrtScale,
  colorScale,
  width,
  height,
  top,
  bottom,
  left,
  right,
}) => {
  return (
    <circle
      r={sqrtScale(data.value)}
      cx={sqrtScale(data.value)}
      cy={height / 2}
      fill={colorScale(data.name)}
    />
  );
};

const ConcentricChart = (props) => {
  const totalTest = props.data.totalTestResults;
  const sqrtScale = d3
    .scaleSqrt()
    .domain([0, totalTest])
    .range([0, (props.height - props.top - props.bottom) / 2]);
  const colorScale = d3
    .scaleOrdinal()
    .domain(props.data)
    .range([
      "rgb(129, 197, 64)",
      "rgb(245, 181, 46)",
      "rgb(237, 91, 53)",
      "rgb(0,0,0)",
    ]);

  //   console.log("data: ", props.data);

  return (
    <>
      <h1 className="chart-header">{`State: ${props.data.stateName}`}</h1>
      <svg width={props.width} height={props.height}>
        <g
          transform={`translate(${
            props.width / 2 - sqrtScale(totalTest)
          }, 0)`}
        >
          {props.dataKeys.map((_k, _n) => (
            <Circle
              key={_n}
              data={{
                name: _k,
                value: props.data[_k],
              }}
              width={props.width}
              height={props.height}
              top={props.top}
              right={props.right}
              bottom={props.bottom}
              left={props.left}
              sqrtScale={sqrtScale}
              colorScale={colorScale}
            />
          ))}
        </g>
      </svg>
    </>
  );
};

export default ConcentricChart;
