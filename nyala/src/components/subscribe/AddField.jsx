import { useEffect, useState } from "react";
import styles from "./AddField.module.css";
import SubscriptionForm from "../categories/CategoriesComponent";
import AlertComponent from "../alert/AlertComponent";

/**
 * Functional component for adding email and subscribing to mailing lists.
 * @returns {JSX.Element} The JSX element representing the component.
 */
export default function ToevoegVeld() {
  const [data, setData] = useState({ email: undefined, list: [], name: "" });
  const [status, setStatus] = useState(false);
  const [lists, setLists] = useState([]);
  const [add, setAdd] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [list, setList] = useState("");

  useEffect(() => {
    /**
     * Function to fetch mailing lists from the server.
     */
    const fetchlists = async () => {
      const response = await fetch("http://localhost:3001/mail/getList");
      const body = await response.json();
      if (!response.ok) {
        setNotification({
          type: "error",
          message: "Er is iets foutgegaan tijdens het ophalen",
        });
      } else if (response.ok && (!body[0] || body[0].mailList === undefined)) {
        setNotification({
          type: "error",
          message: "Er zijn nog geen maillijsten gemaakt.",
        });
      } else {
        setLists(body[0].mailList);
      }
    };
    fetchlists();

    if (status) {
      /**
       * Function to post email data to the server.
       */
      const postEmail = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/subscribers/add`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: data.email,
                name: data.name,
                subscriptions: data.list,
              }),
            }
          );
          if (response.ok) {
            setData({ email: undefined, list: [], name: "" });
            setStatus(false);
            setNotification({
              type: "succes",
              message: "Email succesvol toegevoegd.",
            });
          } else if (!response.ok) {
            setNotification({
              type: "error",
              message:
                "Er heeft zich een fout opgetreden tijdens het toevoegen van de mail.",
            });
          }
        } catch (error) {
          setNotification({
            type: "error",
            message:
              "Er heeft zich een fout opgetreden tijdens het toevoegen van de mail.",
          });
        }
      };
      postEmail();
    }
  }, [status]);

  /**
   * Function to handle the addition of a new email and subscriptions.
   * @param {Object} event - The event object.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    let inLists = true;

    if (data.list.length === 0) {
      inLists = false;
    } else {
      data.list.forEach((list) => {
        if (!lists.includes(list)) {
          inLists = false;
        }
      });
    }

    if (!data.name) {
      setNotification({
        type: "error",
        message: "De naam is niet ingevuld.",
      });
    } else if (!data.email) {
      setNotification({
        type: "error",
        message: "Het emailadres is niet ingevuld.",
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setNotification({
        type: "error",
        message: "Het emailadres is geen valide formaat.",
      });
    } else if (data.list.length === 0) {
      setNotification({
        type: "error",
        message: "Er is geen mailinglist gekozen.",
      });
    } else if (data.list.length > lists.length) {
      setNotification({
        type: "error",
        message: "Er zijn te veel mailinglists gekozen.",
      });
    } else if (inLists === false) {
      setNotification({
        type: "error",
        message: "De gekozen mailinglist bestaat niet.",
      });
    } else {
      setStatus(true);
    }
  };

  /**
   * Function to handle the change in the email input.
   * @param {Object} event - The event object.
   */
  const handleEmailChange = (event) => {
    if (notification.type === "succes") {
      setNotification({ type: "", message: "" });
    }
    setData({ ...data, email: event.target.value, name: data.name });
  };

  /**
   * Function to handle the change in the checkbox for selecting mailing lists.
   * @param {Object} event - The event object.
   */
  const handleCheckboxChange = (event) => {
    if (notification.type === "succes") {
      setNotification({ type: "", message: "" });
    }
    const listName = event.target.value;
    const isSelected = data.list.includes(listName);

    if (isSelected) {
      setData({
        ...data,
        list: [...data.list.filter((list) => list !== listName)],
      });
    } else {
      setData({ ...data, list: [...data.list, listName] });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div>
        <AlertComponent notification={notification} />
        <form
          className={`input-group ${styles.form} d-flex flex-column`}
          onSubmit={handleSubmit}
        >
          <label htmlFor="form" className={`${styles.label} mb-2 rounded`}>
            Vul een naam en email in, om toe te voegen aan een emaillijst
          </label>
          <div id="form">
            <input
              type="text"
              className={`form-control ${styles.entry} p-2 mb-3`}
              placeholder="Name"
              onChange={(e) => setData({ ...data, name: e.target.value })}
              value={data.name || ""}
            />

            <input
              type="text"
              className={`form-control ${styles.entry} p-2 mb-3`}
              placeholder="Email"
              aria-describedby="basic-addon1"
              onChange={handleEmailChange}
              value={data.email || ""}
            />
            <div>
              {Array.isArray(lists) && lists.length > 0 ? (
                <SubscriptionForm
                  subscribers={lists}
                  setValue={handleCheckboxChange}
                  selectedSubscribers={data.list}
                />
              ) : (
                <p>Er zijn geen maillijsten.</p>
              )}
            </div>

            <div className={`${styles.selectContainer}`}></div>
          </div>
          <input
            type="submit"
            className={`btn ${styles.buttonPrimary} rounded mt-4`}
            value="Email toevoegen"
          />
        </form>
      </div>
    </div>
  );
}
