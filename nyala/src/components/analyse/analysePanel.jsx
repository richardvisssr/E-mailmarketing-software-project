"use client";
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AlertComponent from "../alert/AlertComponent";
import UnsubscribeReasonChart from "./reasonChart";
import styles from "./analyse.module.css";

export default function AnalysePanel() {
  const [reasonData, setReasonData] = useState([]);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  const getUnsubscribeReasons = async () => {
    try {
      const response = await fetch("http://localhost:3001/unsubscribeReasons");
      const data = await response.json();

      if (data.length === 0) {
        setNotification({
          type: "error",
          message:
            "Er zijn nog geen redenen om uit te schrijven om weer te geven",
        });
        return;
      }

      const reasonCounts = {};
      data.forEach((item) => {
        const reason = item.reason;
        if (reasonCounts[reason]) {
          reasonCounts[reason] += 1;
        } else {
          reasonCounts[reason] = 1;
        }
      });

      setReasonData(
        Object.entries(reasonCounts).map(([reason, count]) => ({
          reason,
          count,
        }))
      );
    } catch (error) {
      setNotification({
        type: "error",
        message: "Error fetching unsubscribe reasons",
      });
    }
  };

  useEffect(() => {
    getUnsubscribeReasons();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col>
          <AlertComponent notification={notification} />
          <UnsubscribeReasonChart reasonData={reasonData} />
        </Col>
        <Col></Col>
      </Row>

      <Row>
        <Col></Col>
        <Col></Col>
      </Row>
    </Container>
  );
}
