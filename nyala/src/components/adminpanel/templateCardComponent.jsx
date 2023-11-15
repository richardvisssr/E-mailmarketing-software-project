import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import styles from "./button.module.css";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function TemplateCard(props) {
  const { template, handleShow } = props;
  const router = useRouter();

  useEffect(() => {
    router.prefetch(`/mail/${template.id}`);
  }, [router, template.id]);

  const handleNavigate = () => {
    router.push(`/mail/${template.id}`);
  };

  return (
    <Col key={template.id} style={{ width: "16em" }}>
      <Card>
        <Card.Img variant="top" src="https://picsum.photos/200/50" />
        <Card.Body>
          <Card.Title>{template.title}</Card.Title>
          <div className="d-flex justify-content-between">
            <Button
              variant="primary"
              className={`${styles.knopSecondary}`}
              size="sm"
              onClick={handleNavigate}
            >
              Aanpassen
            </Button>
            <Button
              variant="primary"
              className={`ms-auto ${styles.knopPrimary}`}
              size="sm"
              onClick={handleShow}
            >
              Versturen
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default TemplateCard;
