"use client";

import { use, useEffect, useState } from "react";
import AlertComponent from "../alert/AlertComponent";
import ModelComponent from "./ModelComponent";
import styles from "./Views.module.css";

export default function SubscribersTable() {
  const [subscribers, setSubscribers] = useState([]);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState({
    email: "",
    name: "",
  });
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [footerContent, setFooterContent] = useState(null);
  const [emailToUpdate, setEmailToUpdate] = useState(null);
  const [bool, setBool] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/subscribers/all")
      .then((response) => response.json())
      .then((data) => setSubscribers(data))
      .catch((error) =>
        setNotification({
          type: "error",
          message: "Er ging iets mis met het ophalen van de abonnees",
        })
      );
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setSelectedSubscriber(null);
  };

  const handleShow = (subscriber) => {
    setShowModal(true);
    setSelectedSubscriber({
      name: subscriber.name,
      email: subscriber.email,
    });

    setEmailToUpdate(subscriber.email);
    setModalContent(
      <div className="p-2">
        <p>
          Weet u zeker dat u de gebruiker <strong>{subscriber.email}</strong>{" "}
          aanpassen?
        </p>

        <div className="p-2">
          <label htmlFor="name" className="pe-2">
            Naam
          </label>
          <input
            type="text"
            placeholder={subscriber.name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="p-2">
          <label htmlFor="email" className="pe-2">
            Email
          </label>
          <input
            type="email"
            placeholder={subscriber.email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
    );
    setFooterContent(
      <>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClose}
        >
          Annuleren
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => setBool(true)}
        >
          Aanpassen
        </button>
      </>
    );
  };

  useEffect(() => {
    if (bool === true) {
      if (email === null || name === null) {
        return false;
      }
      handleUpdateSubscriber();
    }
  }, [bool]);

  const handleUpdateSubscriber = () => {
    console.log(email, name);
    fetch(`http://localhost:3001/change/${selectedSubscriber.email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        const updatedSubscribers = subscribers.map((subscriber) =>
          subscriber.email === selectedSubscriber.email
            ? { ...subscriber, name, email }
            : subscriber
        );
        setSubscribers(updatedSubscribers);

        setNotification({
          type: "success",
          message: `De gebruiker is aangepast`,
        });
        setShowModal(false);
        setSelectedSubscriber(null);
        setEmailToUpdate(null);
      })
      .catch((error) => {
        setNotification({
          type: "error",
          message: `Er is iets fout gegaan: ${error.message}`,
        });
      });
  };
  return (
    <div>
      <AlertComponent notification={notification} />

      <h1 className="text-center mb-2">Zie hier alle geabonneerde</h1>
      <div className="table-responsive p-5">
        <table className="table table-hover">
          <caption>Lijst met alle geabonneerde leden</caption>
          <thead>
            <tr>
              <th scope="col">Naam</th>
              <th scope="col">Email</th>
              <th scope="col">Abonnementen</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {subscribers.map((subscriber, index) => (
              <tr key={index}>
                <td>{subscriber.name}</td>
                <td>{subscriber.email}</td>
                <td>{subscriber.subscription.join(", ")}</td>
                <td className="hover-icon">
                  <i
                    className={`bi bi-pencil-fill ${styles.icon}`}
                    onClick={() => handleShow(subscriber)}
                  ></i>
                </td>
                <td className="hover-icon">
                  <i
                    className={`bi bi-trash-fill ${styles.icon}`}
                    onClick={() => handleShowDelete(subscriber.email)}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModelComponent
        showModal={showModal}
        handleClose={handleClose}
        modalContent={modalContent}
        footerContent={footerContent}
        modalTitle={`Wijzigen`}
      />
    </div>
  );
}
