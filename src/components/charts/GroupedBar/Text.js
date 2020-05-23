import React from "react";

const Text = ({
  translateX,
  translateY,
  textAnchor,
  alignmentBaseline,
  fill,
  fontSize,
  text,
}) => {
  return (
    <text
      transform={`translate(${translateX}, ${translateY})`}
      textAnchor={textAnchor}
      alignmentBaseline={alignmentBaseline}
      fill={fill}
      fontSize={fontSize}
    >
      {text}
    </text>
  );
};

export default Text;
