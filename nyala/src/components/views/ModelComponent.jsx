import React from "react";
import { Modal, Placeholder } from "react-bootstrap";

const CustomModal = ({
  showModal,
  handleClose,
  modalContent,
  footerContent,
  modalTitle,
}) => {
  return (
    <Modal show={showModal} onHide={handleClose} size="md">
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Placeholder as={Modal.Body} animation="glow">
          {modalContent}
        </Placeholder>
      </Modal.Body>
      <Modal.Footer>{footerContent}</Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
