"use client";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Modal, Button, Placeholder } from "react-bootstrap";
import SelectMailingLists from "./SendMail";

const EmailEditor = dynamic(() => import("react-email-editor"), { ssr: false });

const MailEditor = ({ id }) => {
  const editorRef = useRef(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const saveDesign = () => {
    editorRef.current.saveDesign(async (design) => {
      try {
        const response = await fetch("http://localhost:3001/mail/saveDesign", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ design, id }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log("Design saved successfully");
      } catch (error) {
        console.error("Error saving design:", error);
      }
    });
  };

  const sendEmail = () => {
    editorRef.current.exportHtml(async (data) => {
      const { design, html } = data;
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
        console.error("Error sending email:", error);
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
        throw new Error("Network response was not ok");
      }

      const design = await response.json();

      editorRef.current.loadDesign(design);
    } catch (error) {
      console.error("Error loading design:", error);
    }
    editorRef.current = editor;
  };

  return (
    <div>
      <div>
        <EmailEditor
          options={{
            locale: "nl-NL",
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
          <Modal.Title>Wil je '{id}' verturen?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Placeholder as={Modal.Body} animation="glow">
            <SelectMailingLists />
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
