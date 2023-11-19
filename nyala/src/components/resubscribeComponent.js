"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./resubscribeComponent.module.css";

export default function resubscribe({}) {
  const router = useRouter();
  const [melding, setMelding] = useState({ type: "", bericht: "" });

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
        setMelding({
          type: "foutmelding",
          bericht: "Er is iets misgegaan met het herinschrijven.",
        });
      }
    } else {
      setMelding({
        type: "foutmelding",
        bericht: "Schrijf je eerst uit met je email voordat je hier kom.",
      });
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
        console.log("U bent weer ingeschreven");
        return true;
      } else {
        console.log("Er is iets misgegaan met het herinschrijven");
        return false;
      }
    } catch (error) {
      console.error("Error tijdens inschrijven:", error);
      return false;
    }
  };

  return (
    <div>
      <div className="mt-3 d-flex justify-content-center">
        <div>
          {melding.type !== "succes" ? (
            <></>
          ) : (
            <div
              className="alert alert-success d-flex justify-content-around"
              role="alert"
            >
              <p>{melding.bericht}</p>
              <i className="bi bi-check"></i>
            </div>
          )}
        </div>
        <div>
          {melding.type !== "foutmelding" ? (
            <></>
          ) : (
            <div
              className="alert alert-danger d-flex justify-content-around"
              role="alert"
            >
              <p>{melding.bericht}</p>
              <i className="bi bi-exclamation-triangle"></i>
            </div>
          )}
        </div>
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
    </div>
  );
}
