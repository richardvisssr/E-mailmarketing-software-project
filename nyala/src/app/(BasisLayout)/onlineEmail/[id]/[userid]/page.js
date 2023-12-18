"use client";
import { useEffect, useState } from "react";
import Loading from "@/app/(BasisLayout)/loading";
import Cookies from "js-cookie";

export default function Page({ params }) {
  const { id } = params;
  const { userid } = params;
  const [email, setEmail] = useState(null);
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
            }
          }
        )
          .then((response) => response.json())
          .then((data) => {
            setEmail(data);
          })
          .catch((error) => {
            console.error("Error fetching email:", error);
          });


      }
    };

    getAuth();
  }, []);

  return (
    <main>
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
