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
 * @param {Object} props - Component properties.
 * @param {string} props.list - Name of the mailing list.
 */
export default function SubscribeLinkButton(props) {
  /**
   * Mailing list name from props.
   * @type {string}
   */
  const list = props.list;

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