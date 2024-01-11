"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "./analyse.module.css";

const UnsubscribeReasonChart = ({ reasonData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (reasonData && reasonData.length > 0) {
      showChart();
    }
  }, [reasonData]);

  const showChart = () => {
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const count = reasonData.map((item) => item.count);
    const reasons = reasonData.map((item) => item.reason);

    const barHeight = 20;
    const width = 300;
    const margin = { top: 40, right: 40, bottom: 60, left: 160 };
    const height =
      Math.ceil((count.length + 0.1) * barHeight) + margin.top + margin.bottom;

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(reasonData, (d) => d.count)])
      .nice()
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleBand()
      .domain(d3.sort(reasonData, (d) => -d.count).map((d) => d.reason))
      .rangeRound([margin.top, height - margin.bottom])
      .padding(0.2);

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width)
      .attr("height", height);

    svg
      .selectAll("rect")
      .data(count)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", (d, i) => y(reasons[i]))
      .attr("width", (d) => x(d) - margin.left)
      .attr("height", y.bandwidth)
      .attr("fill", (d, i) => color(i));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(d3.ticks(0, d3.max(count), 3)));

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Aantal uitschrijvingen per reden");
  };
  return <svg className={`${styles.chart}`} ref={chartRef} />;
};

export default UnsubscribeReasonChart;
