"use client";

import { useEffect, useState } from "react";
import styles from "./views.module.css";

export default function SubscribersTable() {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/subscribers/all")
      .then((response) => response.json())
      .then((data) => setSubscribers(data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-hover">
          <caption>Lijst met alle geabonneerde leden</caption>
          <thead>
            <tr>
              <th scope="col">Naam</th>
              <th scope="col">Email</th>
              <th scope="col">Abonnementen</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            {subscribers.map((subscriber) => (
              <tr>
                <td>{subscriber.name}</td>
                <td>{subscriber.email}</td>
                <td>{subscriber.subscription.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
