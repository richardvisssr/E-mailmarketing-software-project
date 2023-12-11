import { useEffect, useState } from "react";
import AlertComponent from "../alert/AlertComponent";
import EmailForm from "./EmailForm";

/**
 * Functional component for adding email and subscribing to mailing lists.
 * @returns {JSX.Element} The JSX element representing the component.
 */
export default function AddField() {
  const [data, setData] = useState({ email: undefined, list: [], name: "" });
  const [status, setStatus] = useState(false);
  const [lists, setLists] = useState([]);
  const [notification, setNotification] = useState({ type: "", message: "" });

  /**
   * Sets an error notification.
   * @param {string} message - The error message.
   */
  const setErrorNotification = (message) => {
    setNotification({
      type: "error",
      message,
    });
  };

  useEffect(() => {
    /**
     * Function to fetch mailing lists from the server.
     */
    const fetchlists = async () => {
      try {
        const response = await fetch("http://localhost:3001/mail/getList");
        const body = await response.json();
        if (!response.ok) {
          setErrorNotification("Er is iets foutgegaan tijdens het ophalen");
        } else if (!body[0] || body[0].mailList === undefined) {
          setErrorNotification("Er zijn nog geen maillijsten gemaakt.");
        } else {
          setLists(body[0].mailList);
        }
      } catch (err) {
        setErrorNotification("Er is iets foutgegaan tijdens het ophalen");
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
              type: "success",
              message: "Email succesvol toegevoegd.",
            });
            return;
          }

          const responseData = await response.json();

          if (
            response.status === 400 &&
            responseData.message === "Bad Request: Email already used"
          ) {
            setErrorNotification("Het ingevulde emailadres is al in gebruik!");
          } else {
            setErrorNotification(
              "Er heeft zich een fout opgetreden tijdens het toevoegen van de mail."
            );
          }
        } catch (error) {
          setErrorNotification(
            "Er heeft zich een fout opgetreden tijdens het toevoegen van de mail."
          );
        }
      };
      postEmail();
    }
  }, [status]);

  /**
   * Function to handle the addition of a new email and subscriptions.
   * @param {React.SyntheticEvent} event - The event object.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    if (data.list.length === 0) {
      setErrorNotification("Er is geen mailinglijst gekozen.");
      return;
    }

    let inLists = true;
    data.list.forEach((list) => {
      if (!lists.includes(list)) {
        inLists = false;
      }
    });

    if (!inLists) {
      setErrorNotification("De gekozen mailinglijst bestaat niet.");
      return;
    }

    if (!data.name) {
      setErrorNotification("De naam is niet ingevuld.");
      return;
    }

    if (!data.email) {
      setErrorNotification("Het emailadres is niet ingevuld.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setErrorNotification("Het emailadres is geen valide formaat.");
      return;
    }

    if (data.list.length > lists.length) {
      setErrorNotification("Er zijn te veel mailinglists gekozen.");
      return;
    }

    setStatus(true);
  };

  /**
   * Function to handle the change in the email input.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The event object.
   */
  const handleEmailChange = (event) => {
    if (notification.type === "success") {
      setNotification({ type: "", message: "" });
    }
    setData({ ...data, email: event.target.value, name: data.name });
  };

  const handleNameChange = (event) => {
    if (notification.type === "success") {
      setNotification({ type: "", message: "" });
    }
    setData({ ...data, name: event.target.value });
  };

  /**
   * Function to handle the change in the checkbox for selecting mailing lists.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The event object.
   */
  const handleCheckboxChange = (event) => {
    if (notification.type === "success") {
      setNotification({ type: "", message: "" });
    }

    const listName = event.target.value;
    const updatedList = data.list.includes(listName)
      ? data.list.filter((list) => list !== listName)
      : [...data.list, listName];

    setData({ ...data, list: updatedList });
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div>
        <AlertComponent notification={notification} />
        <EmailForm
          handleSubmit={handleSubmit}
          handleNameChange={handleNameChange}
          handleEmailChange={handleEmailChange}
          handleCheckboxChange={handleCheckboxChange}
          labelMessage="Vul een naam en email in, om toe te voegen aan een emaillijst"
          lists={lists}
          initialValues={data}
        />
      </div>
    </div>
  );
}
