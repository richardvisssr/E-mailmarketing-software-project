"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./resubscribeComponent.module.css";

export default function resubscribe({}) {
  const router = useRouter();
  const [warning, setWarning] = useState(null);

  const handleUndo = async () => {
    const unsubscribedEmail = localStorage.getItem("unsubscribedEmail");
    const unsubscribedSubs = localStorage.getItem("unsubscribedSubs");
    console.log(unsubscribedEmail, unsubscribedSubs);
    if (unsubscribedEmail && unsubscribedSubs) {
      const subsArray = JSON.parse(unsubscribedSubs);
      const success = await resubscribe(unsubscribedEmail, subsArray);
      if (success) {
        localStorage.removeItem("unsubscribedEmail");
        localStorage.removeItem("unsubscribedSubs");
        router.push("/thuispagina");
      } else {
        setWarning(
          <div className="d-flex justify-content-center">
            <p className={styles.warningText}>Failed to resubscribe</p>
          </div>
        );
      }
    } else {
      setWarning(
        <div className="d-flex justify-content-center">
          <p className={styles.warningText}>Enter a valid email</p>
        </div>
      );
    }
  };

  const resubscribe = async (email, subs) => {
    try {
      const reasonResponse = await fetch(
        "http://localhost:3001/subscribers/add", // Add "/api" to the endpoint path
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, abonnementen: subs }), // Fix the property name here
        }
      );

      if (reasonResponse.status === 200) {
        console.log("You have been resubscribed");
        return true;
      } else {
        console.log("Failed to resubscribe");
        return false;
      }
    } catch (error) {
      console.error("Error during resubscription:", error);
      return false;
    }
  };

  return (
    <div>
      <div className="mt-3 d-flex justify-content-center">
        <p className={`${styles.succesText}`}>
          U bent succesvol uitgeschreven{" "}
        </p>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <p className={`${styles.customText}`}>
          Heb je jezelf per ongeluk verkeerd uitgeschreven?
        </p>
        <button
          className={`btn ${styles.knopPrimary} ms-3`}
          onClick={handleUndo}
        >
          Klik hier om u weer in te schrijven
        </button>
      </div>
      {warning}
    </div>
  );
}
