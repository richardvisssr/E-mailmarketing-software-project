"use client";
import EventCalendar from "@/components/calender/CalendarComponent";
import React, { useEffect, useState } from "react";

function Page() {
  const [emails, setEmails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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
    fetchData();
  }, [emails]);

  const deletePlannedMail = async (id) => {
    const response = await fetch(`http://localhost:3001/planMail/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      console.log(response);
    }
    setEmails(emails.filter((email) => email.id !== id));
  }


  return (
    <div>
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
      {!isLoading && <EventCalendar emails={emails} deleteMail={deletePlannedMail} />}
    </div>
  );
}

export default Page;
