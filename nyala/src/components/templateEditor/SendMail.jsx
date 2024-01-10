"use client";
import React, { useState, useEffect } from "react";
import SubscriptionForm from "../categories/CategoriesComponent";
import AlertComponent from "../alert/AlertComponent";
import Cookies from "js-cookie";

function SelectMailingLists(props) {
  const { id } = props;
  const [mailingList, setMailingLists] = useState([]);
  const [selectedMailingList, setSelectedMailingList] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [html, setHtml] = useState("");
  const [notification, setNotification] = useState({ type: "", message: "" });
  const token = Cookies.get("token");

  useEffect(() => {
    fetch("http://localhost:3001/mail/getList", {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setMailingLists(data))
      .catch((error) =>
        setNotification({
          type: "error",
          message: "Er ging iets mis met het ophalen van de data",
        })
      );
  }, []);

  useEffect(() => {
    if (selectedMailingList.length > 0) {
      Promise.all([
        fetch(
          `http://localhost:3001/subscribers?selectedMailingList=${selectedMailingList.join(
            ","
          )}`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((response) => response.json())
          .catch((error) => {
            setNotification({
              type: "error",
              message: "Er ging iets mis met het ophalen van de data",
            });
            return [];
          }),
        fetch(`http://localhost:3001/mail/getEmail/${id}`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .catch((error) => {
            setNotification({
              type: "error",
              message: "Er ging iets mis met het ophalen van de data",
            });
            return null;
          }),
      ])
        .then(([subscribersData, emailData]) => {
          setSubscribers(subscribersData);
          setHtml(emailData.html);
          props.onDataChange({ html, subscribersData });
        })
        .catch((error) => {
          setNotification({
            type: "error",
            message: "Er ging ergens iets mis",
          });
        });
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
    if (selectedMailingList.length === 0) {
      if (selectedMailingList.length > 0 && subscribers.length === 0) {
        try {
          const response = await fetch(
            "http://localhost:3001/sendMail/sendEmail",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
              body: JSON.stringify({
                html: html,
                subscribers: subscribers,
                id: id,
              }),
            }
          );
          if (response.status === 400) {
            setNotification({
              type: "error",
              message: "Er zijn geen leden in de geselecteerde lijst(en).",
            });
          }
          if (!response.ok || !secondResponse.ok) {
            setNotification({
              type: "error",
              message: "Er ging iets mis met het versturen van de mail",
            });
          }

          setNotification({
            type: "success",
            message: "E-mail is succesvol verstuurd!",
          });
        } catch (error) {
          setNotification({ type: "error", message: error });
        }
      } else {
        setNotification({
          type: "error",
          message: "Er zijn geen abonnees gevonden voor deze mailinglijst",
        });
      }
    } else {
      setNotification({
        type: "error",
        message: "Selecteer een mailinglijst",
      });
    }
  };

  return (
    <div className="container mt-4">
      <AlertComponent notification={notification} />

      <label className="form-label">Selecteer Mailinglijst</label>
      <SubscriptionForm
        subscribers={mailingList[0]?.mailList || []}
        setValue={handleMailingChange}
        selectedSubscribers={selectedMailingList}
      />
    </div>
  );
}
export default SelectMailingLists;
