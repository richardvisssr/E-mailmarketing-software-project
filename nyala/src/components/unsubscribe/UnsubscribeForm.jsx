"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./UnsubscribeForm.module.css";
import SubscriptionForm from "../categories/CategoriesComponent";

export default function UnsubscribeForm({ userid }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [subscribersList, setSubscribersList] = useState();
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [subs, setSubs] = useState([]);
  const [warning, setWarning] = useState({ type: "", bericht: "" });

  // Dit zijn de redenen gekregen van de PO
  const reasons = [
    "Te veel e-mails",
    "Irrelevantie",
    "Verandering van interesses",
    "Spam",
    "Anders",
  ];

  // useEffect(() => {
  //   // Fetch subscriber
  //   fetch(`http://localhost:3001/mail/subscribers/${userid}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setEmail(data.email);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching subscriber:", error);
  //     });
  // }, []);

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
        localStorage.setItem("unsubscribedEmail", email);
        return true;
      } else if (unsubscribeResponse.status === 404) {
        setWarning({
          type: "error",
          bericht: "Vul een geldige email in.",
        });
        return false;
      } else {
        return false;
      }
    } catch (error) {}
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
            subscriptions: selectedSubs,
          }),
        }
      );

      if (unsubscribeResponse.status === 200) {
        localStorage.setItem("unsubscribedEmail", email);
        return true;
      } else if (unsubscribeResponse.status === 404) {
        setWarning({
          type: "error",
          bericht: "Vul een geldige email in.",
        });
        return false;
      } else if (unsubscribeResponse.status === 400) {
        return false;
      } else {
        return false;
      }
    } catch (error) {
      setWarning({
        type: "error",
        bericht: "Er ging iets mis met het uitschrijven.",
      });
      return false;
    }
  };

  // Reden van uitschrijven toevoegen aan de database
  const handleReasonSubmit = async () => {
    const geselecteerdeReden =
      reason === "Anders" ? customReason : reason === "" ? null : reason;

    try {
      const reasonResponse = await fetch("http://localhost:3001/reason", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reden: geselecteerdeReden }),
      });

      if (reasonResponse.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      setWarning({
        type: "error",
        bericht: "Er ging iets mis met het uitschrijven.",
      });
      return false;
    }
  };

  // Ophalen van abonnementen van de gebruiker
  useEffect(() => {
    fetch(`http://localhost:3001/mail/subscribers/${userid}`)
      .then((response) => {
        if (!response.ok) {
          setWarning({
            type: "error",
            bericht: "Vul een geldige email in.",
          });
        }
        return response.json();
      })
      .then((data) => {
        setSubs(data);
      })
      .catch((error) => {
        setWarning({
          type: "error",
          bericht: `error ${error}`,
        });
      });
  }, []);

  const changeValue = (event) => {
    const { value, checked } = event.target;
    setSelectedSubs((prevSelection) => {
      if (checked) {
        return [...prevSelection, value];
      } else {
        return prevSelection.filter((sub) => sub !== value);
      }
    });
  };

  const changeReason = (selectedReason) => {
    setReason(selectedReason);

    if (selectedReason === "Anders") {
      setCustomReason("");
    }
  };

  const handleeigenRedenChange = (e) => {
    setCustomReason(e.target.value);
  };

  // Hierin worden alle functies op zijn eigen tijd aangeroepen
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSubs.length === 0 || reason === "") {
      setWarning({
        type: "error",
        bericht: "Selecteer minstens een abonnement en een reden.",
      });
    } else {
      try {
        if (subs.length === selectedSubs.length) {
          const complete = await handleCompleteUnsubscribe();
          if (complete) {
            const reason = await handleReasonSubmit();
            if (reason) {
              localStorage.setItem(
                "unsubscribedSubs",
                JSON.stringify(selectedSubs)
              );
              router.push("../unsubscribed");
            }
          }
        } else {
          const sub = await handleUnsubscribe();
          if (sub) {
            const reason = await handleReasonSubmit();
            if (reason) {
              localStorage.setItem(
                "unsubscribedSubs",
                JSON.stringify(selectedSubs)
              );
              router.push("../unsubscribed");
            }
          }
        }
      } catch (error) {
        setWarning({
          type: "error",
          bericht: "Er ging iets mis met het uitschrijven.",
        });
      }
    }
  };

  const showRedenen = () => {
    if (subscribersList) {
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
                        onChange={handleeigenRedenChange}
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
        {warning.type !== "succes" ? (
          <></>
        ) : (
          <div
            className="alert alert-success d-flex justify-content-around"
            role="alert"
          >
            <p>{warning.bericht}</p>
            <i className="ms-2 bi bi-check"></i>
          </div>
        )}
      </div>
      <div>
        {warning.type !== "wrong" ? (
          <></>
        ) : (
          <div
            className="alert alert-danger d-flex justify-content-around"
            role="alert"
          >
            <p>{warning.bericht}</p>
            <i className="ms-2 bi bi-exclamation-triangle"></i>
          </div>
        )}
      </div>
      <h1 className="mb-4 mt-3">Uitschrijven</h1>
      <form>
        <label className="form-label">Email-adres</label>
        <div className={`mb-3 d-flex justify-content-row `}>
          <input
            type="email"
            className={`form-control w-150`}
            value={subs.email}
            required={true}
          />
        </div>
        <SubscriptionForm subscribers={subs.subscription} setValue={changeValue} />
        {showRedenen()}
      </form>
    </div>
  );
}
