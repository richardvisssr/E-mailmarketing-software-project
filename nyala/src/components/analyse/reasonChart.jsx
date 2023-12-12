"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function reasonChart(data, ref) {
  const chartRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(chartRef.current);

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(["Reason 1", "Reason 2", "Reason 3"])
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", xScale(0))
      .attr("y", (d) => yScale(d))
      .attr("width", (d) => xScale(d))
      .attr("height", yScale.bandwidth())
      .attr("fill", "steelblue");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));
  }, []);

  return <svg ref={chartRef} />;
}
