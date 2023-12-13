// ReasonChart.js
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ReasonChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(chartRef.current);

    const customData = data.map((item) => item.count);
    const reasons = data.map((item) => item.reason);

    const barHeight = 20;
    const width = 300;
    const margin = { top: 40, right: 40, bottom: 60, left: 160 };
    const height =
      Math.ceil((customData.length + 0.1) * barHeight) +
      margin.top +
      margin.bottom;

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleBand()
      .domain(d3.sort(data, (d) => -d.count).map((d) => d.reason))
      .rangeRound([margin.top, height - margin.bottom])
      .padding(0.1);

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width)
      .attr("height", height);

    svg
      .selectAll("rect")
      .data(customData)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", (d, i) => y(reasons[i]))
      .attr("width", (d) => x(d) - margin.left)
      .attr("height", y.bandwidth)
      .attr("fill", "green");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(d3.max(customData) / 1));
  }, [data]);

  return <svg viewBox="0 0 60 55" width="200" height="100" ref={chartRef} />;
};

export default ReasonChart;
