"use client";
import AlertComponent from "@/components/alert/AlertComponent";
import MailCalendar from "@/components/calender/CalendarComponent";
import React, { useEffect, useState } from "react";

function Page() {
  const socket  = new WebSocket("ws://localhost:55881/socket");
  const [emails, setEmails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });

  socket.addEventListener("open", (event) => {
  });

  socket.addEventListener("message", (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === "update") {
        setShouldUpdate(true);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3001/plannedMails", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const jsonData = await response.json();

        await setEmails(jsonData);
        setIsLoading(false);
      } catch (error) {
        setNotification({
          type: "error",
          message: "Er is iets foutgegaan tijdens het ophalen",
        });
      }
    };

    setShouldUpdate(false);
    fetchData();
  }, [shouldUpdate]);

  const deletePlannedMail = async (id) => {
    fetch(`http://localhost:3001/planMail/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => handleDeleteResponse(response))
      .catch((error) => {
        setNotification({
          type: "error",
          message: "Er is iets foutgegaan tijdens het verwijderen",
        });
      });
  };

  const handleDeleteResponse = (response) => {
    if (response.status === 200) {
      setShouldUpdate(true);
    }
  };

  const handleUpdate = () => {
    setShouldUpdate(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-center align-items-center mb-4">
        <AlertComponent notification={notification} />
      </div>
      <div className="d-flex justify-content-center align-items-center mb-4">
        <h1>Agenda</h1>
      </div>
      {isLoading && (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!isLoading && (
        <MailCalendar
          emails={emails}
          deleteMail={deletePlannedMail}
          shouldUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default Page;
