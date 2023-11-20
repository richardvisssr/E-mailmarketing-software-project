"use client";
import React, { useState, useEffect } from "react";
import SubscriptionForm from "./CategoriesComponent";
import { useParams } from "next/navigation";

function SelectMailingLists() {
  const [mailingList, setMailingLists] = useState([]);
  const [selectedMailingList, setSelectedMailingList] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [html, setHtml] = useState("");
  const { id } = useParams();

  useEffect(() => {
    fetch("http://localhost:3001/mail/getList")
      .then((response) => response.json())
      .then((data) => setMailingLists(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedMailingList.length > 0) {
      Promise.all([
        fetch(
          `http://localhost:3001/getSubscribers?selectedMailingList=${selectedMailingList.join(
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
          setSubscribers(subscribersData);
          setHtml(emailData.html);
        })
        .catch((error) => console.error("Error in Promise.all:", error));
    }
  }, [selectedMailingList, id]);

  const handleMailingChange = (event) => {
    const { checked, value } = event.target;
    setSelectedMailingList((prevSelected) => {
      if (checked) {
        return [...prevSelected, value];
      } else {
        return prevSelected.filter((item) => item !== value);
      }
    });
  };

  const handleSendEmailClick = async () => {
    if (selectedMailingList.length > 0) {
      try {
        const response = await fetch(" http://localhost:3001/sendMail/sendEmail", {
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
      <label className="form-label">Selecteer Mailinglijst</label>
      <SubscriptionForm
        subscribers={mailingList[0]?.mailList || []}
        setValue={handleMailingChange}
      />

      {selectedMailingList.length > 0 && (
        <div className="mt-4">
          <h2 className="h4">Abonnees van geselecteerde mailinglijst:</h2>
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
            Mail Versturen
          </button>
        </div>
      )}
    </div>
  );
}

export default SelectMailingLists;
