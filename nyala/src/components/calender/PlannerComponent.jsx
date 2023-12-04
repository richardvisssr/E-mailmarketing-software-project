import React, { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';

const PlannerComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [emailDate, setEmailDate] = useState('');

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveChanges = () => {
    // Save the changes made by the user
    console.log('Subscribers:', subscribers);
    console.log('Email Date:', emailDate);
    setShowModal(false);
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShowModal}>
        Open Modal
      </Button>

      
    </div>
  );
};

export default PlannerComponent;
