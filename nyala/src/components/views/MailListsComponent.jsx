"use client";

import { useEffect, useState } from "react";
import { Modal, Button, Placeholder, Alert } from "react-bootstrap";

import styles from "./Views.module.css";
import AlertComponent from "../alert/AlertComponent";
import TableComponent from "./TableComponent";

export default function MailListComponent() {
  const [mailLists, setMailLists] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [add, setAdd] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const [list, setList] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [footerContent, setFooterContent] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/mail/getList")
      .then((response) => response.json())
      .then((data) => setMailLists(data[0].mailList))
      .catch((error) => console.log(error));
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

  const handleClose = () => {
    setShowModal(false);
    setSelectedSubscriber(false);
  };

  const handleShow = (email, subs) => {
    setShowModal(true);
    setSelectedSubscriber({
      email: email,
      list: subs,
    });
  };

  const handleAccordionClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
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
          setAdd(false);
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

  return (
    <div>
      <AlertComponent notification={notification} />
      <div className="accordion accordion-flush p-5 pt-1" id="MaillistView">
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
        {mailLists.map((mailList, index) => (
          <div className="accordion-item shadow" key={index}>
            <h2 className="accordion-header shadow">
              <button
                className={`accordion-button ${
                  activeIndex === index ? "" : "collapsed"
                }`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#flush-collapse-${index}`}
                aria-expanded={activeIndex === index ? "true" : "false"}
                aria-controls={`flush-collapse-${index}`}
                onClick={() => handleAccordionClick(index)}
              >
                {mailList}
              </button>
            </h2>
            <div
              id={`flush-collapse-${index}`}
              className={`accordion-collapse collapse ${
                activeIndex === index ? "show" : ""
              }`}
              data-bs-parent="#MaillistView"
            >
              <div className="accordion-body">
                <TableComponent
                  subscribers={subscribers}
                  handleShow={handleShow}
                  mailList={mailList}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal show={showModal} onHide={handleClose} size="md">
        <Modal.Header closeButton>
          <Modal.Title> Bevestig het verwijderen </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Placeholder as={Modal.Body} animation="glow">
            {modalContent}
          </Placeholder>
        </Modal.Body>
        <Modal.Footer>{footerContent}</Modal.Footer>
      </Modal>
    </div>
  );
}
