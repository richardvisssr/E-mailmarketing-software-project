// AbonnementSelecteren.js
"use client";
import React, { useState, useEffect } from "react";
import MultiSelect from "./MultiSelect"; // Update the path accordingly

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
      fetch(`http://localhost:3001/getSubscribers?selectedMailLijst=${selectedMailLijst.join(',')}`)
        .then((response) => response.json())
        .then((data) => setSubscribers(data))
        .catch((error) => console.error(error));
    }
  }, [selectedMailLijst]);

  const handleMailLijstChange = (event) => {
    const value = event.target.value;
    if (selectedMailLijst.includes(value)) {
      setSelectedMailLijst(selectedMailLijst.filter(mail => mail !== value));
    } else {
      setSelectedMailLijst([...selectedMailLijst, value]);
    }
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
      <MultiSelect
        options={mailLijsten[0]?.mailLijst || []}
        selectedOptions={selectedMailLijst}
        onChange={handleMailLijstChange}
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
