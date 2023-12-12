"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import AlertComponent from "../alert/AlertComponent";
import reasonChart from "./reasonChart";
import styles from "./analyse.module.css";

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
    if (ready) {
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
        .padding(0.1);

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
    }
  }, [ready]);

  return (
    <div>
      {" "}
      <AlertComponent notification={notification} />
      <div>
        {" "}
        <button onClick={getUnsubscribeReasons}>Get unsubscribe reasons</button>
      </div>{" "}
      <div>
        {" "}
        <div className={`d-flex justify-content-center w-50`}>
          <svg ref={chartRef} />
        </div>
      </div>
    </div>
  );
}
