"use client";
import { useEffect, useState } from "react";
import Loading from "@/app/(BasisLayout)/loading";
import Cookies from "js-cookie";
import AlertComponent from "@/components/alert/AlertComponent";

export default function Page({ params }) {
  const { id } = params;
  const { userid } = params;
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
            // Loop over each subscriber
            data.subscribers.forEach((subscriber) => {
              // Only personalize the header text for the matching subscriber
              if (userid === subscriber._id) {
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
                });
              }
            });
          })
          .catch((error) => {
            setNotification({
              type: "error",
              message: "Er is iets foutgegaan tijdens het inzien van de mail",
            });
            console.log(error);
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
              href={`http://localhost:3000/unsubscribe/${userid}`}
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
