"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./UnsubscribeForm.module.css";
import SubscriptionForm from "../categories/CategoriesComponent";
import AlertComponent from "../alert/AlertComponent";
import Cookies from "js-cookie";

/**
 * UnsubscribeForm component for handling user unsubscription and providing relevant UI.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.userid - User ID.
 * @param {string} props.emailid - Email ID.
 * @returns {JSX.Element} - UnsubscribeForm component.
 */
export default function UnsubscribeForm({ userid, emailid }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [subscribersList, setSubscribersList] = useState();
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [subs, setSubs] = useState([]);
  const [name, setName] = useState("");
  const [warning, setWarning] = useState({ type: "", message: "" });
  const token = Cookies.get("token");

  const reasons = [
    "Te veel e-mails",
    "Irrelevantie",
    "Verandering van interesses",
    "Spam",
    "Anders",
  ];

  /**
   * Handles the complete unsubscription of the user and deletion from the database.
   *
   * @async
   * @function
   * @returns {Promise<boolean>} - True if successful, false otherwise.
   */ const handleCompleteUnsubscribe = async () => {
    try {
      const unsubscribeResponse = await fetch(
        "http://localhost:3001/unsubscribe",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ email: email }),
        }
      );

      if (unsubscribeResponse.status === 200) {
        localStorage.setItem("unsubscribedEmail", email);
        localStorage.setItem("unsubscribeName", name);
        return true;
      } else if (unsubscribeResponse.status === 404) {
        setWarning({
          type: "error",
          message: "Vul een geldige email in.",
        });
        return false;
      } else {
        return false;
      }
    } catch (error) {}
  };

  /**
   * Handles the unsubscription of the user from selected subscriptions.
   *
   * @async
   * @function
   * @returns {Promise<boolean>} - True if successful, false otherwise.
   */ const handleUnsubscribe = async () => {
    try {
      const unsubscribeResponse = await fetch(
        "http://localhost:3001/unsubscribe/subs",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            email: email,
            subscriptions: selectedSubs,
          }),
        }
      );

      if (unsubscribeResponse.status === 200) {
        localStorage.setItem("unsubscribedEmail", email);
        localStorage.setItem("unsubscribeName", name);
        return true;
      } else if (unsubscribeResponse.status === 404) {
        setWarning({
          type: "error",
          message: "Vul een geldige email in.",
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
        message: "Er ging iets mis met het uitschrijven.",
      });
      return false;
    }
  };

  /**
   * Saves unsubscribed subscriptions to the database.
   *
   * @async
   * @function
   * @returns {Promise<boolean>} - True if successful, false otherwise.
   */
  const saveUnsubscribedSubs = async () => {
    try {
      const unsubscribedSubs = await fetch(
        "http://localhost:3001/unsubscribe/lists",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            subscriptions: selectedSubs,
          }),
        }
      );

      if (unsubscribedSubs.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      setWarning({
        type: "error",
        message: "Er ging iets mis met het uitschrijven.",
      });
      return false;
    }
  };

  /**
   * Submits the reason for unsubscription to the database.
   *
   * @async
   * @function
   * @returns {Promise<boolean>} - True if successful, false otherwise.
   */ const handleReasonSubmit = async () => {
    try {
      const reasonResponse = await fetch("http://localhost:3001/reason", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ reden: reason }),
      });

      if (reasonResponse.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      setWarning({
        type: "error",
        message: "Er ging iets mis met het uitschrijven.",
      });
      return false;
    }
  };

  /**
   * Fetches user subscriptions and sets the state when a subscription is selected.
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
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

        const response = await fetch(`http://localhost:3001/${userid}/subs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) {
              setWarning({
                type: "error",
                message: "Vul een geldige email in.",
              });
              throw new Error(
                `Something went wrong with fetching the subs: ${response.status} ${response.statusText}`
              );
            }
            return response.json();
          })
          .then((data) => {
            setName(data.name);
            setSubs(data.subscription);
            setEmail(data.email);
            setSubscribersList(
              <SubscriptionForm
                subscribers={data.subscription}
                setValue={changeValue}
                selectedSubscribers={selectedSubs}
              />
            );
          })
          .catch(() => {});
      }
    };
    try {
      getAuth();
    } catch (error) {}
  }, [selectedSubs]);

  /**
   * Handles the change of checkbox value for selected subscriptions.
   *
   * @function
   * @param {Event} event - The checkbox change event.
   * @returns {void}
   */
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
  };

  /**
   * Handles the form submission for unsubscription.
   *
   * @async
   * @function
   * @param {Event} e - The form submit event.
   * @returns {void}
   */ const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubs || !reason) {
      setWarning({
        type: "error",
        message: "Selecteer minstens een abonnement en een reden.",
      });
    } else {
      try {
        if (subs.length === selectedSubs.length) {
          const complete = await handleCompleteUnsubscribe();
          const save = await saveUnsubscribedSubs();
          if (complete && save) {
            const reason = await handleReasonSubmit();
            if (reason) {
              localStorage.setItem(
                "unsubscribedSubs",
                JSON.stringify(selectedSubs)
              );
              router.push(`/analyse/unsubscribe/${emailid}/${userid}`);
            }
          }
        } else {
          const complete = await handleUnsubscribe();
          const save = await saveUnsubscribedSubs();
          if (complete && save) {
            const reason = await handleReasonSubmit();
            if (reason) {
              localStorage.setItem(
                "unsubscribedSubs",
                JSON.stringify(selectedSubs)
              );
              router.push(`/analyse/unsubscribe/${emailid}/${userid}`);
            }
          }
        }
      } catch (error) {
        setWarning({
          type: "error",
          message: "Er ging iets mis met het uitschrijven.",
        });
      }
    }
  };

  /**
   * Renders the list of unsubscribe reasons and associated UI elements.
   *
   * @function
   * @returns {JSX.Element} - JSX element containing unsubscribe reasons and UI elements.
   */
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
                        onChange={handleEigenRedenChange}
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
      return <></>;
    }
  };

  return (
    <div className="d-flex align-items-center flex-column">
      <AlertComponent notification={warning} />
      <h1 className="mb-4 mt-3">Uitschrijven</h1>
      <form>
        <label className="form-label">Email-adres</label>
        <div className={`mb-3 d-flex justify-content-row `}>
          <input
            type="email"
            className={`form-control w-150`}
            value={email}
            required={true}
          />
        </div>
        {subscribersList}
        {showRedenen()}
      </form>
    </div>
  );
}
