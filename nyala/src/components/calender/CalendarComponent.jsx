"use client";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import styles from "./Calendar.module.css";

function EventCalendar(props) {
  const emails = props.emails;
  const [date, setDate] = useState(new Date());
  const [showFutureMails, setShowFutureMails] = useState(false); // Added checkbox state
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  lastDayOfMonth.setHours(23, 59, 59, 999);

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
      (!showFutureMails || emailDate.getTime() >= new Date().getTime()) && // Added condition to filter future mails
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



  console.log("filteredMails", filteredMails);

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
          {/* Added checkbox */}
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
                    onClick={() => console.log(`${mail.title} - View`)}
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
    </div>
  );
}

export default EventCalendar;
