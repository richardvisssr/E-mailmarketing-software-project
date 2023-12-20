import { useState } from "react";
import { Modal } from "react-bootstrap";

export default function ApiKeyButton({ apiKey }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setShow(true);

    setTimeout(() => {
      setShow(false);
    }, 2000);
  };

  return (
    <>
      <button className="btn btn-primary btn-sm me-1" onClick={handleCopy}>
        Kopieer
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>API key gekopieerd</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          De API key is gekopieerd naar je klembord, je kan deze nu gebruiken in
          je externe applicatie.
        </Modal.Body>
      </Modal>
    </>
  );
}
