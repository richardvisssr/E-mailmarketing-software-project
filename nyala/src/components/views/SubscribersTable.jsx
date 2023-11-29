"use client";

import { useEffect, useState } from "react";
import AlertComponent from "../alert/AlertComponent";
import styles from "./Views.module.css";

export default function SubscribersTable() {
  const [subscribers, setSubscribers] = useState([]);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/subscribers/all")
      .then((response) => response.json())
      .then((data) => setSubscribers(data))
      .catch((error) => console.log(error));
  }, []);

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
                    onClick={() => handleShow(subscriber.email, mailList)}
                  ></i>
                </td>
                <td className="hover-icon">
                  <i
                    className={`bi bi-trash-fill ${styles.icon}`}
                    onClick={() => handleShow(subscriber.email, mailList)}
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
