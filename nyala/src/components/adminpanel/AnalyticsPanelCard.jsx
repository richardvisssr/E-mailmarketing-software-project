import React, { useState, useEffect } from "react";
import AlertComponent from "../alert/AlertComponent";

const AnalyticsPanelCard = (props) => {
  const socket = new WebSocket("ws://localhost:7002/socket");
  const [openedOnlineEmails, setOpenedOnlineEmails] = useState(0);
  const [unsubscribe, setUnsubscribe] = useState(0);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const id = props.id;

  useEffect(() => {
    fetch(`http://localhost:3001/stats/${id}`, {})
      .then((response) => response.json())
      .then((data) => {
        const key = Object.keys(data)[0];
        const value = data[key];
        setOpenedOnlineEmails(value.opened);
        setUnsubscribe(value.unsubscribed);
      })
      .catch((error) => {
        setNotification({
          type: "error",
          message: "Er ging iets mis met het ophalen van de data",
        });
      });
  }, [id]);

  socket.addEventListener("open", (event) => {});

  socket.addEventListener("message", (event) => {
    try {
      const message = JSON.parse(event.data);
      const emailId = message.emailId;
      const currentEmailId = id; // assuming template.id is the emailId

      if (
        (message.type === "trackOnlineView" ||
          message.type === "trackUnsubscribe") &&
        emailId === currentEmailId
      ) {
        if (message.type === "trackOnlineView") {
          setOpenedOnlineEmails(message.opened);
        } else if (message.type === "trackUnsubscribe") {
          setUnsubscribe(message.unsubscribed);
        }
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Er ging iets mis met het ophalen van de data",
      });
    }
  });

  return (
    <>
      <AlertComponent notification={notification} />

      <div className="small-card p-2 bg-light d-grid gap-2 rounded shadow-lg">
        <p className="mb-0">Uitgeschreven : {unsubscribe}</p>
        <p className="mb-0">Online weergaven : {openedOnlineEmails}</p>
      </div>
    </>
  );
};

export default AnalyticsPanelCard;
