"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "./analyse.module.css";

const MailListChart = ({ mailListData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (mailListData && mailListData.length > 0) {
      showChart();
    }
  }, [mailListData]);

  const showChart = () => {
    const svg = d3.select(chartRef.current);

    const name = mailListData.map((item) => item.name);
    const count = mailListData.map((item) => item.count);

    const width = 400;
    const height = 400;

    svg.attr("width", width).attr("height", height);

    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const arc = d3
      .arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.8)
      .cornerRadius(10)
      .padAngle(0.02);

    const pie = d3
      .pie()
      .value((d) => d)
      .sort(null);

    const arcs = svg
      .selectAll("arc")
      .data(pie(count))
      .enter()
      .append("g")
      .attr("class", "arc")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i));

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d) => d.data);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .text("Aantal uitschrijvingen per maillijst");

    const legend = svg
      .selectAll(".legend")
      .data(name)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        (d, i) =>
          `translate(${width + 20}, ${i * 20 + height / 2 - name.length * 10})`
      );

    legend
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d, i) => color(i));

    legend
      .append("text")
      .attr("x", 30)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text((d) => d);
  };

  return <svg className={`${styles.chart}`} ref={chartRef} />;
};

export default MailListChart;
