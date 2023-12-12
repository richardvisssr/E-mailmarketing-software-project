"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import AlertComponent from "../alert/AlertComponent";

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
    if (!ready) return;

    const customData = reasonData.map((item) => item.count * 10);

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", 400)
      .attr("height", 300);

    svg
      .selectAll("rect")
      .data(customData)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 50)
      .attr("y", (d) => 300 - d)
      .attr("width", 40)
      .attr("height", (d) => d)
      .attr("fill", "steelblue");
  }, [ready]);

  return (
    <div ref={chartRef}>
      <AlertComponent notification={notification} />
      <h1>analysePanel</h1>
      <button onClick={getUnsubscribeReasons}>Get unsubscribe reasons</button>
    </div>
  );
}
