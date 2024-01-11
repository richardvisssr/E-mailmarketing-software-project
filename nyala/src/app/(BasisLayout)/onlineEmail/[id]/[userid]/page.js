"use client";
import { useEffect, useState } from "react";
import Loading from "@/app/(BasisLayout)/loading";
import Cookies from "js-cookie";
import AlertComponent from "@/components/alert/AlertComponent";
import styles from "./onlineEmail.module.css";

export default function Page({ params }) {
  const { id, userid } = params;
  const [email, setEmail] = useState(null);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [subscriber, setSubscriber] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    // Fetch email
    const getAuth = async () => {
      const response = await fetch("http://localhost:3001/tempAuth", {
        method: "GET",
      });

      const data = await response.json();

      if (response.status === 200) {
        const token = data.token;
        Cookies.set("token", token, {
          secure: true,
          sameSite: "strict",
          domain: "localhost",
          path: "/",
        });

        const response = await fetch(
          `http://localhost:3001/mail/getEmail/${id}`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            const analysisPageUrl = `http://localhost:3000/analyse/`;
            const personalizedHtmlText = data.html.replace(
              /href="([^"]*)"/g,
              function (match, originalUrl) {
                return `href="${analysisPageUrl}${encodeURIComponent(
                  originalUrl
                )}/${id}/1"`;
              }
            );

            // Loop over each subscriber
            data.subscribers.forEach((subscriber) => {
              // Only personalize the header text for the matching subscriber
              if (userid === subscriber.id || userid === subscriber._id) {
                let personalizedHeaderText = data.headerText.replace(
                  "{name}",
                  subscriber.name
                );

                personalizedHeaderText = personalizedHeaderText.replace(
                  /\n/g,
                  "<br>"
                );

                personalizedHeaderText = personalizedHeaderText.replace(
                  "{image}",
                  `<img src="/xtend-logo.webp" alt="Xtend Logo" style="width: 100px; height: auto;" />`
                );

                // Update the email data with the personalized header text
                setEmail({
                  ...data,
                  headerText: personalizedHeaderText,
                  html: personalizedHtmlText,
                });
              }
            });
          })
          .catch((error) => {
            setNotification({
              type: "error",
              message: "Er is iets foutgegaan tijdens het inzien van de mail",
            });
          });
      }
    };

    getAuth();
  }, []);

  return (
    <main>
      {notification != "" && <AlertComponent notification={notification} />}
      {email ? (
        <div>
          {email.showHeader && (
            <div
              dangerouslySetInnerHTML={{ __html: email.headerText }}
              style={{
                textAlign: "center",
                padding: "10px",
              }}
            />
          )}
          <div
            className={styles.emailContent}
            dangerouslySetInnerHTML={{ __html: email.html }}
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
