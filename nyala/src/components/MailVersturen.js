// AbonnementSelecteren.js
"use client";
import React, { useState, useEffect } from "react";
import AbonnementenFormulier from "./categorieeënComponent";
import { useParams } from "next/navigation";

function MailLijstenSelecteren() {
  const [mailLijsten, setMailLijsten] = useState([]);
  const [selectedMailLijst, setSelectedMailLijst] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [html, setHtml] = useState("");
  const { id } = useParams();

  useEffect(() => {
    // Fetch the list of available subscriptions from the server using an HTTP request.
    fetch("http://localhost:3001/mail/getList")
      .then((response) => response.json())
      .then((data) => setMailLijsten(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedMailLijst.length > 0) {
      // Use Promise.all to make parallel requests
      Promise.all([
        fetch(
          `http://localhost:3001/getSubscribers?selectedMailLijst=${selectedMailLijst.join(
            ","
          )}`
        )
          .then((response) => response.json())
          .catch((error) => {
            console.error("Error fetching subscribers:", error);
            return [];
          }),
        fetch(`http://localhost:3001/mail/getEmail/${id}`)
          .then((response) => response.json())
          .catch((error) => {
            console.error("Error fetching email:", error);
            return null;
          }),
      ])
        .then(([subscribersData, emailData]) => {
          // Set subscribers and email data
          setSubscribers(subscribersData);
          setHtml(emailData);
        })
        .catch((error) => console.error("Error in Promise.all:", error));
    }
  }, [selectedMailLijst, id]);

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
          body: JSON.stringify({ html: html, subscribers: subscribers }),
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
      <label className="form-label">selecteer maillijsten:</label>
      <AbonnementenFormulier
        abonnees={mailLijsten[0]?.mailLijst || []}
        setValue={handleMailLijstChange}
      />

      {selectedMailLijst.length > 0 && (
        <div className="mt-4">
          <h2 className="h4">Subscribers van geselecteerde maillijst:</h2>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Naam</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td>{subscriber.naam}</td>
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

export default MailLijstenSelecteren;
