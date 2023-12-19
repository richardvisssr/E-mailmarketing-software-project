import { useEffect, useState } from "react";
import AlertComponent from "../alert/AlertComponent";
import EmailForm from "./EmailForm";
import Spinner from "../spinner/Spinner";

/**
 * Messages to show when an error occurs.
 * @type {string}
 */
const NAME_REQUIRED = "De naam is niet ingevuld.";
const EMAIL_REQUIRED = "Het emailadres is niet ingevuld.";
const INVALID_EMAIL_FORMAT = "Het emailadres is geen valide formaat.";
const LIST_NOT_FOUND = "De maillijst bestaat niet.";
const EXCESS_LISTS = "Er zijn te veel mailinglists gekozen.";
const NO_LIST = "Er is geen mailinglijst gekozen.";
const NO_LISTS_MADE = "Er zijn nog geen maillijsten gemaakt.";
const FETCH_PROBLEM = "Er is iets foutgegaan tijdens het ophalen.";
const ADDING_PROBLEM =
  "Er heeft zich een fout opgetreden tijdens het toevoegen van de mail.";
const MAIL_IN_USE = "Het ingevulde emailadres is al in gebruik!";

/**
 * Message to show when a subscriber gets succesfully added.
 * @type {string}
 */
const SUBSCRIBER_ADDED = "Abonnee succesvol toegevoegd.";

/**
 * Label for the form.
 * @type {string}
 */
const FORM_LABEL =
  "Vul een naam en email in, om toe te voegen aan een emaillijst";

/**
 * Functional component for adding email and subscribing to mailing lists.
 * @returns {JSX.Element} The JSX element representing the component.
 */
export default function AddField() {
  /**
   * State hook for managing the form data (email, list, name).
   * @type {Object}
   * @property {string|undefined} email - The email address.
   * @property {Array} list - The selected mailing lists.
   * @property {string} name - The name associated with the email.
   */
  const [data, setData] = useState({ email: undefined, list: [], name: "" });

  /**
   * State hook for managing the status of email submission.
   * @type {boolean}
   */
  const [status, setStatus] = useState(false);

  /**
   * State hook for managing the mailing lists fetched from the server.
   * @type {Array}
   */
  const [lists, setLists] = useState([]);

  /**
   * State hook for managing loading state.
   */
  const [loading, setLoading] = useState(true);

  /**
   * State hook for managing notification data (type and message).
   * @type {Object}
   * @property {string} type - The type of notification (e.g., "success", "error").
   * @property {string} message - The notification message.
   */
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
          setErrorNotification(FETCH_PROBLEM);
        } else if (!body[0] || body[0].mailList === undefined) {
          setErrorNotification(NO_LISTS_MADE);
        } else {
          setLists(body[0].mailList);
        }
      } catch (err) {
        setErrorNotification(FETCH_PROBLEM);
      } finally {
        setLoading(false);
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
              message: SUBSCRIBER_ADDED,
            });
            return;
          }

          const responseData = await response.json();

          if (
            response.status === 400 &&
            responseData.message === "Bad Request: Email already used"
          ) {
            setErrorNotification(MAIL_IN_USE);
          } else {
            setErrorNotification(ADDING_PROBLEM);
          }
        } catch (error) {
          setErrorNotification(ADDING_PROBLEM);
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
      setErrorNotification(NO_LIST);
      return;
    }

    let inLists = true;
    data.list.forEach((list) => {
      if (!lists.includes(list)) {
        inLists = false;
      }
    });

    if (!inLists) {
      setErrorNotification(LIST_NOT_FOUND);
      return;
    }

    if (!data.name) {
      setErrorNotification(NAME_REQUIRED);
      return;
    }

    if (!data.email) {
      setErrorNotification(EMAIL_REQUIRED);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setErrorNotification(INVALID_EMAIL_FORMAT);
      return;
    }

    if (data.list.length > lists.length) {
      setErrorNotification(EXCESS_LISTS);
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

  /**
   * Renders the component.
   * @returns {JSX.Element} The JSX element representing the component.
   */
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div>
            <h1 className="text-center mb-2">Abonnee toevoegen</h1>
            <AlertComponent notification={notification} />
            <EmailForm
              handleSubmit={handleSubmit}
              handleNameChange={handleNameChange}
              handleEmailChange={handleEmailChange}
              handleCheckboxChange={handleCheckboxChange}
              labelMessage={FORM_LABEL}
              lists={lists}
              initialValues={data}
            />
          </div>
        </div>
      )}
    </>
  );
}
