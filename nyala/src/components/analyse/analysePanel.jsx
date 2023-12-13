"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import AlertComponent from "../alert/AlertComponent";
import reasonChart from "./reasonChart";
import styles from "./analyse.module.css";
import { Container } from "react-bootstrap";

export default function AnalysePanel({ props }) {
  const chartRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [reasonData, setReasonData] = useState([]);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  const getUnsubscribeReasons = async () => {
    try {
      const response = await fetch("http://localhost:3001/unsubscribeReasons");
      const data = await response.json();

      const reasonCounts = {};
      data.forEach((item) => {
        const reason = item.reason;
        if (reasonCounts[reason]) {
          reasonCounts[reason] += 1;
        } else {
          reasonCounts[reason] = 1;
        }
      });

      setReasonData(
        Object.entries(reasonCounts).map(([reason, count]) => ({
          reason,
          count,
        }))
      );
      setReady(true);
    } catch (error) {
      setNotification({
        type: "error",
        message: "Error fetching unsubscribe reasons",
      });
    }
  };

  useEffect(() => {
    getUnsubscribeReasons();
    if (ready) {
      showChart();
    }
  }, [ready]);

  const showChart = () => {
    const svg = d3.select(chartRef.current);

    const customData = reasonData.map((item) => item.count);
    const reasons = reasonData.map((item) => item.reason);

    const barHeight = 20;
    const width = 300;
    const margin = { top: 40, right: 40, bottom: 60, left: 160 };
    const height =
      Math.ceil((customData.length + 0.1) * barHeight) +
      margin.top +
      margin.bottom;

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(reasonData, (d) => d.count)])
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
      .data(customData)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", (d, i) => y(reasons[i]))
      .attr("width", (d) => x(d) - margin.left)
      .attr("height", y.bandwidth)
      .attr("fill", "#E800E9");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(d3.max(customData) / 1));

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Aantal afmeldredenen");
  };

  return (
    <div>
      <AlertComponent notification={notification} />
      <div
        className={`container-lg ${styles.quarterPageContainer} position-fixed top-30`}
      >
        <svg className={`${styles.chart}`} ref={chartRef} />
      </div>
    </div>
  );
}
