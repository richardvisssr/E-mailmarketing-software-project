"use client";
import { useState } from "react";
export default function UitschrijfForm({}) {
  const [email, setEmail] = useState("");
  const [reden, setReden] = useState("");

  const handleUnsubscribe = async () => {
    try {
      const unsubscribeResponse = await fetch(
        "http://localhost:3001/unsubscribe",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );

      if (unsubscribeResponse.status === 200) {
        console.log("Subscriber removed");
        return true;
      } else if (unsubscribeResponse.status === 404) {
        console.log("Subscriber not found");
        return false;
      } else {
        console.log("Failed to unsubscribe");
        return false;
      }
    } catch (error) {
      console.error("Error during unsubscribe:", error);
    }
  };

  const handleReasonSubmit = async () => {
    try {
      const reasonResponse = await fetch("http://localhost:3001/reason", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reden }),
      });

      if (reasonResponse.status === 200) {
        console.log("Reason added");
        return true;
      } else {
        console.log("Failed to add reason");
        return false;
      }
    } catch (error) {
      console.error("Error during reason submission:", error);
    }
  };

  const changeEmail = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const changeReason = (e) => {
    e.preventDefault();
    setReden(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sub = await handleUnsubscribe();
    console.log(sub);
    if (sub) {
      const reason = await handleReasonSubmit();
      console.log("iehogbeiong");
      if (reason) {
        console.log("Reason added");
      }
    }
  };

  return (
    <div className="d-flex align-items-center flex-column">
      <h1 className="mb-4">Uitschrijven</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input type="email" className="form-control" onChange={changeEmail} />
        </div>
        <div className="mb-3">
          <label className="form-label">Geef hier uw reden op</label>
          <textarea
            className="form-control"
            rows="3"
            onChange={changeReason}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Verstuur
        </button>
      </form>
    </div>
  );
}
