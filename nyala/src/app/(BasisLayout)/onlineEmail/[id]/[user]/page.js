"use client";
import { useEffect, useState } from "react";

export default function Page({ params }) {
  const { id } = params;
  const { user } = params;
  const [email, setEmail] = useState(null);
  console.log(user);

  useEffect(() => {
    fetch(`http://localhost:3001/mail/getEmail/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setEmail(data);
      })
      .catch((error) => {
        console.error("Error fetching email:", error);
        return null;
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
          <div>
            <a
              style={{ textDecoration: "none", color: "#333" }}
              href={`http://localhost:3000/unsubscribe?email=${decodeURIComponent(
                user
              )}`}
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
