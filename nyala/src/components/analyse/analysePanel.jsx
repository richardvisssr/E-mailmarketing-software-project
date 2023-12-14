"use client";
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AlertComponent from "../alert/AlertComponent";
import UnsubscribeReasonChart from "./ReasonChart";
import MailListChart from "./MaillistChart";
import styles from "./analyse.module.css";

export default function AnalysePanel() {
  const [reasonData, setReasonData] = useState([]);
  const [mailListData, setMailListData] = useState([]);
  const [reasonNotification, setReasonNotification] = useState({
    type: "",
    message: "",
  });
  const [listNotification, setListNotifcation] = useState({
    type: "",
    message: "",
  });
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  const getUnsubscribeReasons = async () => {
    try {
      const response = await fetch("http://localhost:3001/unsubscribeReasons");
      const data = await response.json();

      if (data.length === 0) {
        setReasonNotification({
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

  const getMailList = async () => {
    try {
      const response = await fetch("http://localhost:3001/unsubscribe/count");
      const data = await response.json();

      console.log(data);
      setMailListData(data);

      if (data.length === 0) {
        setListNotifcation({
          type: "error",
          message: "Er zijn nog geen mailings om weer te geven",
        });
        return;
      }
    } catch (error) {
      setListNotifcation({
        type: "error",
        message: "Error fetching mail list",
      });
    }
  };

  useEffect(() => {
    getUnsubscribeReasons();
    getMailList();
  }, []);

  return (
    <Container>
      <Row>
        <Col sm={6}>
          <AlertComponent notification={reasonNotification} />
          <UnsubscribeReasonChart reasonData={reasonData} />
        </Col>
        <Col sm={6}>
          <AlertComponent notification={listNotification} />
          <MailListChart mailListData={mailListData} />
        </Col>
      </Row>

      <Row>
        <Col sm={6}>
          <h1> test </h1>
        </Col>
        <Col sm={6}>
          <h1> test </h1>
        </Col>
      </Row>
    </Container>
  );
}
