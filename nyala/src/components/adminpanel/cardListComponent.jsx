import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const { default: TemplateCard } = require("./TemplateCardComponent");

function CardList(props) {
  const templates = props.templates;
  console.log('Hier in de cardListComponent');
  
  return (
    <Row xs={1} md={3} className="g-4">
      {Object.values(templates).map((template, idx) => (
        <TemplateCard
          key={idx}
          template={template}
        />
      ))}
    </Row>
  );
}

export default CardList;
