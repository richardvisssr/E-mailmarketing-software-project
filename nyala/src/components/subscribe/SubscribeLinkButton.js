import { useState } from "react";
import styles from "./SubscribeLinkButton.module.css";
import { Modal } from "react-bootstrap";

const protocol = `http`; // e.g. https
const domain = `localhost:3000`; // e.g. svxtend.nl

export default function SubscribeLinkButton(props) {
  // In de props moet de list mee worden gegeven
  const list = props.list;
  const link = `${protocol}://${domain}/${list}/subscribe`;

  const [showNotification, setShowNotification] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 1000);
  };

  const handleClose = () => setShowNotification(false);

  return (
    <div className={`${styles.around} input-group-prepend`}>
      <button
        type="button"
        className={`btn ${styles.buttonPrimary} rounded p-2`}
        data-toggle="modal"
        data-target="#exampleModal"
        onClick={handleCopy}
      >
        Link naar de lijst kopiëren
      </button>
      <Modal show={showNotification} onHide={handleClose}>
        <Modal.Body>Link gekopieerd!</Modal.Body>
      </Modal>
    </div>
  );
}
