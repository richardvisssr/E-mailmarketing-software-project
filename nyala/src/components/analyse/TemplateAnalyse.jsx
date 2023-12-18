"use client";

import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import AlertComponent from "../alert/AlertComponent";

export default function TemplateAnalyse({ id }) {
  const socket = new WebSocket("ws://127.0.0.1:7002/socket");
  const [onlineViews, setOnlineViews] = useState(0);
  const [viewChange, setViewChange] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });

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
      .then((data) => setOnlineViews(data[id]))
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
        <ProgressBar text="Het aantal online views" count={5} total={10} />
      </div>
    </div>
  );
}
