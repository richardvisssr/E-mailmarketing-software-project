"use client";

import { useEffect, useState } from "react";

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
      <div className="table-responsive p-5">
        <table className="table table-hover">
          <caption>Lijst met alle geabonneerde leden</caption>
          <thead>
            <tr>
              <th scope="col">Naam</th>
              <th scope="col">Email</th>
              <th scope="col">Abonnementen</th>
              <th> </th>
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
                    className="bi bi-trash-fill"
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
