"use client";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import styles from "./button.module.css";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Placeholder } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import * as htmlToImage from "html-to-image";
import {
  toPng,
  toJpeg,
  toBlob,
  toPixelData,
  toSvg,
  toCanvas,
} from "html-to-image";
import Alert from "react-bootstrap/Alert";
import SelectMailingLists from "../SendMail";

function TemplateCard(props) {
  const cardRef = useRef(null);
  const { template } = props;
  const [show, setShow] = useState(false);
  const [image, setImage] = useState("");
  const [zoomLevel, setZoomLevel] = useState(2);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    router.prefetch(`/mail/${template.id}`);
  }, [router, template.id]);

  useEffect(() => {
    const fetchHtmlContent = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3001/templates/${template.id}`
        );
        const data = await response.json();
      } catch (error) {
        setError(true);
      }
    };

    fetchHtmlContent();
  }, [template.id]);

  const handleNavigate = () => {
    router.push(`/admin/mail/${template.id}`);
  };

  return (
    <>
      <Col key={template.id} style={{ width: "16rem" }}>
        <Card ref={cardRef}>
          {!error && (
            <Card.Img
              variant="top"
              src={image.src}
              style={{ width: "100%", height: "auto" }}
            />
          )}
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
          <Placeholder as={Modal.Body} animation="glow"></Placeholder>
          <SelectMailingLists id={template.id} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className={`${styles.knopSecondary}`}
            onClick={handleClose}
          >
            Annuleren
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TemplateCard;
