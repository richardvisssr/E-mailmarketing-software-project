"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./uitschrijfForm.module.css";
import AbonnementenFormulier from "./categorieeënComponent";

export default function UitschrijfForm({}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [reden, setReden] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [warning, setWarning] = useState(null);
  const [abonnementen, setAbonnementen] = useState([]);
  const [abbonementenLijst, setAbonnementenLijst] = useState();
  const [geselecteerdeAbonnementen, setGeselecteerdeAbonnementen] = useState(
    []
  );

  const reasons = [
    "Te veel e-mails",
    "Irrelevantie",
    "Verandering van interesses",
    "Spam",
    "Anders",
  ];

  const handleCompleteUnsubscribe = async () => {
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
        localStorage.setItem("unsubscribedEmail", email);
        return true;
      } else if (unsubscribeResponse.status === 404) {
        console.log("Subscriber not found");
        setWarning(
          <div>
            <p className={styles.warningText}>Vul een geldige email in</p>
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

  const handleUnsubscribe = async () => {
    try {
      const unsubscribeResponse = await fetch(
        "http://localhost:3001/unsubscribe/subs",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            abonnementen: geselecteerdeAbonnementen,
          }),
        }
      );

      if (unsubscribeResponse.status === 200) {
        console.log("Subscriber removed");
        setWarning(null);
        localStorage.setItem("unsubscribedEmail", email);
        return true;
      } else if (unsubscribeResponse.status === 404) {
        console.log("Subscriber not found");
        setWarning(
          <div>
            <p className={styles.warningText}>Vul een geldige email in</p>
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
    const geselecteerdeReden =
      reden === "Anders" ? customReason : reden === "" ? null : reden;

    try {
      const reasonResponse = await fetch("http://localhost:3001/reason", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reden: geselecteerdeReden }),
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

  const getAbonnementen = async (e) => {
    e.preventDefault();
    if (!email) {
      console.error("Email is required");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/${email}/subs`);
      const abonnees = await response.json();
      setAbonnementenLijst(
        <AbonnementenFormulier abonnees={abonnees} setValue={changeValue} />
      );
    } catch (error) {
      console.error("Error during subscriber retrieval:", error);
    }
  };

  const changeValue = (event) => {
    const { value, checked } = event.target;

    setGeselecteerdeAbonnementen((prevSelection) => {
      // Hier worden onderscheid gemaakt of de select al geselecteerd is of niet
      if (checked) {
        return [...prevSelection, value];
      } else {
        return prevSelection.filter((sub) => sub !== value);
      }
    });
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
    if (abbonementenLijst.length === geselecteerdeAbonnementen.length) {
      const complete = await handleCompleteUnsubscribe();
      if (complete) {
        const reason = await handleReasonSubmit();
        if (reason) {
          console.log("Reason added");
          router.push("../uitgeschreven");
        }
      }
    } else {
      const sub = await handleUnsubscribe();
      if (sub) {
        const reason = await handleReasonSubmit();
        if (reason) {
          console.log("Reason added");
          router.push("../uitgeschreven");
        }
      }
    }
  };

  console.log(geselecteerdeAbonnementen);

  return (
    <div className="d-flex align-items-center flex-column">
      <h1 className="mb-4 mt-3">Uitschrijven</h1>
      <form>
        <label className="form-label">Email-adres</label>
        <div className="mb-3 d-flex justify-content-row">
          <input
            type="email"
            className="form-control w-150"
            onChange={changeEmail}
          />
          <button
            onClick={getAbonnementen}
            className={`ms-4 btn ${styles.knopPrimary}`}
          >
            Ophalen
          </button>
        </div>
        {warning}
        {abbonementenLijst}
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
                    className={` me-2 control ${styles.customRadio}`}
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
        <button onClick={handleSubmit} className={`btn ${styles.knopPrimary}`}>
          Schrijf uit
        </button>
      </form>
    </div>
  );
}
