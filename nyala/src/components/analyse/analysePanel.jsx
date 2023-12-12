"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function AnalysePanel({ props }) {
  const chartRef = useRef(null);

  const getUnsubscribeReasons = () => {};

  useEffect(() => {
    const data = [10, 20, 30, 40, 100, 10000];

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", 400)
      .attr("height", 300);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 50)
      .attr("y", (d) => 300 - d)
      .attr("width", 40)
      .attr("height", (d) => d)
      .attr("fill", "steelblue");
  }, []);

  return (
    <div ref={chartRef}>
      <h1>analysePanel</h1>
    </div>
  );
}
