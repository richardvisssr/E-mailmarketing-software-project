import { useState } from "react";
import styles from "./SubscribeLinkButton.module.css";
import { Modal } from "react-bootstrap";

/**
 * Protocol for constructing the subscribe link.
 * @type {string}
 */
const protocol = `http`; // e.g. https

/**
 * Domain for constructing the subscribe link.
 * @type {string}
 */
const domain = `localhost:3000`; // e.g. svxtend.nl

/**
 * Component for rendering a button to copy the subscribe link.
 * @param {string} list - Component properties.
 */
export default function SubscribeLinkButton({ list }) {
  /**
   * Subscribe link constructed based on protocol, domain, and list.
   * @type {string}
   */
  const link = `${protocol}://${domain}/${list}/subscribe`;

  /**
   * State hook for managing the visibility of the copy notification.
   */
  const [showNotification, setShowNotification] = useState(false);

  /**
   * Handles copying the subscribe link to the clipboard.
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 1000);
  };

  /**
   * Handles closing the copy notification modal.
   */
  const handleClose = () => setShowNotification(false);

  /**
   * Renders the component.
   */
  return (
    <div className={`input-group-prepend`}>
      <button
        className={`btn ${styles.buttonPrimary} rounded p-2`}
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
