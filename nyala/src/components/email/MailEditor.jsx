"use client";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Modal, Button, Placeholder, Alert } from "react-bootstrap";
import SelectMailingLists from "./SendMail";

const EmailEditor = dynamic(() => import("react-email-editor"), { ssr: false });

const MailEditor = ({ id }) => {
  const editorRef = useRef(null);
  const [show, setShow] = useState(false);
  const [designSaved, setDesignSaved] = useState(false);
  const [mails, setMails] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sentData, setSentData] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [planned, setPlanned] = useState(false);

  const onDataChange = (data) => {
    setSentData(data);
  };

  const handleClose = () => {
    setShow(false);
    setDesignSaved(false);
  };
  const handleShow = () => setShow(true);

  const saveDesign = () => {
    editorRef.current.saveDesign(async (design) => {
      try {
        const response = await fetch("http://localhost:3001/mail/saveDesign", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ design, id, title }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setDesignSaved(true);
      } catch (error) {
        alert("Error saving design:", error);
      }
    });
  };

  const sendEmail = () => {
    editorRef.current.exportHtml(async (data) => {
      const { html } = data;
      try {
        const response = await fetch("http://localhost:3001/mail/sendEmail", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ html: html, id: id }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        // alert("Error sending email:", error);
      }
      handleShow();
    });
  };

  const setEmailLists = (lists) => {
    setSelectedMailingList(lists);
  };

  const onReady = () => {
    onLoad(editorRef.current);
  };

  subscribers.forEach((sub) => console.log(sub.name));

  const onLoad = async (editor) => {
    try {
      const response = await fetch(
        `http://localhost:3001/mail/loadDesign/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const design = await response.json();

      editorRef.current.loadDesign(design.design);
      setTitle(design.title);
    } catch (error) {
      // alert("Error loading design:", error);
    }
    editorRef.current = editor;
  };

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

  console.log(emailSent);

  return (
    <div>
      <h1 className="text-center">Mail Editor</h1>
      <div className="p-2 gap-3 d-flex justify-content-center">
        {designSaved && (
          <Alert
            variant="success"
            onClose={() => setDesignSaved(false)}
            dismissible
          >
            Design is succesvol opgeslagen!
          </Alert>
        )}
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
        <button onClick={saveDesign} className="btn btn-primary">
          Design Opslaan
        </button>
        <button onClick={sendEmail} className="btn btn-primary">
          Email Versturen
        </button>
      </div>

      <Modal show={show} onHide={handleClose} size="xl">
        {emailSent && (
          <div className="alert alert-success" role="alert">
            E-mail is succesvol verstuurd!
          </div>
        )}
        <Modal.Header closeButton>
          <Modal.Title>Wil je '{title}' verturen?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SelectMailingLists
            id={id}
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
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSendEmailClick}>
            {planned ? "Plan Mail" : "Mail Versturen"}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Annuleren
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MailEditor;
