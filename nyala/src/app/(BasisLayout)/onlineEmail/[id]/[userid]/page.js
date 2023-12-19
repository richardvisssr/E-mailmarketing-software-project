"use client";
import { useEffect, useState } from "react";
import Loading from "@/app/(BasisLayout)/loading";
import AlertComponent from "@/components/alert/AlertComponent";
import styles from "./onlineEmail.module.css";

export default function Page({ params }) {
  const { id, userid } = params;
  const [email, setEmail] = useState(null);
  const [notification, setNotification] = useState({ type: "", message: "" });

  useEffect(() => {
    fetch(`http://localhost:3001/mail/getEmail/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Er is een fout opgetreden bij het ophalen van de e-mail.");
        }
        return response.json();
      })
      .then((data) => {
        // Replace href attributes in the email's HTML
        const analysisPageUrl = `http://localhost:3000/analyse/`;
        const personalizedHtmlText = data.html.replace(
          /href="([^"]*)"/g,
          function (match, originalUrl) {
            return `href="${analysisPageUrl}${encodeURIComponent(
              originalUrl
            )}/${id}/1"`;
          }
        );

        setEmail(personalizedHtmlText);
      })
      .catch((error) => {
        setNotification({
          type: "error",
          message: error.message,
        });
      });
  }, []);

  return (
    <main>
      {notification.message && <AlertComponent notification={notification} />}

      {email ? (
        <div>
          <div
            className={styles.emailContent}
            dangerouslySetInnerHTML={{ __html: email }}
          />
          <div className={styles.unsubscribeContainer}>
            <a
              className={styles.unsubscribeLink}
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