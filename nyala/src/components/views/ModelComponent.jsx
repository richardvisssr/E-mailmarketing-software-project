import React from "react";
import { Modal, Placeholder } from "react-bootstrap";

const CustomModal = ({
  size,
  showModal,
  handleClose,
  modalContent,
  footerContent,
  modalTitle,
  Notification,
}) => {
  return (
    <Modal show={showModal} onHide={handleClose} size={size}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Placeholder as={Modal.Body} animation="glow">
          <div> {Notification} </div>
          {modalContent}
        </Placeholder>
      </Modal.Body>
      <Modal.Footer>{footerContent}</Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
