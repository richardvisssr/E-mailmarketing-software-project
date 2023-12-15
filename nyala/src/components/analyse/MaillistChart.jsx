"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "./analyse.module.css";

const MailListChart = ({ mailListData, refreshChart }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (mailListData && mailListData.length > 0) {
      showChart();
    }
  }, [mailListData, refreshChart]);

  const showChart = () => {
    const svg = d3.select(chartRef.current);

    svg.selectAll("*").remove();

    const name = mailListData.map((item) => item.name);
    const count = mailListData.map((item) => item.count);

    const total = count.reduce((a, b) => a + b, 0);

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

    var div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip-donut")
      .style("opacity", 0);

    const arcs = svg
      .selectAll("path")
      .data(pie(count))
      .enter()
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", function (d, i) {
        return color(i);
      })
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration("50").attr("opacity", ".85");
        div.transition().duration(50).style("opacity", 1);

        let [x, y] = d3.pointer(event); // Dynamically get mouse position

        let percentage = Math.round((d.data / total) * 100);
        div
          .html(`${d.data} (${percentage}%)`)
          .style("left", x + "px")
          .style("top", y + "px");
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration("50").attr("opacity", "1");
        div.transition().duration("50").style("opacity", 0);
      });

    arcs
      .append("text")
      .attr("transform", function (d) {
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function (d) {
        return d.data;
      });

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
