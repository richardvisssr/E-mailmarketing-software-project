"use client";
import { useEffect, useState } from "react";
import Loading from "@/app/(BasisLayout)/loading";
import AlertComponent from "@/components/alert/AlertComponent";

export default function Page({ params }) {
  const { id, userid } = params;
  const [email, setEmail] = useState(null);
  const [notification, setNotification] = useState({ type: "", message: "" });

  useEffect(() => {
    fetch(`http://localhost:3001/mail/getEmail/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setEmail(data);
      })
      .catch((error) => {
        setNotification({ type: "error", message: "Er is een fout opgetreden bij het ophalen van de e-mail." });
      });
  }, []);

  return (
    <main>
      {notification.type && notification.message && (
        <AlertComponent type={notification.type} message={notification.message} />
      )}

      {email ? (
        <div>
          <div
            dangerouslySetInnerHTML={{ __html: email.html }}
            style={{
              textAlign: "center",
              padding: "10px",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              backgroundColor: "#f1f1f1",
              fontFamily: "Arial",
              textAlign: "center",
            }}
          >
            <a
              style={{
                backgroundColor: "#f1f1f1",
                textAlign: "center",
                padding: "10px",
              }}
              href={`http://localhost:3000/unsubscribe/${id}/${userid}`}
            >
              Uitschrijven
            </a>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </main>
  );
}
