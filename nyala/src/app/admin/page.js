"use client";
import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import FilterPanel from "@/components/adminpanel/FilterComponent";
import CardList from "@/components/adminpanel/CardListComponent";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Link from "next/link";

function Page() {
  const [templates, setTemplates] = useState({});
  const [error, setError] = useState(false);

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
      } catch (error) {
        setError(true);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <Row>
        <Col md={4}>
          <FilterPanel />
        </Col>
        <Col md={8}>
          {error && (
            <Alert key="danger" variant="danger">
              Er is een fout opgetreden bij het ophalen van de templates...
            </Alert>
          )}
          <CardList templates={templates} />
        </Col>
      </Row>
    </Container>
  );
}

export default Page;
