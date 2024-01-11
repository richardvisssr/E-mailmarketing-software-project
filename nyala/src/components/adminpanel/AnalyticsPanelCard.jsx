import React, { useState, useEffect } from "react";
import AlertComponent from "../alert/AlertComponent";
import { useRouter } from "next/navigation";
import styles from "@/components/adminpanel/button.module.css";
import Cookies from "js-cookie";

const AnalyticsPanelCard = (props) => {
  const [socket, setSocket] = useState(null);
  const router = useRouter();
  const [openedOnlineEmails, setOpenedOnlineEmails] = useState(0);
  const [unsubscribe, setUnsubscribe] = useState(0);
  const [openedLinks, setOpenedLinks] = useState(0);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const id = props.id;
  const token = Cookies.get("token");

  /**
   * Initializes a WebSocket connection when the component mounts.
   * Closes the WebSocket connection when the component unmounts.
   */
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:7002/socket");
    setSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  /**
   * Fetches analytics data for the specified ID from the server and updates state.
   * Displays an error notification if there's an issue with the data retrieval.
   * @param {string} id - The ID of the analytics data to be fetched.
   */
  useEffect(() => {
    fetch(`http://localhost:3001/stats/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const key = Object.keys(data)[0];
        const value = data[key];
        setOpenedOnlineEmails(value.opened);
        setUnsubscribe(value.unsubscribed);
        setOpenedLinks(value.totalLinkClicks);
      })
      .catch((error) => {
        setNotification({
          type: "error",
          message: "Er ging iets mis met het ophalen van de data",
        });
      });
  }, [id]);

  /**
   * Listens for WebSocket messages and updates state based on the received data.
   * Handles different types of tracking events (online view, unsubscribe, hyperlinks).
   * Displays an error notification if there's an issue with parsing the WebSocket message.
   * @param {WebSocket} socket - The WebSocket connection.
   * @param {string} id - The ID of the analytics data to be updated.
   */
  useEffect(() => {
    if (!socket) return;

    socket.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        const emailId = message.emailId;
        const currentEmailId = id; // assuming template.id is the emailId

        if (emailId === currentEmailId) {
          switch (message.type) {
            case "trackOnlineView":
              setOpenedOnlineEmails(message.opened);
              break;
            case "trackUnsubscribe":
              setUnsubscribe(message.unsubscribed);
              break;
            case "trackHyperlinks":
              setOpenedLinks(message.clicks);
              break;
            default:
              break;
          }
        }
      } catch (error) {
        setNotification({
          type: "error",
          message: "Er ging iets mis met het ophalen van de data",
        });
      }
    });
  }, [socket, id]);

  const handleClick = () => {
    router.push(`/admin/analyse/${id}`);
  };

  return (
    <>
      {notification.message && <AlertComponent notification={notification} />}

      <div className="small-card p-2 bg-light d-grid gap-2 rounded shadow-lg">
        <div className="card-body">
          <p className="mb-0">Uitgeschreven: {unsubscribe}</p>
          <p className="mb-0">Online weergaven: {openedOnlineEmails}</p>
          <p className="mb-0">Links geopend: {openedLinks}</p>
        </div>
        <p onClick={handleClick} className={`${styles.linkText}`}>
          {" "}
          Bekijk hier meer
        </p>
      </div>
    </>
  );
};

export default AnalyticsPanelCard;
