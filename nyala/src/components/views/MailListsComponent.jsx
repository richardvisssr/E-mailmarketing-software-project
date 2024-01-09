"use client";

import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import styles from "./Views.module.css";
import AlertComponent from "../alert/AlertComponent";
import MailListAccordion from "./MailListAcordionComponent";
import ModelComponent from "./ModelComponent";
import Cookies from "js-cookie";

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
  const [showUpdateListModal, setShowUpdateListModal] = useState(false);
  const [selectedListToUpdate, setSelectedListToUpdate] = useState(null);
  const [newName, setNewName] = useState(null);
  const [changeName, setChangeName] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const [modalNotification, setModalNotification] = useState({
    type: "",
    message: "",
  });
  const token = Cookies.get("token");

  useEffect(() => {
    fetch("http://localhost:3001/mail/getList", {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setMailLists(data[0].mailList))
      .catch(() =>
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
          `http://localhost:3001/subscribers?selectedMailingList=${mailList}`, {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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

  const handleCloseUpdateListModal = () => {
    setShowUpdateListModal(false);
    setSelectedListToUpdate(null);
  };

  const handleShowUpdateListModal = (list) => {
    setShowUpdateListModal(true);
    setSelectedListToUpdate(list);
    setModalNotification({
      type: "",
      message: "",
    });
  };

  const updateName = (e) => {
    setNewName(e.target.value);
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

  useEffect(() => {
    if (selectedListToUpdate) {
      setModalContent(
        <div>
          <p>
            Weet je zeker dat je de lijst {selectedListToUpdate} wilt aanpassen?
          </p>
          <label htmlFor="newListName">Nieuwe naam</label>
          <input
            type="text"
            className="form-control"
            placeholder={selectedListToUpdate}
            aria-describedby="basic-addon1"
            onChange={(e) => {
              updateName(e);
            }}
          />
        </div>
      );
      setFooterContent(
        <div>
          <Button
            onClick={handleCloseUpdateListModal}
            className={`me-4 btn ${styles.buttonSecondary}`}
          >
            Annuleren
          </Button>
          <Button
            onClick={() => {
              setChangeName(true);
            }}
            className={`me-4 btn ${styles.buttonPrimary}`}
          >
            Bijwerken
          </Button>
        </div>
      );
    }
  }, [selectedListToUpdate]);

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
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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
        message: "Er ging iets mis met het uitschrijven.",
      });
      return false;
    }
  };

  useEffect(() => {
    if (changeName) {
      if (newName === "" || newName === null) {
        setModalNotification({
          type: "error",
          message: "De lijst is niet ingevuld.",
        });
        setChangeName(false);
      } else if (mailLists.includes(newName)) {
        setModalNotification({
          type: "error",
          message: "De ingevulde lijst bestaat al!",
        });
        setChangeName(false);
      } else if (newName.trim().length === 0) {
        setModalNotification({
          type: "error",
          message: "De ingevulde lijstnaam is te kort!",
        });
        setChangeName(false);
      } else {
        const handleUpdateListName = async (name, newName) => {
          try {
            const response = await fetch(
              "http://localhost:3001/mail/updateListName",
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, newName }),
              }
            );

            if (!response.ok) {
              setModalNotification({
                type: "error",
                message:
                  "Er is een fout opgetreden bij het bijwerken van de lijstnaam.",
              });
            }

            setMailLists((prevLists) => {
              const updatedLists = [...prevLists];
              const index = updatedLists.findIndex((list) => list === name);
              if (index !== -1) {
                updatedLists[index] = newName;
              }
              return updatedLists;
            });
            setNotification({
              type: "success",
              message: "De lijstnaam is succesvol bijgewerkt.",
            });
          } catch (error) {
            setNotification({
              type: "error",
              message:
                "Er is een fout opgetreden bij het bijwerken van de lijstnaam.",
            });
          }
        };

        if (selectedListToUpdate !== "" && newName !== "") {
          handleUpdateListName(selectedListToUpdate, newName);
        }

        const handleUpdateListChange = (list, name) => {
          try {
            const response = fetch(`http://localhost:3001/update/${list}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ name }),
            });

            if (!response.ok) {
              setModalNotification({
                type: "error",
                message:
                  "Er is een fout opgetreden bij het bijwerken van de lijst.",
              });
            }

            setNotification({
              type: "success",
              message: "De lijst is succesvol bijgewerkt.",
            });

          } catch (error) {
            setNotification({
              type: "error",
              message:
                "Er is een fout opgetreden bij het bijwerken van de lijst.",
            });
          } finally {
            setChangeName(false);
            handleCloseUpdateListModal();
          }
        };

        if (selectedListToUpdate !== "" && newName !== "") {
          handleUpdateListChange(selectedListToUpdate, newName);
        }
      }
    }
  }, [changeName]);

  const deleteList = async (list) => {
    try {
      await fetch(`http://localhost:3001/mail/deleteList`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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
        handleShowUpdateListModal={handleShowUpdateListModal}
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

      <ModelComponent
        showModal={showUpdateListModal}
        handleClose={handleCloseUpdateListModal}
        modalContent={modalContent}
        footerContent={footerContent}
        modalTitle="Bevestig het aanpassen"
        Notification={<AlertComponent notification={modalNotification} />}
      />
    </div>
  );
}
