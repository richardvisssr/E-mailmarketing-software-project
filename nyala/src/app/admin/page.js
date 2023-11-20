"use client";
import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import FilterPanel from "@/components/adminpanel/FilterComponent";
import CardList from "@/components/adminpanel/CardListComponent";


function Page() {
  const [templates, setTemplates] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3001/templates');
        const jsonData = await response.json();
        console.log('Fetched data:', jsonData);
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
        console.error('Error fetching data:', error);
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
          <CardList templates={templates}/>
        </Col>
      </Row>
    </Container>
  );
}

export default Page;
