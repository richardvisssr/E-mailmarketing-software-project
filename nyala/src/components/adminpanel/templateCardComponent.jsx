"use client";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import styles from "./button.module.css";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import SelectMailingLists from "../email/SendMail";
import { nanoid } from "nanoid";
import AlertComponent from "../alert/AlertComponent";
import sendDataToSendEmail from "../emailService";

function TemplateCard(props) {
  const cardRef = useRef(null);
  const { template, onDelete } = props;
  const [show, setShow] = useState(false);
  const [image, setImage] = useState("");
  const [html, setHtml] = useState("");
  const [sentData, setSentData] = useState([]);
  const [planned, setPlanned] = useState(false);
  const [mails, setEmails] = useState([]);
  const [emailSent, setEmailSent] = useState(false);
  const [dateTime, setDateTime] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [subject, setSubject] = useState("");
  const [showHeader, setShowHeader] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const router = useRouter();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const setNewTime = (event) => {
    setDateTime(event.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const onDataChange = (data) => {
    setSentData(data);
  };

  useEffect(() => {
    if (sentData.subscribersData) {
      sentData.subscribersData.map((sub) => {
        setSubscribers([sub]);
      });
    }
  }, [sentData]);

  useEffect(() => {
    setPlanned(false);
    setEmailSent(false);
    setEmails([]);
    setDateTime("");
    setSubscribers([]);
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
        setHtml(data.html);
      } catch (error) {
        setNotification({
          type: "error",
          message: "Er is iets misgegaan bij het ophalen van de template",
        });
      }
    };

    fetchHtmlContent();
  }, [template.id]);

  const handleSendEmailClick = async () => {
    if (!subject || subject.trim() === "") {
      setNotification({
        type: "error",
        message: "Onderwerp mag niet leeg zijn!",
      });
      return;
    }

    if (mails.length > 0) {
      await sendDataToSendEmail(
        html,
        sentData.subscribersData,
        subject,
        showHeader,
        template.id
      );
      setNotification({
        type: "success",
        message: "Mail is succesvol verstuurd",
      });
    }
  };

  const handlePlanMail = async () => {
    if (!subject || subject.trim() === "") {
      setNotification({
        type: "error",
        message: "Onderwerp mag niet leeg zijn!",
      });
      return;
    }
    if (mails.length > 0) {
      try {
        const response = await fetch(" http://localhost:3001/planMail", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: generateUniqueShortId(),
            title: template.title,
            html: html,
            subs: subscribers,
            date: dateTime,
            showHeader: showHeader,
            subject: subject,
          }),
        });
        if (!response.ok) {
          setNotification({
            type: "error",
            message: "Er is iets misgegaan bij het versturen van de mail",
          });
        }
        setNotification({
          type: "success",
          message: "Mail is succesvol ingepland",
        });
      } catch (error) {
        setNotification({
          type: "error",
          message: "Er is iets misgegaan bij het versturen van de mail",
        });
        setEmailSent(false);
      }
    }
  };

  const handleNavigate = () => {
    router.push(`/admin/mail/${template.id}`);
  };

  function generateUniqueShortId() {
    return nanoid();
  }

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const confirmDelete = () => {
    fetch(`http://localhost:3001/template/${template.id}`, {
      method: "DELETE",
    })
      .then(() => {
        onDelete(template.id);
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.error("Error deleting template:", error);
        // Handle error as needed
        setShowDeleteModal(false);
      });
  };

  return (
    <>
      <Col key={template.id} style={{ width: "16rem" }}>
        <Card ref={cardRef}>
          <Button variant="danger" onClick={handleDelete}>
            Verwijderen
          </Button>
          {/* {!error && (
            <Card.Img
              variant="top"
              src={image.src}
              style={{ width: "100%", height: "auto" }}
            />
          )} */}

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

      <Modal show={showDeleteModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Bevestig Verwijderen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Weet je zeker dat je '{template.title}' wilt verwijderen?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmDelete}>
            Verwijderen
          </Button>
          <Button variant="secondary" onClick={cancelDelete}>
            Annuleren
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={handleClose} size="xl">
        <AlertComponent notification={notification} />

        <Modal.Header closeButton>
          <Modal.Title>Wil je '{template.title}' versturen?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-2 gap-3 d-flex justify-content-center">
            <input
              type="text"
              value={subject}
              onChange={handleSubjectChange}
              placeholder="Voer onderwerp van e-mail in"
              className="form-control text-center"
              required
            />
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              onChange={() => setShowHeader(!showHeader)}
            />
            <label className="form-check-label">Header toevoegen</label>
          </div>
          <SelectMailingLists
            id={template.id}
            setEmails={setEmails}
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
                onInput={setNewTime}
                required
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={planned ? handlePlanMail : handleSendEmailClick}
          >
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
