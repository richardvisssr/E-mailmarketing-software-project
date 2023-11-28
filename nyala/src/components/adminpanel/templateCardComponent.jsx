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
import SelectMailingLists from "../email/SendMail";

function TemplateCard(props) {
  const cardRef = useRef(null);
  const { template } = props;
  const [show, setShow] = useState(false);
  const [image, setImage] = useState("");
  const [zoomLevel, setZoomLevel] = useState(2);
  const [error, setError] = useState(false);
  const [sentData, setSentData] = useState([]);
  const [planned, setPlanned] = useState(false);
  const [mails, setMails] = useState([]);
  const [emailSent, setEmailSent] = useState(false);
  const [dateTime, setDateTime] = useState("");
  
  const router = useRouter();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onDataChange = (data) => {
    setSentData(data);
  };

  useEffect(() => {
    setPlanned(false);
    setEmailSent(false);
  }, [show]);

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

  const handleSendEmailClick = async () => {
    console.log(mails);
    if (mails.length > 0) {
      try {
        const response = await fetch(
          " http://localhost:3001/sendMail/sendEmail",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              html: sentData.html,
              subscribers: sentData.subscribersData,
            }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setEmailSent(true);
      } catch (error) {
        alert("Error sending email:", error);
        setEmailSent(false);
      }
    }
  };

  const handlePlanMail = async () => {
    console.log(mails);
    if (mails.length > 0) {
      try {
        const response = await fetch(
          " http://localhost:3001/sendMail/planMail",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              html: sentData.html,
              subscribers: sentData.subscribersData,
              time: dateTime,
            }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setEmailSent(true);
      } catch (error) {
        alert("Error sending email:", error);
        setEmailSent(false);
      }
    }
  };

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
        {emailSent && (
          <div className="alert alert-success" role="alert">
            E-mail is succesvol verstuurd!
          </div>
        )}
        <Modal.Header closeButton>
          <Modal.Title>Wil je '{template.title}' verturen?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SelectMailingLists
            id={template.id}
            setEmails={setMails}
            onDataChange={onDataChange}
          />
          <label className="form-label">Wil je de mail vooruit plannen?</label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              onChange={() => setPlanned(!planned)}
            />
            <label className="form-check-label">Ja</label>
          </div>

          {planned && (
            <div className="form-group">
              <label className="form-label">Kies een datum</label>
              <input
                type="datetime-local"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="2021-06-12T19:30"
                onInput={setDateTime}
                required
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={planned ? handlePlanMail : handleSendEmailClick}>
            {planned ? "Inplannen" : "Mail versturen"}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Annuleren
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TemplateCard;
