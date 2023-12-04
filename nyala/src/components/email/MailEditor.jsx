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
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [title, setTitle] = useState("");

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
        setShowError(true);
        setErrorMessage(`Error saving design: ${error}`);
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
        setShowError(true);
        setErrorMessage(`Error sending email: ${error}`);
      }
      handleShow();
    });
  };

  const onReady = () => {
    onLoad(editorRef.current);
  };

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
        return
      }
  
      const design = await response.json();
  
      if (editorRef.current) {
        editorRef.current.loadDesign(design.design);
      }
      setTitle(design.title);
    } catch (error) {
      setShowError(true);
      setErrorMessage(`Error loading design: ${error}`);
    } finally {
      editorRef.current = editor;
    }
  };

  return (
    <div>
      <h1 className="text-center">Mail Editor</h1>
      <div className="p-2 gap-3 d-flex justify-content-center">
        {showError && (
          <Alert
            variant="danger"
            onClose={() => setShowError(false)}
            dismissible
          >
            {errorMessage}
          </Alert>
        )}
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
        <Modal.Header closeButton>
          <Modal.Title>Wil je '{title}' verturen?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Placeholder as={Modal.Body} animation="glow">
            <SelectMailingLists id={id} />
          </Placeholder>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuleren
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MailEditor;
