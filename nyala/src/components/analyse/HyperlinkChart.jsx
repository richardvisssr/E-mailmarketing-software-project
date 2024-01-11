"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "./analyse.module.css";

const UnsubscribeReasonChart = ({ linkData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (linkData && linkData.length > 0) {
      showChart();
    }
  }, [linkData]);

  /**
   * Renders a bar chart using D3.js based on the provided linkData.
   * @function
   * @returns {void}
   */
  const showChart = () => {
    const pattern = /^(?:https?:\/\/)?(?:www\.)?([^\.]+)\..+?\/?/;
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const linked = linkData.map((item) => {
      const match = item.link.match(pattern);
      if (match) {
        return match[1].charAt(0).toUpperCase() + match[1].slice(1);
      }
    });

    const completeLink = linkData.map((item) => item.link);
    const count = linkData.map((item) => item.count);

    const barHeight = 20;
    const width = 300;
    const margin = { top: 40, right: 40, bottom: 60, left: 160 };
    const height =
      Math.ceil((count.length + 0.1) * barHeight) + margin.top + margin.bottom;

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(linkData, (d) => d.count)])
      .nice()
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleBand()
      .domain(linked)
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
      .attr("y", (d, i) => y(linked[i]))
      .attr("width", (d) => x(d) - margin.left)
      .text((d, i) => linked[i])
      .attr("height", y.bandwidth)
      .attr("fill", (d, i) => color(i));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll("text")
      .html(
        (d, i) =>
          `<a href="${completeLink[i]}" style="text-decoration: none; color:black;">${linked[i]}</a>`
      );

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(d3.ticks(0, d3.max(count), 3))
          .tickFormat(d3.format(".0f"))
      );

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Aantal keren dat er op een link is geklikt");
  };

  return <svg className={`${styles.barChart}`} ref={chartRef} />;
};

export default UnsubscribeReasonChart;
