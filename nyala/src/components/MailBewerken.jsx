"use client";
import React, { useRef } from "react";
import dynamic from "next/dynamic";

// Use dynamic import to load the EmailEditor component only on the client side
const EmailEditor = dynamic(() => import("react-email-editor"), { ssr: false });

const MailBewerken = () => {
  const editorRef = useRef(null);

  const saveDesign = () => {
    editorRef.current.saveDesign((design) => {
      console.log("saveDesign", design);
    });
  };

  const exportHtml = () => {
    editorRef.current.exportHtml((data) => {
      const { design, html } = data;
      console.log("exportHtml", html);
    });
  };

  const exportImage = () => {
    editorRef.current.exportImage((data) => {
      const { design, url } = data;
      console.log("exportHtml", url);
      // let url = 'saveImage'; // Replace with your API URL
      // let options = {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // Add any other headers your API requires
      //   },
      //   body: JSON.stringify({
      //     displayMode: 'email',
      //     design: design, // use the saved design
      //     // Add any other data your API requires
      //   })
      // };
  
      // fetch(url, options)
      //   .then(res => res.json())
      //   .then(json => console.log(json))
      //   .catch(err => console.error('error:' + err));
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
    // emailEditorRef.current.loadDesign(templateJson);
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
      <div class="p-2 gap-3 d-flex justify-content-center">
        <button onClick={saveDesign} className="btn btn-primary">
          Save Design
        </button>
        <button onClick={exportImage} className="btn btn-secondary">
          Export Image
        </button>
      </div>
    </div>
  );
};

export default MailBewerken;
