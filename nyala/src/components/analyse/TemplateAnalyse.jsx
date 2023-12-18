"use client";

import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import AlertComponent from "../alert/AlertComponent";

export default function TemplateAnalyse({ id }) {
  const socket = new WebSocket("ws://127.0.0.1:7002/socket");
  const [stats, setStats] = useState(0);
  const [viewChange, setViewChange] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [clicked, setClicked] = useState(false);

  socket.addEventListener("open", (event) => {});

  socket.addEventListener("message", (event) => {
    try {
      const message = JSON.parse(event.data);
      if (
        message.type === "trackOnlineView" ||
        message.type === "trackUnsubscribe"
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

  const getStats = async () => {
    fetch(`http://localhost:3001/stats/${id}`)
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

  const handleClick = () => {
    setClicked(true);
  };

  return (
    <div>
      <AlertComponent notification={notification} />
      <div className="text-end mx-auto mt-2 me-5">
        <i
          className="bi bi-arrow-down-up"
          style={{ fontSize: "2rem" }}
          onClick={handleClick}
        ></i>
      </div>
      <div className="w-50 mx-auto mt-5">
        <ProgressBar
          text="Het aantal online views"
          count={stats.opened}
          total={20}
        />
      </div>
      <div className="w-50 mx-auto mt-5">
        <ProgressBar
          text="Het aantal uitgeschreven personen"
          count={stats.unsubscribed}
          total={10}
        />
      </div>
    </div>
  );
}
