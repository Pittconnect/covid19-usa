import React, { useRef, useEffect } from "react";
import "peity";

const $ = window.jQuery;

const Peity = ({
  type = "line",
  data = "",
  options = {},
  updatingChart,
  updatingTime = 2000,
}) => {
  const $chartRef = useRef();
  const $chart = useRef(false);

  useEffect(() => {
    $chart.current = $($chartRef.current).peity(type, options);
  }, [type, options]);

  useEffect(() => {
    if ($chart.current) {
      $chart.current.change();
    }
  }, [data]);

  useEffect(() => {
    // console.log("smthn")
    if (updatingChart) {
      setInterval(function () {
        const values = $chart.current.text().split(",");
        const nextValues = updatingChart(values);
        if (nextValues) {
          $chart.current.text(nextValues.join(",")).change();
        }
      }, updatingTime);
    }
  }, [updatingChart, updatingTime]);

  return (
    <span ref={$chartRef} className="peity">
      {data.join(",")}
    </span>
  );
};

export default Peity;
