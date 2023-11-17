"use client";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import styles from "./button.module.css";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Placeholder } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

function TemplateCard(props) {
  const { template } = props;
  const [show, setShow] = useState(false);
  const router = useRouter();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    router.prefetch(`/mail/${template.id}`);
  }, [router, template.id]);

  const handleNavigate = () => {
    router.push(`/mail/${template.id}`);
  };

  return (
    <>
      <Col key={template.id} style={{ width: "16em" }}>
        <Card>
          <Card.Img variant="top" src="https://picsum.photos/200/50" />
          <Card.Body>
            <Card.Title>{template.title}</Card.Title>
            <div className="d-flex justify-content-between">
              <Button
                variant="primary"
                className={`${styles.knopSecondary}`}
                size="sm"
                onClick={handleNavigate}
              >
                Aanpassen
              </Button>
              <Button
                variant="primary"
                className={`ms-auto ${styles.knopPrimary}`}
                size="sm"
                onClick={handleShow}
              >
                Versturen
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Wil je '{template.title}' versturen?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Placeholder as={Modal.Body} animation="glow">
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{" "}
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuleren
          </Button>
          <Button>Versturen</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TemplateCard;
