import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";

const { default: TemplateCard } = require("./TemplateCardComponent");

function CardList(props) {
  const templates = props.templates;
  const onDelete = props.onDelete;

  return (
    <Row xs={1} md={3} className="g-4">
      {Object.values(templates).length === 0 ? (
        <Alert key="dark" variant="dark">
          Er zijn geen templates gevonden die voldoen aan de zoekcriteria.
        </Alert>
      ) : (
        Object.values(templates).map((template, idx) => (
          <TemplateCard key={idx} template={template} onDelete={onDelete} />
        ))
      )}
    </Row>
  );
}

export default CardList;
