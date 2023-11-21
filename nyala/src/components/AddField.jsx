import { useEffect, useState } from "react";
import styles from "./AddField.module.css";
import SubscriptionForm from "./CategoriesComponent";

export default function ToevoegVeld() {
  const [data, setData] = useState({ email: undefined, list: [] });
  const [status, setStatus] = useState(false);
  const [lists, setLists] = useState([]);
  const [add, setAdd] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [list, setList] = useState("");

  useEffect(() => {
    const fetchlists = async () => {
      const response = await fetch("http://localhost:3001/mail/getList");
      // console.log(response);
      const body = await response.json();
      // console.log(body);
      if (!response.ok) {
        setNotification({
          type: "error",
          message: "Er is iets foutgegaan tijdens het ophalen",
        });
      } else if (response.ok) {
        console.log(body[0].mailList);
        setLists(body[0].mailList);
      }
    };
    fetchlists();

    if (status) {
      const postEmail = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/subscribers/add`,
            {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: data.email,
                subscriptions: data.list,
              }),
            }
          );
          console.log(response);
          if (response.ok) {
            setData({ email: undefined, list: [] });
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

  useEffect(() => {
    if (list !== "") {
      const postList = async () => {
        try {
          const response = await fetch("http://localhost:3001/mail/addlist", {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: list,
            }),
          });
          if (response.ok) {
            setNotification({
              type: "succes",
              message: "De list is succesvol toegevoegd",
            });
          } else if (!response.ok) {
            setNotification({
              type: "error",
              message:
                "Er heeft zich een fout opgetreden tijdens het add van de list.",
            });
          }
        } catch (error) {
          setNotification({
            type: "error",
            message:
              "Er heeft zich een fout opgetreden tijdens het add van de list.",
          });
        }
      };
      postList();
    }
  }, [lists]);

  const handleListAdd = (event) => {
    event.preventDefault();

    if (list === "") {
      setNotification({
        type: "error",
        message: "De list is niet ingevuld.",
      });
    } else {
      setLists([...lists, list]);
      setAdd(false);
    }
  };

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

  const handleEmailChange = (event) => {
    if (notification.type === "succes") {
      setNotification({ type: "", message: "" });
    }
    setData({ ...data, email: event.target.value });
  };

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
            Vul een email in, om toe te voegen aan een emaillijst
          </label>
          <div id="form">
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
                />
              ) : (
                <p>Er zijn geen maillijsten.</p>
              )}
              {add ? (
                <div
                  className={`input-group ${styles.form} d-flex justify-items-center align-content-center`}
                >
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className={`form-control ${styles.entry} p-2`}
                      placeholder="Lijst"
                      aria-describedby="basic-addon1"
                      onChange={(e) => {
                        const value = e.target.value;
                        setList(value);
                      }}
                    />
                    <div className={`${styles.around} input-group-prepend`}>
                      <input
                        type="submit"
                        className={`btn ${styles.buttonPrimary} rounded p-2`}
                        value="Lijst toevoegen"
                        onClick={handleListAdd}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  className={`btn ${styles.buttonPrimary} rounded`}
                  onClick={() => {
                    setAdd(true);
                  }}
                >
                  Lijst aanmaken
                </button>
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
