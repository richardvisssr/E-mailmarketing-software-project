import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import AlertComponent from "../alert/AlertComponent";
import { useState } from "react";

const { default: TemplateCard } = require("./TemplateCardComponent");

function CardList(props) {
  const [notification, setNotification] = useState({ type: "", message: "" });
  const templates = props.templates;
  const onDelete = props.onDelete;

  return (
    <div>
      <AlertComponent notification={notification}/>
      <Row xs={1} md={3} className="g-4">
        {Object.values(templates).length === 0 ? (
          <Alert key="dark" variant="dark">
            Er zijn geen templates gevonden die voldoen aan de zoekcriteria.
          </Alert>
        ) : (
          Object.values(templates).map((template, idx) => (
            <TemplateCard key={idx} template={template} onDelete={onDelete} setNotification={setNotification} />
          ))
        )}
      </Row>
    </div>
  );
}

export default CardList;
