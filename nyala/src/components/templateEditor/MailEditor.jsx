"use client";
import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Modal, Button, Alert } from "react-bootstrap";
import SelectMailingLists from "./SendMail";
import { nanoid } from "nanoid";
import sendDataToSendEmail from "../EmailService";
import AlertComponent from "../alert/AlertComponent";
import Cookies from "js-cookie";
import styles from "./MailEditor.module.css";

const EmailEditor = dynamic(() => import("react-email-editor"), { ssr: false });

/**
 * MailEditor component for composing and sending emails.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.id - Unique identifier for the mail editor.
 * @returns {JSX.Element} React component.
 */
const MailEditor = ({ id }) => {
  const editorRef = useRef(null);
  const [headerText, setHeaderText] = useState("");
  const [show, setShow] = useState(false);
  const [mails, setMails] = useState([]);
  const [title, setTitle] = useState("");
  const [html, setHtml] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sentData, setSentData] = useState([]);
  const [planned, setPlanned] = useState(false);
  const [dateTime, setDateTime] = useState("");
  const [subject, setSubject] = useState("");
  const [showHeader, setShowHeader] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [modalNotification, setModalNotification] = useState({
    type: "",
    message: "",
  });
  const token = Cookies.get("token");

  useEffect(() => {
    setPlanned(false);
    setEmailSent(false);
  }, [show]);

  const onDataChange = (data) => {
    setSentData(data);
  };

  const handleHeaderTextChange = (e) => {
    setHeaderText(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const setNewTime = (event) => {
    setDateTime(event.target.value);
  };

  const handleClose = () => {
    setShow(false);
    setShowHeader(false);
    setHeaderText("");
    setSubject("");
    setPlanned(false);
    setModalNotification({ type: "", message: "" });
  };
  const handleShow = () => setShow(true);

  const saveDesign = () => {
    editorRef.current.saveDesign(async (design) => {
      try {
        const response = await fetch("http://localhost:3001/mail/saveDesign", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ design, id, title }),
        });
        if (!response.ok) {
          setNotification({
            type: "error",
            message: "Er ging iets fout met het opslaan van het design.",
          });
          return;
        }
        setShow(false);
        setNotification({
          type: "success",
          message: "Design is succesvol opgeslagen!",
        });
      } catch (error) {
        setNotification({
          type: "error",
          message: `Er ging iets fout met het opslaan van het design.`,
        });
      }
    });
    saveHtml();
  };

  const saveHtml = () => {
    editorRef.current.exportHtml(async (data) => {
      const { html } = data;
      setHtml(html);
      try {
        const response = await fetch("http://localhost:3001/mail/sendEmail", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ html: html, id: id }),
        });
        if (!response.ok) {
          setNotification({
            type: "error",
            message: "Er ging iets fout met het opslaan van de html.",
          });
        }
        setShow(false);
      } catch (error) {
        setNotification({
          type: "error",
          message: `Error tijdens het opslaan van de html.`,
        });
      }
    });
  };

  const sendEmail = () => {
    editorRef.current.exportHtml(async (data) => {
      const { html } = data;
      setHtml(html);
    });
    handleShow();
  };

  const onReady = () => {
    onLoad(editorRef.current);
  };

  /**
   * Loads a saved email design when the editor is ready.
   *
   * @param {Object} editor - The email editor instance.
   */
  const onLoad = async (editor) => {
    try {
      const response = await fetch(
        `http://localhost:3001/mail/loadDesign/${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const design = await response.json();

      if (editorRef.current) {
        editorRef.current.loadDesign(design.design);
      }
      setTitle(design.title);
    } catch (error) {
      setNotification({
        type: "error",
        message: `Er is iets misgegaan bij het laden van de mail.`,
      });
    } finally {
      editorRef.current = editor;
    }
    editorRef.current = editor;
  };

  const checkIfEmailCanBeSent = () => {
    if (!subject || subject.trim() === "") {
      setModalNotification({
        type: "error",
        message: "Onderwerp mag niet leeg zijn!",
      });
      return false;
    } else if (!html || html.trim() === "") {
      setModalNotification({
        type: "error",
        message: "Design is nog niet opgeslagen en is leeg",
      });
      return false;
    } else if (showHeader && headerText.trim() === "") {
      setModalNotification({
        type: "error",
        message: "Header mag niet leeg zijn!",
      });
      return false;
    } else {
      return true;
    }
  };

  const handleSendEmailClick = async () => {
    if (!checkIfEmailCanBeSent()) {
      return;
    }

    if (mails.length > 0) {
      const post = await sendDataToSendEmail(
        html,
        sentData.subscribersData,
        subject,
        showHeader,
        headerText,
        id
      );
      if (post === "no_members") {
        setModalNotification({
          type: "error",
          message: "Er zijn geen leden in de geselecteerde lijst(en).",
        });
      } else if (post === true) {
        setShow(false);
        handleClose();
        setNotification({
          type: "success",
          message: "Mail is succesvol verstuurd.",
        });
      }
    } else {
      setModalNotification({
        type: "error",
        message: "Er zijn geen lijsten geselecteerd!",
      });
    }
  };

  const handlePlanMail = async () => {
    if (!checkIfEmailCanBeSent()) {
      return;
    }

    editorRef.current.exportHtml(async (data) => {
      const { html } = data;
      setHtml(html);
    });

    if (mails.length > 0) {
      try {
        const response = await fetch(" http://localhost:3001/planMail", {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mailId: id,
            id: generateUniqueShortId(),
            title: title,
            html: html,
            subs: sentData.subscribersData,
            date: dateTime,
            showHeader: showHeader,
            headerText: headerText,
            subject: subject,
          }),
        });
        if (!response.ok) {
          if (response.status === 400) {
            setModalNotification({
              type: "error",
              message: "Er zijn geen leden in de geselecteerde lijst(en).",
            });
          } else {
            setShow(false);
            handleClose();
            setNotification({
              type: "error",
              message: "Er is iets fout gegaan tijdens het inplannen",
            });
          }
        } else {
          setShow(false);
          handleClose();
          setNotification({
            type: "success",
            message: "Mail is succesvol ingepland.",
          });
        }
      } catch (error) {
        setEmailSent(false);
      }
    } else {
      setNotification({
        type: "error",
        message: "Er zijn geen lijsten geselecteerd!",
      });
    }
  };

  function generateUniqueShortId() {
    return nanoid();
  }

  return (
    <div>
      <h1 className="text-center">Maileditor</h1>
      <div className="p-2 gap-3 d-flex justify-content-center">
        <AlertComponent notification={notification} />
      </div>
      <div className="p-2 gap-3 d-flex justify-content-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Voer titel in"
          className="form-control text-center"
        />
      </div>
      <div>
        <EmailEditor
          options={{
            locale: "nl-NL",
            translations: {
              "nl-NL": {
                "You will lose 1 column. Are you sure?":
                  "Je verliest 1 kolom. Weet je het zeker?",
              },
            },
            tools: {
              html: {
                enabled: true,
              },
              customCSS: "bootstrap/dist/css/bootstrap.css",
              ai: {
                enabled: false,
              },
            },
          }}
          ref={editorRef}
          onLoad={onLoad}
          onReady={onReady}
        />
      </div>
      <div className="p-2 gap-3 d-flex justify-content-center">
        <button
          onClick={saveDesign}
          className={`btn ${styles.buttonSecondary} `}
        >
          Design opslaan
        </button>
        <button onClick={sendEmail} className={`btn ${styles.buttonPrimary} `}>
          Email versturen
        </button>
      </div>

      <Modal show={show} onHide={handleClose} size="xl">
        <AlertComponent notification={modalNotification} />

        <Modal.Header closeButton>
          <Modal.Title>Wil je '{title}' versturen?</Modal.Title>
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
              className={`me-2 control ${styles.customSelect}`}
              type="checkbox"
              onChange={() => setShowHeader(!showHeader)}
            />
            <label className="form-check-label">Header toevoegen</label>
          </div>
          {showHeader && (
            <div className="p-2 gap-3 d-flex flex-column justify-content-center">
              <label className="form-label">
                Gebruik {"{name}"} om naam toe te voegen en {"{image}"} om xtend
                logo toe te voegen
              </label>
              <textarea
                value={headerText}
                onChange={handleHeaderTextChange}
                placeholder="Voer header tekst in"
                className="form-control text-center"
                rows="4"
                style={{
                  whiteSpace: "pre-line",
                  fontFamily: "Arial, sans-serif",
                }}
              />
            </div>
          )}
          <SelectMailingLists
            id={id}
            setEmails={setMails}
            onDataChange={onDataChange}
          />
          <label className="form-label">Wil je de mail vooruit plannen?</label>
          <div className="form-check">
            <input
              className={`me-2 control ${styles.customSelect}`}
              type="checkbox"
              onChange={() => setPlanned(!planned)}
              style={{ accentColor: "#a66cf2" }}
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
            onClick={planned ? handlePlanMail : handleSendEmailClick}
            className={`btn ${styles.buttonPrimary}`}
          >
            {planned ? "Inplannen" : "Mail versturen"}
          </Button>
          <Button
            onClick={handleClose}
            className={`btn ${styles.buttonSecondary}`}
          >
            Annuleren
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MailEditor;
