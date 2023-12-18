import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlertComponent from "../alert/AlertComponent";
import EmailForm from "./EmailForm";
import Spinner from "../spinner/Spinner";
import Cookies from "js-cookie";

/**
 * Messages to show when an error occurs.
 * @type {string}
 */
const NAME_REQUIRED = "De naam is niet ingevuld.";
const EMAIL_REQUIRED = "Het emailadres is niet ingevuld.";
const INVALID_EMAIL_FORMAT = "Het emailadres is geen valide formaat.";
const LIST_NOT_FOUND = "De maillijst bestaat niet.";
const NO_LISTS_MADE = "Er zijn nog geen maillijsten gemaakt.";
const FETCH_PROBLEM = "Er is iets foutgegaan tijdens het ophalen.";
const ADDING_PROBLEM =
  "Er heeft zich een fout opgetreden tijdens het toevoegen van de mail.";

/**
 * Message to show when a subscriber gets succesfully added.
 * @type {string}
 */
const SUBSCRIBER_ADDED = "Abonnee succesvol toegevoegd.";

/**
 * Component for subscribing to a mailing list.
 * @param {Object} props - Component properties.
 * @param {string} props.list - Mailing list name.
 */
export default function SubscribeField(props) {
  /**
   * State hook for managing input data.
   */
  const [data, setData] = useState({ email: undefined, name: "" });

  /**
   * State hook for managing subscription status.
   */
  const [status, setStatus] = useState(false);

  /**
   * State hook for managing notification messages.
   */
  const [notification, setNotification] = useState({ type: "", message: "" });

  /**
   * State hook for storing mailing lists.
   */
  const [lists, setLists] = useState([]);

  /**
   * State hook for managing loading state.
   */
  const [loading, setLoading] = useState(true);

  /**
   * Mailing list name from props.
   */
  const list = props.list;

  /**
   * Label for the form.
   * @type {string}
   */
  const FORM_LABEL = `Vul een naam en email in, om toe te voegen aan ${list}`;

  /**
   * Router hook for programmatic navigation.
   */
  const router = useRouter();

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

  const token = Cookies.get("token");

  /**
   * Effect hook for fetching mailing lists and updating state.
   */
  useEffect(() => {
    /**
     * Function to fetch mailing lists from the server.
     */
    const fetchlists = async () => {
      try {
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
          const response = await fetch("http://localhost:3001/mail/getList", {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const body = await response.json();
          if (!response.ok) {
            setErrorNotification(FETCH_PROBLEM);
          } else if (!body[0] || body[0].mailList === undefined) {
            setErrorNotification(NO_LISTS_MADE);
          } else {
            setLists(body[0].mailList);
          }
        }
      } catch (error) {
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
            `http://localhost:3001/subscribers/edit`,
            {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
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
              type: "success",
              message: SUBSCRIBER_ADDED,
            });
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
   * Handles form submission.
   * @param {Object} event - The form submission event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !data.name ||
      !data.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
      !lists.includes(list)
    ) {
      setErrorNotification(
        !data.name
          ? NAME_REQUIRED
          : !data.email
          ? EMAIL_REQUIRED
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
          ? INVALID_EMAIL_FORMAT
          : LIST_NOT_FOUND
      );
    } else {
      setStatus(true);
    }
  };

  /**
   * Handles change in the email input.
   * @param {Object} event - The change event.
   */
  const handleEmailChange = (event) => {
    if (notification.type === "success") {
      setNotification({ type: "", message: "" });
    }
    setData({ ...data, email: event.target.value });
  };

  /**
   * Handles change in the name input.
   * @param {Object} event - The change event.
   */
  const handleNameChange = (event) => {
    if (notification.type === "success") {
      setNotification({ type: "", message: "" });
    }
    setData({ ...data, name: event.target.value });
  };

  /**
   * Renders the component.
   */
  return (
    <>
      {loading ? (
        <Spinner />
      ) : lists.includes(list) ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div>
            <h1 className="text-center mb-2">Abonneren</h1>
            <AlertComponent notification={notification} />
            <EmailForm
              handleSubmit={handleSubmit}
              handleNameChange={handleNameChange}
              handleEmailChange={handleEmailChange}
              labelMessage={FORM_LABEL}
              lists={lists}
              initialValues={data}
            />
          </div>
        </div>
      ) : (
        router.push("/404")
      )}
    </>
  );
}
