"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./uitschrijfForm.module.css";

export default function UitschrijfForm({}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [reden, setReden] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [warning, setWarning] = useState(null);

  const reasons = ["Te veel mails", "Ik heb geen interesse meer", "Anders"];

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
        setWarning(null);
        return true;
      } else if (unsubscribeResponse.status === 404) {
        console.log("Subscriber not found");
        setWarning(
          <div className="alert alert-danger mt-3" role="alert">
            Vul een geldig email adres in
          </div>
        );
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

  const changeReason = (selectedReason) => {
    setReden(selectedReason);

    if (selectedReason === "Anders") {
      setCustomReason("");
    }
  };

  const handleCustomReasonChange = (e) => {
    setCustomReason(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sub = await handleUnsubscribe();
    console.log(sub);
    if (sub) {
      const reason = await handleReasonSubmit();
      if (reason) {
        console.log("Reason added");
        router.push("../uitgeschreven");
      }
    }
  };

  return (
    <div className="d-flex align-items-center flex-column">
      <h1 className="mb-4 mt-3">Uitschrijven</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email adres</label>
          <input
            type="email"
            className="form-control w-150"
            onChange={changeEmail}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Selecteer uw reden</label>
          <ul>
            {reasons.map((reason, index) => (
              <li
                key={index}
                className={`${styles.customList} d-flex align-items-center mb-2`}
              >
                <label className="d-flex align-items-center">
                  <input
                    type="radio"
                    name="unsubscribeReason"
                    value={reason}
                    onChange={() => changeReason(reason)}
                    className="me-2 form-check-input"
                  />
                  {reason === "Anders" && (
                    <div className="d-flex align-items-center">
                      <label className="me-2">Anders:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Typ hier uw reden"
                        value={customReason}
                        onChange={handleCustomReasonChange}
                      />
                    </div>
                  )}
                  {reason !== "Anders" && <span>{reason}</span>}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <button type="submit" className={`btn btn-primary`}>
          Verstuur
        </button>
      </form>
      {warning}
    </div>
  );
}
