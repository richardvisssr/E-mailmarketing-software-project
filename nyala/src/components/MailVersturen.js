// AbonnementSelecteren.js
"use client";
import React, { useState, useEffect } from "react";
import AbonnementenFormulier from "./categorieeënComponent";

function AbonnementSelecteren({ html }) {
  const [mailLijsten, setMailLijsten] = useState([]);
  const [selectedMailLijst, setSelectedMailLijst] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    // Fetch the list of available subscriptions from the server using an HTTP request.
    fetch("http://localhost:3001/mail/getList")
      .then((response) => response.json())
      .then((data) => setMailLijsten(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedMailLijst.length > 0) {
      // Fetch the list of subscribers for the selected subscriptions using another HTTP request.
      fetch(
        `http://localhost:3001/getSubscribers?selectedMailLijst=${selectedMailLijst.join(
          ","
        )}`
      )
        .then((response) => response.json())
        .then((data) => setSubscribers(data))
        .catch((error) => console.error(error));
    }
  }, [selectedMailLijst]);

  const handleMailLijstChange = (event) => {
    const { checked, value } = event.target;
    setSelectedMailLijst((prevSelected) => {
      if (checked) {
        return [...prevSelected, value];
      } else {
        return prevSelected.filter((item) => item !== value);
      }
    });
  };

  const handleSendEmailClick = async () => {
    if (selectedMailLijst.length > 0) {
      try {
        const response = await fetch("/api/sendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: html }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Email sent successfully");
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <label className="form-label">Select subscriptions:</label>
      <AbonnementenFormulier
        abonnees={mailLijsten[0]?.mailLijst || []}
        setValue={handleMailLijstChange}
      />

      {selectedMailLijst.length > 0 && (
        <div className="mt-4">
          <h2 className="h4">Subscribers of Selected Subscriptions:</h2>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td>{subscriber.name}</td>
                  <td>{subscriber.email}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="btn btn-primary" onClick={handleSendEmailClick}>
            Verstuur Mail
          </button>
        </div>
      )}
    </div>
  );
}

export default AbonnementSelecteren;
