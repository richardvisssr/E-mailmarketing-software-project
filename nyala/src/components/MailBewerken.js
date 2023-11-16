"use client";
import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Use dynamic import to load the EmailEditor component only on the client side
const EmailEditor = dynamic(() => import("react-email-editor"), { ssr: false });

const MailBewerken = ({ id }) => {
  const router = useRouter();
  const editorRef = useRef(null);

  const saveDesign = () => {
    editorRef.current.saveDesign(async (design) => {
      try {
        const response = await fetch("http://localhost:3001/mail/saveDesign", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(design),
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
      // Navigeer naar MailVersturen-pagina met html als een query parameter
      try {
        const response = await fetch("http://localhost:3001/mail/sendEmail", {
          method: "POST",
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
      router.push(`/mail/${id}/versturen`);
    });
  };

  const onReady = () => {
    // editor is ready
    console.log("onReady");
    onLoad(editorRef.current);
  };

  // const onLoad = (editor) => {
  //   // Set the editor instance to the ref
  //   // editor instance is created
  //   // you can load your template here;
  //   // const templateJson = {};
  //   // emailEditorRef.current.loadDesign(templateJson);
  //   editorRef.current = editor;
  // };

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
          Save Design
        </button>
        <button onClick={sendEmail} className="btn btn-primary">
          Send Email
        </button>
      </div>
    </div>
  );
};

export default MailBewerken;
