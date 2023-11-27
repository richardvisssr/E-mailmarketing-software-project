"use client";
import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import CardList from "@/components/adminpanel/CardListComponent";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import styles from "@/components/adminpanel/button.module.css";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

function Page() {
  const [templates, setTemplates] = useState({});
  const [error, setError] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3001/templates");
        const jsonData = await response.json();
        const templateObject = {};

        jsonData.forEach((template, index) => {
          const templateId = `template${index + 1}`;
          const bodyId = template.id;
          templateObject[templateId] = {
            id: bodyId,
            title: `Template ${bodyId}`,
          };
        });
        setTemplates(templateObject);
        setIsLoading(false);
      } catch (error) {
        setError(true);
      }
    };

    fetchData();
  }, []);

  function generateUniqueShortId() {
    return nanoid(); // Generates a unique short ID
  }

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };
  const filteredTemplates = Object.values(templates).filter((template) =>
    template.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const navigateToEditor = () => {
    const newTemplateId = generateUniqueShortId();
    router.push(`/admin/mail/${newTemplateId}`);
    
  };

  return (
    <Container>
      <Row>
        <Col md={4}>
          <Card style={{ height: "fit-content" }}>
            <Card.Body className="p-4">
              <Card.Title>Filter</Card.Title>
              <Form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <FormGroup>
                      <Form.Label>Titel</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Vul hier de titel in"
                        value={searchValue}
                        onChange={handleSearchChange}
                      />
                    </FormGroup>
                  </div>
                  {/* <div className="col-md-6 mb-3">
                    <FormGroup>
                      <Form.Label>Categorie</Form.Label>
                      <Form.Select>
                        <option>Alle categorieën</option>
                        <option>Nieuwsbrieven</option>
                        <option>CMD</option>
                        <option>ICT</option>
                      </Form.Select>
                    </FormGroup>
                  </div> */}
                </div>

                {/* <div className="row">
                  <div className="col-md-6 mb-3">
                    <FormGroup>
                      <Form.Label>
                        Laatst gewijzigd
                        <Form.Check
                          type="checkbox"
                          label="Sorteer op datum"
                        />
                      </Form.Label>
                    </FormGroup>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <FormGroup>
                      <Button
                        variant="primary"
                        className={`${styles.knopPrimary}`}
                        size="sm"
                      >
                        Filter
                      </Button>
                    </FormGroup>
                  </div>
                </div> */}
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          {error && (
            <Alert key="danger" variant="danger">
              Er is een fout opgetreden bij het ophalen van de templates...
            </Alert>
          )}
          <Col md={{ span: 11, offset: 11 }} className="text-right mb-3">
            <Button
              variant="primary"
              className={styles.knopPrimary}
              onClick={navigateToEditor}
            >
              <i className="bi bi-plus">Nieuwe template</i>
            </Button>
          </Col>
          {!isLoading && <CardList templates={filteredTemplates} />}
        </Col>
      </Row>
    </Container>
  );
}

export default Page;
