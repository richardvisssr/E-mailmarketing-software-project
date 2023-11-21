"use client";
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import FilterPanel from "@/components/adminpanel/filterComponent";
import CardList from "@/components/adminpanel/cardListComponent";
import { Placeholder } from "react-bootstrap";

function Page() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const templates = {
    template1: {
      id: 1,
      title: 'Template 1',
    },
    template2: {
      id: 2,
      title: 'Template 2',
    },
    template3: {
      id: 3,
      title: 'Template 3',
    },
    template4: {
      id: 4,
      title: 'Template 4',
    },
    template5: {
      id: 5,
      title: 'Template 5',
    },
    template6: {
      id: 6,
      title: 'Template 6',
    },
    template7: {
      id: 7,
      title: 'Template 7',
    },
    template8: {
      id: 8,
      title: 'Template 8',
    },
  };

  return (
    <Container>
      <Row>
        <Col md={4}>
          <FilterPanel />
        </Col>
        <Col md={8}>
          <CardList templates={templates} handleShow={handleShow}/>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Wil je '{}' versturen?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Placeholder as={Modal.Body} animation="glow">
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuleren
          </Button>
          <Button>
            Versturen
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Page;
