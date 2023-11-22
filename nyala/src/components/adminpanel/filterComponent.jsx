import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import styles from "@/components/adminpanel/button.module.css";

function FilterPanel() {
  const [sortByLastChanged, setSortByLastChanged] = useState(false);
  const [filter, setFilter] = useState({
    title: "",
    category: "",
    sortByLastChanged: false,
  });

  const handleTitleChange = (e) => {
    setFilter({ ...filter, title: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setFilter({ ...filter, category: e.target.value });
  };

  const handleSortChange = () => {
    setSortByLastChanged(!sortByLastChanged);
    setFilter({ ...filter, sortByLastChanged: !sortByLastChanged });
  };

  const handleClick = () => {
    if (filter.title === "" || filter.category === "") {
      alert("Please fill in a title or category");
    } else {
      console.log("Filter object: ", filter);
    }
  };

  return (
    <Card style={{ height: "100vh" }}>
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
                  onChange={handleTitleChange}
                />
              </FormGroup>
            </div>
            <div className="col-md-6 mb-3">
              <FormGroup>
                <Form.Label>Categorie</Form.Label>
                <Form.Select onChange={handleCategoryChange}>
                  <option>Alle categorieën</option>
                  <option>Nieuwsbrieven</option>
                  <option>CMD</option>
                  <option>ICT</option>
                </Form.Select>
              </FormGroup>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <FormGroup>
                <Form.Label>
                  Laatst gewijzigd
                  <Form.Check
                    type="checkbox"
                    label="Sorteer op datum"
                    onChange={handleSortChange}
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
                  onClick={handleClick}
                >
                  Filter
                </Button>
              </FormGroup>
            </div>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default FilterPanel;
