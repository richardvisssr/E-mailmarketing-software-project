"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./uitschrijfForm.module.css";
import AbonnementenFormulier from "./categorieeënComponent";

// Hoofdcomponent voor het uitschrijfformulier
export default function UitschrijfForm({}) {
  // Initialisatie van React-hooks
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [reden, setReden] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [warning, setWarning] = useState(null);
  const [abbonementenLijst, setAbonnementenLijst] = useState();
  const [geselecteerdeAbonnementen, setGeselecteerdeAbonnementen] = useState(
    []
  );
  const [subs, setSubs] = useState([]);

  // Dit zijn de redenen gekregen van de PO
  const reasons = [
    "Te veel e-mails",
    "Irrelevantie",
    "Verandering van interesses",
    "Spam",
    "Anders",
  ];

  // Wanneer de gebruiker zich overal voor wilt uitschrijven en zichzelf wilt verwijderen uit de database
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

  // Wanneer de gebruiker een aantal abonnementen wilt verwijderen
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
            abonnement: geselecteerdeAbonnementen,
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
      } else if (unsubscribeResponse.status === 400) {
        console.log("Failed to unsubscribe");
        setWarning(
          <div>
            <p className={styles.warningText}>Failed to unsubscribe</p>
          </div>
        );
        return false;
      } else {
        console.log("Unexpected error during unsubscribe");
        return false;
      }
    } catch (error) {
      console.error("Error during unsubscribe:", error);
      setWarning(
        <div>
          <p className={styles.warningText}>Error during unsubscribe</p>
        </div>
      );
      return false;
    }
  };

  // Reden van uitschrijven toevoegen aan de database
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

  // Ophalen van abonnementen van de gebruiker
  const getAbonnementen = async (e) => {
    e.preventDefault();
    if (!email) {
      console.error("Email is required");
      return;
    }
    try {
      fetch(`http://localhost:3001/${email}/subs`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to fetch abonnementen: ${response.status} ${response.statusText}`
            );
          }
          return response.json();
        })
        .then((data) => {
          setSubs(data);
          setAbonnementenLijst(
            <AbonnementenFormulier abonnees={data} setValue={changeValue} />
          );
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error("Error during subscriber retrieval:", error);
    }
  };

  const changeValue = (event) => {
    const { value, checked } = event.target;
    setGeselecteerdeAbonnementen((prevSelection) => {
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

  // Hierin worden alle functies op zijn eigen tijd aangeroepen
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(subs);
    if (subs.length === geselecteerdeAbonnementen.length) {
      const complete = await handleCompleteUnsubscribe();
      if (complete) {
        const reason = await handleReasonSubmit();
        if (reason) {
          console.log("Reason added");
          localStorage.setItem(
            "unsubscribedSubs",
            JSON.stringify(geselecteerdeAbonnementen)
          );
          router.push("../uitgeschreven");
        }
      }
    } else {
      const sub = await handleUnsubscribe();
      if (sub) {
        const reason = await handleReasonSubmit();
        if (reason) {
          console.log("Reason added");
          localStorage.setItem(
            "unsubscribedSubs",
            JSON.stringify(geselecteerdeAbonnementen)
          );
          router.push("../uitgeschreven");
        }
      }
    }
  };

  const showRedenen = () => {
    if (abbonementenLijst) {
      return (
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
                    className={`me-2 control ${styles.customRadio}`}
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
          <button
            onClick={handleSubmit}
            className={`btn ${styles.knopPrimary}`}
          >
            Schrijf uit
          </button>
        </div>
      );
    } else {
    }
  };

  return (
    <div className="d-flex align-items-center flex-column">
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
        {abbonementenLijst}
        {showRedenen()}
      </form>
    </div>
  );
}
