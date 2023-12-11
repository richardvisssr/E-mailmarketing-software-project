"use client";

import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import styles from "./Views.module.css";
import AlertComponent from "../alert/AlertComponent";
import MailListAccordion from "./MailListAcordionComponent";
import ModelComponent from "./ModelComponent";

export default function MailListComponent() {
  const [mailLists, setMailLists] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [list, setList] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [footerContent, setFooterContent] = useState(null);
  const [showDeleteListModal, setShowDeleteListModal] = useState(false);
  const [selectedListToDelete, setSelectedListToDelete] = useState(null);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/mail/getList")
      .then((response) => response.json())
      .then((data) => setMailLists(data[0].mailList))
      .catch((error) =>
        setNotification({
          type: "error",
          message:
            "Er is iets misgegaan met het ophalen van de maillinglijsten",
        })
      );
  }, []);

  useEffect(() => {
    const fetchSubscribers = async () => {
      const promises = mailLists.map((mailList) =>
        fetch(
          `http://localhost:3001/subscribers?selectedMailingList=${mailList}`
        ).then((response) => response.json())
      );

      const subscribersData = await Promise.all(promises);
      setSubscribers(subscribersData);
    };

    if (mailLists.length > 0) {
      fetchSubscribers();
    }
  }, [mailLists]);

  const handleCloseDeleteListModal = () => {
    setShowDeleteListModal(false);
    setSelectedListToDelete(null);
  };

  const handleShowDeleteListModal = (list) => {
    setShowDeleteListModal(true);
    setSelectedListToDelete(list);
  };

  useEffect(() => {
    if (selectedSubscriber) {
      setModalContent(
        <p>
          Weet je zeker dat je {selectedSubscriber.email} wilt uitschrijven van{" "}
          {selectedSubscriber.list}?
        </p>
      );
      setFooterContent(
        <div>
          <Button
            onClick={handleClose}
            className={`me-4 btn ${styles.buttonSecondary}`}
          >
            Annuleren
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleUnsubscribe(
                selectedSubscriber.email,
                selectedSubscriber.list
              );
              handleClose();
            }}
            className={`me-4 btn ${styles.buttonPrimary}`}
          >
            Verwijderen
          </Button>
        </div>
      );
    }
  }, [selectedSubscriber]);

  useEffect(() => {
    if (selectedListToDelete) {
      setModalContent(
        <p>
          Weet je zeker dat je de lijst {selectedListToDelete} wilt verwijderen?
        </p>
      );
      setFooterContent(
        <div>
          <Button
            onClick={handleCloseDeleteListModal}
            className={`me-4 btn ${styles.buttonSecondary}`}
          >
            Annuleren
          </Button>
          <Button
            onClick={() => {
              deleteList(selectedListToDelete);
              handleSubscribtionDelete(selectedListToDelete);
              handleCloseDeleteListModal();
            }}
            className={`me-4 btn ${styles.buttonPrimary}`}
          >
            Verwijderen
          </Button>
        </div>
      );
    }
  }, [selectedListToDelete]);

  const handleClose = () => {
    setShowModal(false);
    setSelectedSubscriber(null);
  };

  const handleShow = (email, subs) => {
    setShowModal(true);
    setSelectedSubscriber({
      email: email,
      list: subs,
    });
  };

  const handleListAdd = (event) => {
    event.preventDefault();

    if (list === "") {
      setNotification({
        type: "error",
        message: "De lijst is niet ingevuld.",
      });
    } else if (mailLists.includes(list)) {
      setNotification({
        type: "error",
        message: "De ingevulde lijst bestaat al!",
      });
    } else {
      fetch("http://localhost:3001/mail/addList", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: list }),
      })
        .then((response) => response.json())
        .then(() => {
          setMailLists([...mailLists, list]);
          setNotification({
            type: "success",
            message: "De lijst is succesvol toegevoegd.",
          });
        })
        .catch(() => {
          setNotification({
            type: "error",
            message:
              "Er is een fout opgetreden bij het toevoegen van de lijst.",
          });
        });
    }
  };

  const handleUnsubscribe = async (email, subs) => {
    try {
      await fetch("http://localhost:3001/unsubscribe/subs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          subscriptions: subs,
        }),
      });
      setNotification({
        type: "success",
        message: "De gebruiker is succesvol uitgeschreven.",
      });

      setSubscribers((prevSubscribers) => {
        const updatedSubscribers = [...prevSubscribers];
        const listIndex = mailLists.findIndex((list) => list === subs);
        const subscriberIndex = updatedSubscribers[listIndex]?.findIndex(
          (subscriber) => subscriber.email === email
        );
        if (listIndex !== -1 && subscriberIndex !== -1) {
          updatedSubscribers[listIndex].splice(subscriberIndex, 1);
        }
        return updatedSubscribers;
      });
    } catch (error) {
      setNotification({
        type: "error",
        bericht: "Er ging iets mis met het uitschrijven.",
      });
      return false;
    }
  };

  const deleteList = async (list) => {
    try {
      await fetch(`http://localhost:3001/mail/deleteList`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: list }),
      });
      setMailLists(mailLists.filter((item) => item !== list));
      setNotification({
        type: "success",
        message: "De lijst is succesvol verwijderd.",
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: "Er is een fout opgetreden bij het verwijderen van de lijst.",
      });
    }
  };

  const handleSubscribtionDelete = async (subscription) => {
    try {
      await fetch(`http://localhost:3001/unsubscribe/${subscription}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setNotification({
        type: "success",
        message: "De lijst is succesvol verwijderd.",
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: "Er is een fout opgetreden bij het verwijderen van de lijst.",
      });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        <AlertComponent notification={notification} />
      </div>
      <h1 className="text-center">Mail Lijsten</h1>
      <div className="input-group mb-3 mt-3 w-25 mx-auto d-flex align-items-center">
        <input
          type="text"
          className="form-control"
          placeholder="Lijst"
          aria-describedby="basic-addon1"
          onChange={(e) => {
            const value = e.target.value;
            setList(value);
          }}
        />
        <div className="input-group-prepend">
          <input
            type="submit"
            className={`btn ${styles.buttonPrimary} rounded p-2`}
            value="Lijst toevoegen"
            onClick={handleListAdd}
          />
        </div>
      </div>

      <MailListAccordion
        mailLists={mailLists}
        subscribers={subscribers}
        handleShow={handleShow}
        handleDeleteList={deleteList}
        handleDeleteSubscription={handleSubscribtionDelete}
        handleShowDeleteListModal={handleShowDeleteListModal}
      />

      <ModelComponent
        showModal={showModal}
        handleClose={handleClose}
        modalContent={modalContent}
        footerContent={footerContent}
        modalTitle="Bevestig het verwijderen"
      />

      <ModelComponent
        showModal={showDeleteListModal}
        handleClose={handleCloseDeleteListModal}
        modalContent={modalContent}
        footerContent={footerContent}
        modalTitle="Bevestig het verwijderen van de lijst"
      />
    </div>
  );
}