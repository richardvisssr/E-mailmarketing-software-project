import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlertComponent from "../alert/AlertComponent";
import EmailForm from "./EmailForm";
import Spinner from "../spinner/Spinner";

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
   * Router hook for programmatic navigation.
   */
  const router = useRouter();

  /**
   * Effect hook for fetching mailing lists and updating state.
   */
  useEffect(() => {
    /**
     * Function to fetch mailing lists from the server.
     */
    const fetchlists = async () => {
      try {
        const response = await fetch("http://localhost:3001/mail/getList");
        const body = await response.json();
        if (!response.ok) {
          setNotification({
            type: "error",
            message: "Er is iets foutgegaan tijdens het ophalen",
          });
        } else if (
          response.ok &&
          (!body[0] || body[0].mailList === undefined)
        ) {
          setNotification({
            type: "error",
            message: "Er zijn nog geen maillijsten gemaakt.",
          });
        } else {
          setLists(body[0].mailList);
        }
      } catch (error) {
        setNotification({
          type: "error",
          message: "Er is iets foutgegaan tijdens het ophalen",
        });
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
              type: "success",
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
   * Handles form submission.
   * @param {Object} event - The form submission event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

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
   * Handles change in the email input.
   * @param {Object} event - The change event.
   */
  const handleEmailChange = (event) => {
    if (notification.type === "succes") {
      setNotification({ type: "", message: "" });
    }
    setData({ ...data, email: event.target.value });
  };

  /**
   * Handles change in the name input.
   * @param {Object} event - The change event.
   */
  const handleNameChange = (event) => {
    if (notification.type === "succes") {
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
            <AlertComponent notification={notification} />
            <EmailForm
              handleSubmit={handleSubmit}
              handleNameChange={handleNameChange}
              handleEmailChange={handleEmailChange}
              labelMessage={`Vul een naam en email in, om toe te voegen aan ${list}.`}
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
