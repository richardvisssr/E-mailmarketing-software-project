"use client";
import React, { useState, useEffect } from "react";

function AbonnementSelecteren({ html }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [subscribers, setSubscribers] = useState([]);

  console.log("html", html);
  useEffect(() => {
    // Fetch the list of available subscriptions from the server using an HTTP request.
    fetch("/api/subscriptions")
      .then((response) => response.json())
      .then((data) => setSubscriptions(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedSubscription) {
      // Fetch the list of subscribers for the selected subscription using another HTTP request.
      fetch(`/api/subscriptions/${selectedSubscription.id}/subscribers`)
        .then((response) => response.json())
        .then((data) => setSubscribers(data))
        .catch((error) => console.error(error));
    }
  }, [selectedSubscription]);

  const handleSubscriptionChange = (event) => {
    const subscriptionId = event.target.value;
    const subscription = subscriptions.find((s) => s.id === subscriptionId);
    setSelectedSubscription(subscription);
  };

  const handleSendEmailClick = async () => {
    if (selectedSubscription) {
      try {
        const response = await fetch("/api/sendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: html }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Email sent successfully");
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }
  };

  return (
    <div>
      <label htmlFor="subscription">Select a subscription:</label>
      <select id="subscription" onChange={handleSubscriptionChange}>
        <option value="">-- Select a subscription --</option>
        {subscriptions.map((subscription) => (
          <option key={subscription.id} value={subscription.id}>
            {subscription.name}
          </option>
        ))}
      </select>

      {selectedSubscription && (
        <div>
          <h2>Subscribers of {selectedSubscription.name}:</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td>{subscriber.name}</td>
                  <td>{subscriber.email}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleSendEmailClick}>Verstuur Mail</button>
        </div>
      )}
    </div>
  );
}

export default AbonnementSelecteren;
