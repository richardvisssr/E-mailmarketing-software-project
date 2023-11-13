"use client";
import React, { useRef } from "react";
import dynamic from "next/dynamic";

// Use dynamic import to load the EmailEditor component only on the client side
const EmailEditor = dynamic(() => import("react-email-editor"), { ssr: false });

const MailBewerken = () => {
  const editorRef = useRef(null);

  const saveDesign = () => {
    editorRef.current.editor.saveDesign((design) => {
      console.log("saveDesign", design);
    });
  };

  const exportHtml = () => {
    editorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
      console.log("exportHtml", html);
    });
  };

  const onReady = () => {
    // editor is ready
    console.log("onReady");
  };

  const onLoad = (editor) => {
    // Set the editor instance to the ref
    // editor instance is created
    // you can load your template here;
    // const templateJson = {};
    // emailEditorRef.current.editor.loadDesign(templateJson);
    editorRef.current = editor;
  };

  return (
    <div>
      <button onClick={saveDesign}>Save Design</button>
      <button onClick={exportHtml}>Export HTML</button>
      <EmailEditor
        options={{
          locale: "nl-NL",
          tools: {
            html: {
              enabled: true,
            },
            customCSS: "bootstrap/dist/css/bootstrap.css",
          },
        }}
        ref={editorRef}
        onLoad={onLoad}
        onReady={onReady}
      />
    </div>
  );
};

export default MailBewerken;
