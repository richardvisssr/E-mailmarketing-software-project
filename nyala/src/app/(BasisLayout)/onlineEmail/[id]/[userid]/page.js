"use client";
import { useEffect, useState } from "react";

export default function Page({ params }) {
  const { id } = params;
  const { userid } = params;
  const [email, setEmail] = useState(null);
  const [subscriber, setSubscriber] = useState(null);

  useEffect(() => {
    // Fetch email
    fetch(`http://localhost:3001/mail/getEmail/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setEmail(data);
      })
      .catch((error) => {
        console.error("Error fetching email:", error);
      });
  }, []);

  return (
    <main>
      {email ? (
        <div>
          <div
            dangerouslySetInnerHTML={{ __html: email.html }}
            style={{
              backgroundColor: "#f1f1f1",
              textAlign: "center",
              padding: "10px",
            }}
          />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <a
              style={{
                backgroundColor: "#f1f1f1",
                textAlign: "center",
                padding: "10px",
              }}
              href={`http://localhost:3000/unsubscribe/${userid}`}
            >
              Uitschrijven
            </a>
          </div>
        </div>
      ) : (
        "Loading..."
      )}
    </main>
  );
}
