import { useEffect, useState } from "react";
import styles from "./AddField.module.css";
import Link from "next/link";

export default function SubscribeField(props) {
  const [data, setData] = useState({ email: undefined, name: "" });
  const [status, setStatus] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [lists, setLists] = useState([]);
  const list = props.list;

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
        console.log(body[0].mailList);
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
                subscriptions: [list],
              }),
            }
          );
          if (response.ok) {
            setData({ email: undefined, name: "" });
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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (data.email === "") {
      setNotification({
        type: "error",
        message: "Het emailadres is niet ingevuld.",
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setNotification({
        type: "error",
        message: "Het emailadres is geen valide formaat.",
      });
    } else if (!lists.includes(list)) {
      setNotification({
        type: "error",
        message: "De maillijst bestaat niet.",
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
    setData({ ...data, email: event.target.value });
  };

  const handleNameChange = (event) => {
    if (notification.type === "succes") {
      setNotification({ type: "", message: "" });
    }
    setData({ ...data, name: event.target.value });
  };

  return (
    <>
      {lists.includes(list) ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div>
            <div>
              {notification.type !== "succes" ? (
                <></>
              ) : (
                <div
                  className="alert alert-success d-flex justify-content-around"
                  role="alert"
                >
                  <p>{notification.message}</p>
                  <i className="bi bi-check"></i>
                </div>
              )}
            </div>
            <div>
              {notification.type !== "error" ? (
                <></>
              ) : (
                <div
                  className="alert alert-danger d-flex justify-content-around"
                  role="alert"
                >
                  <p>{notification.message}</p>
                  <i className="bi bi-exclamation-triangle"></i>
                </div>
              )}
            </div>
            <form
              className={`input-group ${styles.form} d-flex flex-column`}
              onSubmit={handleSubmit}
            >
              <label htmlFor="form" className={`${styles.label} mb-2 rounded`}>
                Vul een naam en email in, om toe te voegen aan {list}
              </label>
              <div id="form">
                <input
                  type="text"
                  className={`form-control ${styles.entry} p-2 mb-3`}
                  placeholder="Name"
                  onChange={handleNameChange}
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
              </div>
              <input
                type="submit"
                className={`btn ${styles.buttonPrimary} rounded mt-4`}
                value="Email toevoegen"
              />
            </form>
          </div>
        </div>
      ) : (
        <div
          className={`d-flex flex-column justify-content-center align-items-center `}
        >
          <div
            className={`alert alert-danger d-flex justify-content-around ${styles.notFound}`}
            role="alert"
          >
            <p>De gezochte maillijst bestaat niet, onze excuses hiervoor!</p>
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <div>
            <p>Zocht je een van de volgende lijsten?</p>
            <ul>
              {lists.map((list) => (
                <li className={styles.listItem} key={list}>
                  <Link
                    href={`/${list}/subscribe`}
                    className={`${styles.linky} nav-link`}
                    aria-current="page"
                  >
                    {list}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
