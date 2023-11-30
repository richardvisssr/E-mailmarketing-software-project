"use client";

import { useEffect, useState } from "react";
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
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [footerContent, setFooterContent] = useState(null);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/subscribers/all")
      .then((response) => response.json())
      .then((data) => setSubscribers(data))
      .catch((error) => console.log(error));
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setSelectedSubscriber(null);
  };

  const handleShow = (subscriber) => {
    setShowModal(true);
    setSelectedSubscriber(subscriber);
    setModalContent(
      <p>
        Weet u zeker dat u de gebruiker <strong>{subscriber}</strong> aanpassen?
      </p>
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
          onClick={() => handleDeleteSubscriber(subscriber)}
        >
          {mailList ? "Verwijderen" : "Aanpassen"}
        </button>
      </>
    );
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
          <tbody class="table-group-divider">
            {subscribers.map((subscriber) => (
              <tr>
                <td>{subscriber.name}</td>
                <td>{subscriber.email}</td>
                <td>{subscriber.subscription.join(", ")}</td>
                <td className="hover-icon">
                  <i
                    className={`bi bi-pencil-fill ${styles.icon}`}
                    onClick={() => handleShow(subscriber.email)}
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
        modalTitle={`Weet u zeker dat u de gebruiker aanpassen?`}
      />

      {/* <ModelComponent
        showModal={showDeleteUserModal}
        handleClose={handleCloseDeleteListModal}
        modalContent={modalContent}
        footerContent={footerContent}
        modalTitle="Bevestig het aanpassen van de gebruiker"
      /> */}
    </div>
  );
}
