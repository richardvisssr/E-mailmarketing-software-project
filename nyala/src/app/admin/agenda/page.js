"use client";
import MailCalendar from "@/components/calender/CalendarComponent";
import React, { useEffect, useState } from "react";

function Page() {
  const [emails, setEmails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [error, setError] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3001/getPlannedMails", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const jsonData = await response.json();

        await setEmails(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error(error.message);
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
        setError(true);
        setErrorText(error.message);
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
      {error && (
        <div className="alert alert-danger" role="alert">
          {errorText}
        </div>
      )}
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
      {!isLoading && <MailCalendar emails={emails} deleteMail={deletePlannedMail} shouldUpdate={handleUpdate}/>}
    </div>
  );
}

export default Page;
