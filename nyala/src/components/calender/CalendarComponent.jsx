"use client";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { Modal, Form, Button } from "react-bootstrap";
import styles from "./Calendar.module.css";

function MailCalendar(props) {
  const emails = props.emails;
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showFutureMails, setShowFutureMails] = useState(false);
  const [emailDate, setEmailDate] = useState("");
  const [wentWrong, setWentWrong] = useState(false);
  const [error, setError] = useState("");
  const [emailTitle, setEmailTitle] = useState("");
  const [id, setId] = useState("");
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  lastDayOfMonth.setHours(23, 59, 59, 999);

  const updateEmailDate = (e) => {
    setEmailDate(e.target.value);
  };

  const handleOpenModal = (id, title) => {
    setId(id);
    setEmailTitle(title);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    if (emailDate === "") {
      setWentWrong(true);
      setError("Vul een datum in");
      return;
    }

    const response = await fetch(`http://127.0.0.1:3001/updateMail`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        date: emailDate,
      }),
    });

    if (response.status === 200) {
      props.shouldUpdate();
      setId("");
      setEmailDate("");
      setEmailTitle("");
      setShowModal(false);
    } else {
      setWentWrong(true);
      setError(
        "Er is iets misgegaan met het aanpassen van de datum. Probeer het later opnieuw"
      );
    }
  };

  const handlePreviousMonth = () => {
    const previousMonth = new Date(date);
    previousMonth.setMonth(date.getMonth() - 1);
    setDate(previousMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(date);
    nextMonth.setMonth(date.getMonth() + 1);
    setDate(nextMonth);
  };

  const filteredMails = emails.plannedMails.filter((email) => {
    const emailDate = new Date(email.date);
    return (
      (!showFutureMails || emailDate.getTime() >= new Date().getTime()) &&
      emailDate.getTime() >= firstDayOfMonth.getTime() &&
      emailDate.getTime() <= lastDayOfMonth.getTime()
    );
  });

  const formatTime = (dateString) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const time = new Date(dateString).toLocaleString("en-US", options);
    return time;
  };

  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    const date = new Date(dateString);
    const formattedDate = date.toLocaleString("nl-NL", options);
    return formattedDate;
  };

  return (
    <div>
      <div className="row justify-content-center align-items-center mb-3">
        <div className="col-auto">
          <i
            className={`bi bi-arrow-left-circle-fill ${styles.icon}`}
            onClick={handlePreviousMonth}
          ></i>
        </div>
        <div className="col-auto">
          <h4 className="mb-0 ms-1">{`${date
            .toLocaleString("default", {
              month: "long",
            })
            .charAt(0)
            .toUpperCase()}${date
            .toLocaleString("default", {
              month: "long",
            })
            .slice(1)} ${currentYear}`}</h4>
        </div>
        <div className="col-auto">
          <i
            className={`bi bi-arrow-right-circle-fill ${styles.icon}`}
            onClick={handleNextMonth}
          ></i>
        </div>
      </div>

      <div className="table-responsive p-5">
        <div className="form-check mb-3">
          {" "}
          <input
            className="form-check-input"
            type="checkbox"
            id="showFutureMailsCheckbox"
            checked={showFutureMails}
            onChange={() => setShowFutureMails(!showFutureMails)}
          />
          <label className="form-check-label" htmlFor="showFutureMailsCheckbox">
            Toon toekomstige mails
          </label>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Event</th>
              <th scope="col">Datum</th>
              <th scope="col">Tijd</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {filteredMails.map((mail) => (
              <tr key={mail.date}>
                <td>{mail.title}</td>
                <td>{formatDate(mail.date)}</td>
                <td>{formatTime(mail.date)}</td>
                <td className="text-end">
                  <i
                    className={`bi bi-calendar-week-fill ${styles.icon}`}
                    onClick={() => handleOpenModal(mail.id, mail.title)}
                    style={{ cursor: "pointer" }}
                  ></i>
                  <i
                    className={`bi bi-trash3-fill ${styles.icon}`}
                    onClick={() => props.deleteMail(mail.id)}
                    style={{
                      marginLeft: "2em",
                      marginRight: "1em",
                      cursor: "pointer",
                    }}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        {wentWrong && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <Modal.Header closeButton>
          <Modal.Title>
            Wil je de datum voor '{emailTitle}' aanpassen?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="emailDate">
            <Form.Label>Nieuwe datum</Form.Label>
            <Form.Control
              type="datetime-local"
              value={emailDate}
              onChange={(e) => updateEmailDate(e)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSaveChanges(id)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MailCalendar;
