import React from "react";
import Rect from "../charts/GroupedBar/Rect";

const RectLegend = ({
  data,
  x,
  y,
  width,
  height,
  fill,
  fontSize,
  fontColor,
}) => {
  return (
    <>
      <Rect x={x} y={y} width={width} height={height} fill={fill} />
      <text
        x={x + 2}
        y={y + fontSize + 4}
        fontSize={fontSize}
        fill={fontColor}
      >{`${data.key}: ${data.value}`}</text>
    </>
  );
};

export default RectLegend;
