"use client";
import { useEffect, useState } from "react";
import Loading from "@/app/(BasisLayout)/loading";

export default function Page({ params }) {
  const { id } = params;
  const { userid } = params;
  const [email, setEmail] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/mail/getEmail/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setEmail(data);
      })
      .catch((error) => {
        console.error("Error fetching email:", error);
      });
      fetch(`http://localhost:3001/trackOnlineView/${id}`)
      .then((data) => {
        console.log(data);
      })
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
        <Loading/>
      )}
    </main>
  );
}
