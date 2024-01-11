"use client";

import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import HyperlinkChart from "./HyperLinkChart";
import AlertComponent from "../alert/AlertComponent";
import Cookies from "js-cookie";

/**
 * React component for analyzing and displaying statistics.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.id - The ID used to fetch statistics.
 * @returns {JSX.Element} JSX element representing the template analysis.
 */
export default function TemplateAnalyse({ id }) {
  const socket = new WebSocket("ws://127.0.0.1:7002/socket");
  const [stats, setStats] = useState(0);
  const [viewChange, setViewChange] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const token = Cookies.get("token");

  socket.addEventListener("open", (event) => {});

  socket.addEventListener("message", (event) => {
    try {
      const message = JSON.parse(event.data);
      if (
        message.type === "trackOnlineView" ||
        message.type === "trackUnsubscribe" ||
        message.type === "trackHyperlinks"
      ) {
        setViewChange(true);
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Error fetching unsubscribe reasons",
      });
    }
  });

  useEffect(() => {
    getStats();
    setViewChange(false);
  }, [viewChange]);

  /**
   * Fetches statistics data from the server and updates the component state.
   *
   * @async
   * @function
   * @returns {void}
   */
  const getStats = async () => {
    fetch(`http://localhost:3001/stats/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setStats(data[id]))
      .catch((error) =>
        setNotification({
          type: "error",
          message:
            "Er is iets misgegaan met het ophalen van de gegevens. Probeer het later opnieuw.",
        })
      );
  };

  return (
    <div>
      <AlertComponent notification={notification} />
      <div className="w-50 mx-auto mt-5">
        <ProgressBar
          text="Het aantal online views"
          count={stats.opened}
          total={stats.recipientCount}
        />
      </div>
      <div className="w-50 mx-auto mt-5">
        <ProgressBar
          text="Het aantal uitgeschreven personen"
          count={stats.unsubscribed}
          total={stats.recipientCount}
        />
      </div>
      <div className="w-50 mx-auto mt-5">
        <HyperlinkChart linkData={stats.links} />
      </div>
    </div>
  );
}
