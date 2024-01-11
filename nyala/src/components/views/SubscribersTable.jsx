"use client";

import { useEffect, useState } from "react";
import AlertComponent from "../alert/AlertComponent";
import ModelComponent from "./ModelComponent";
import styles from "./Views.module.css";
import Cookies from "js-cookie";

/**
 * SubscribersTable component for managing subscribers and their details.
 *
 * @component
 * @returns {JSX.Element} - SubscribersTable component.
 */
export default function SubscribersTable() {
  const [subscribers, setSubscribers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [footerContent, setFooterContent] = useState(null);
  const [bool, setBool] = useState(false);
  const [modalNotification, setModalNotification] = useState({
    type: "",
    message: "",
  });
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const [selectedSubscriber, setSelectedSubscriber] = useState({
    email: " ",
    name: " ",
  });
  const token = Cookies.get("token");

  /**
   * Retrieves all subscribers from the server on component mount.
   *
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    fetch("http://localhost:3001/subscribers/all", {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setSubscribers(data))
      .catch(() =>
        setNotification({
          type: "error",
          message: "Er ging iets mis met het ophalen van de abonnees",
        })
      );
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setSelectedSubscriber(null);
    setModalNotification({
      type: "",
      message: "",
    });
  };

  /**
   * Displays the update subscriber modal with subscriber details.
   *
   * @function
   * @param {Object} subscriber - The selected subscriber.
   * @returns {void}
   */
  const handleShow = (subscriber) => {
    setShowModal(true);
    setSelectedSubscriber({
      name: subscriber.name,
      email: subscriber.email,
    });
    setModalContent(
      <div className="p-2">
        <p>
          Weet u zeker dat u de gegevens van de gebruiker{" "}
          <strong>{subscriber.email}</strong> wilt veranderen?
        </p>

        <div className="p-2">
          <label htmlFor="name" className="pe-2">
            Naam
          </label>
          <input
            type="text"
            placeholder={subscriber.name}
            onChange={(e) => setName(e.target.value)}
            className={`form-control ${styles.entry} p-2 mb-3`}
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
            className={`form-control ${styles.entry} p-2 mb-3`}
          />
        </div>
      </div>
    );
    setFooterContent(
      <>
        <button
          type="button"
          className={`me-4 btn ${styles.buttonSecondary}`}
          onClick={handleClose}
        >
          Annuleren
        </button>
        <button
          type="button"
          className={`me-4 btn ${styles.buttonPrimary}`}
          onClick={() => setBool(true)}
        >
          Aanpassen
        </button>
      </>
    );
  };

  /**
   * Updates the subscriber based on the provided email and new details.
   *
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    if (bool === true) {
      if (email == null && name == null) {
        setModalNotification({
          type: "error",
          message: "Vul een naam of email in",
        });
        setBool(false);
      } else if (!email) {
        setEmail(selectedSubscriber.email);
        handleUpdateSubscriber();
      } else if (email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setModalNotification({
            type: "error",
            message: "Het emailadres is geen valide formaat.",
          });
          setBool(false);
        } else {
          handleUpdateSubscriber();
        }
      } else if (!name) {
        setName(selectedSubscriber.name);
        handleUpdateSubscriber();
      }
    }
  }, [bool]);

  /**
   * Handles updating a subscriber with new details, making a PUT request to the server.
   *
   * @function
   * @returns {void}
   */
  const handleUpdateSubscriber = () => {
    const updatedData = {
      email: email || selectedSubscriber.email,
      name: name || selectedSubscriber.name,
    };

    fetch(`http://localhost:3001/change/${selectedSubscriber.email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then(() => {
        const updatedSubscribers = subscribers.map((subscriber) =>
          subscriber.email === selectedSubscriber.email
            ? {
                ...subscriber,
                name: updatedData.name,
                email: updatedData.email,
              }
            : subscriber
        );
        setSubscribers(updatedSubscribers);
        setNotification({
          type: "success",
          message: "De gebruiker is aangepast",
        });
        setShowModal(false);
        setSelectedSubscriber(null);
        setBool(false);
        setModalNotification({
          type: "",
          message: "",
        });
        setEmail(null);
        setName(null);
      })
      .catch((error) => {
        setNotification({
          type: "error",
          message: `Er is iets fout gegaan: ${error.message}`,
        });
      });
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedSubscriber(null);
  };

  const handleShowDelete = (email) => {
    setShowDeleteModal(true);
    setSelectedSubscriber({
      email: email,
    });
    setModalContent(
      <div className="p-2">
        <p>
          Weet u zeker dat u de gebruiker <strong>{email}</strong> wilt
          verwijderen?
        </p>
      </div>
    );
    setFooterContent(
      <>
        <button
          type="button"
          className={`me-4 btn ${styles.buttonSecondary}`}
          onClick={handleCloseDelete}
        >
          Annuleren
        </button>
        <button
          type="button"
          className={`me-4 btn ${styles.buttonPrimary}`}
          onClick={() => handleDeleteSubscriber(email)}
        >
          Verwijderen
        </button>
      </>
    );
  };

  /**
   * Deletes the subscriber based on the provided email.
   *
   * @function
   * @param {string} email - The email of the subscriber to be deleted.
   * @returns {void}
   */
  const handleDeleteSubscriber = (email) => {
    fetch(`http://localhost:3001/unsubscribe`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ email: email }),
    })
      .then((response) => response.json())
      .then(() => {
        const updatedSubscribers = subscribers.filter(
          (subscriber) => subscriber.email !== email
        );
        setSubscribers(updatedSubscribers);
        setNotification({
          type: "success",
          message: "De gebruiker is verwijderd",
        });
        setShowDeleteModal(false);
        setSelectedSubscriber(null);
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
      <div className="d-flex justify-content-center">
        <AlertComponent notification={notification} />
      </div>

      <h1 className="text-center mb-2">Ledenlijst</h1>
      <div className="table-responsive p-5">
        <table className="table table-hover">
          <caption>Lijst met alle geabonneerden leden</caption>
          <thead>
            <tr>
              <th scope="col">Naam</th>
              <th scope="col">Email</th>
              <th scope="col">Abonnementen</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  <h1>Geen abonnees gevonden</h1>
                </td>
              </tr>
            ) : (
              subscribers.map((subscriber, index) => (
                <tr key={index}>
                  <td>{subscriber.name}</td>
                  <td>{subscriber.email}</td>
                  <td>{subscriber.subscription.join(", ")}</td>
                  <td className="hover-icon text-end">
                    <i
                      className={`bi bi-pencil-fill m-4 ${styles.icon}`}
                      onClick={() => handleShow(subscriber)}
                      placeholder="Wijzigen"
                    ></i>
                    <i
                      className={`bi bi-trash3-fill m-4 me-5 ${styles.icon}`}
                      onClick={() => handleShowDelete(subscriber.email)}
                      placeholder="Verwijderen"
                    ></i>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ModelComponent
        size="lg"
        showModal={showModal}
        handleClose={handleClose}
        modalContent={modalContent}
        footerContent={footerContent}
        modalTitle={`Wijzigen`}
        Notification={<AlertComponent notification={modalNotification} />}
      />

      <ModelComponent
        size="md"
        showModal={showDeleteModal}
        handleClose={handleCloseDelete}
        modalContent={modalContent}
        footerContent={footerContent}
        modalTitle={`Verwijderen`}
      />
    </div>
  );
}
