"use client";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Modal, Button, Placeholder } from "react-bootstrap";
import AbonnementSelecteren from "./MailVersturen";

// Use dynamic import to load the EmailEditor component only on the client side
const EmailEditor = dynamic(() => import("react-email-editor"), { ssr: false });

const MailBewerken = ({ id }) => {
  const editorRef = useRef(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  console.log(id);

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

      console.log(design);
    });
  };

  const sendEmail = () => {
    editorRef.current.exportHtml(async (data) => {
      const { design, html } = data;
      console.log("exportHtml", html);
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
    // editor is ready
    console.log("onReady");
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

      {/* Place the Modal here */}
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Wil je '{}' versturen?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Placeholder as={Modal.Body} animation="glow">
            <AbonnementSelecteren/>
          </Placeholder>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuleren
          </Button>
          <Button>Versturen</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MailBewerken;
