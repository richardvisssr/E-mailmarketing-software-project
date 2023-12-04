"use client";
import React, { useState, useEffect } from "react";
import SubscriptionForm from "../categories/CategoriesComponent";
import { Alert } from 'react-bootstrap';

function SelectMailingLists(props) {
  const { id } = props;
  const [mailingList, setMailingLists] = useState([]);
  const [selectedMailingList, setSelectedMailingList] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [html, setHtml] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch("http://localhost:3001/mail/getList")
      .then((response) => response.json())
      .then((data) => setMailingLists(data))
      .catch((error) => setShowError(true) && setErrorMessage(error));
  }, []);

  useEffect(() => {
    if (selectedMailingList.length > 0) {
      Promise.all([
        fetch(
          `http://localhost:3001/subscribers?selectedMailingList=${selectedMailingList.join(
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
          props.onDataChange({ html, subscribersData });
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
    
    props.setEmails((prevSelected) => {
      if (checked) {
        return [...prevSelected, value];
      } else {
        return prevSelected.filter((item) => item !== value);
      }
    });
  };

  const handleSendEmailClick = async () => {
    if (selectedMailingList.length > 0 && subscribers.length > 0) {
      try {
        const response = await fetch(
          "http://localhost:3001/sendMail/sendEmail",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              html: html,
              subscribers: subscribers,
              id: id,
            }),
          }
        );

        const secondResponse = await fetch(
          "http://localhost:3001/mail/sendEmail",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              html: html,
              id: id,
              subscribers: subscribers,
            }),
          }
        );

        if (!response.ok || !secondResponse.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setEmailSent(true);
      } catch (error) {
        setErrorMessage(`Error sending email: ${error}`);
        setShowError(true);
        setEmailSent(false);
      }
    } else {
      setErrorMessage("Selecteer een mailinglijst met subscribers.");
      setShowError(true);
    }
  };

  return (
    <div className="container mt-4">
      {showError && (
        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
          {errorMessage}
        </Alert>
      )}
      {emailSent && (
        <div className="alert alert-success" role="alert">
          E-mail is succesvol verstuurd!
        </div>
      )}
      {subscribers.length === 0 && selectedMailingList.length > 0 && (
        <div className="alert alert-warning" role="alert">
          Er zijn nog geen subscribers.
        </div>
      )}

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
                <tr key={subscriber._id}>
                  <td>{subscriber.name}</td>
                  <td>{subscriber.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default SelectMailingLists;
