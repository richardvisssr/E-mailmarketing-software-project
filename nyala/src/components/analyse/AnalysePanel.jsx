"use client";
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AlertComponent from "../alert/AlertComponent";
import UnsubscribeReasonChart from "./ReasonChart";
import MailListChart from "./MaillistChart";
import Cookies from "js-cookie";

export default function AnalysePanel() {
  const socket = new WebSocket("ws://127.0.0.1:7002/socket");
  const [reasonData, setReasonData] = useState([]);
  const [mailListData, setMailListData] = useState([]);
  const [change, setChange] = useState(false);
  const token = Cookies.get("token");
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

  socket.addEventListener("open", (event) => {});

  /**
   * Event listener for WebSocket messages. Handles incoming messages and triggers
   * a state change if the message type is "unsubscribe". Displays an error
   * notification if there is an issue parsing the message.
   *
   * @param {MessageEvent} event - The WebSocket message event.
   */
  socket.addEventListener("message", (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === "unsubscribe") {
        setChange(true);
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Er ging iets mis bij het ontvangen van de data",
      });
    }
  });

  /**
   * Fetches and sets the unsubscribe reasons from the server.
   * Displays an error notification if there is an issue fetching the data.
   */
  const getUnsubscribeReasons = async () => {
    try {
      const response = await fetch("http://localhost:3001/unsubscribeReasons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.length === 0) {
        setReasonNotification({
          type: "error",
          message:
            "Er zijn nog geen redenen om uit te schrijven om weer te geven",
        });
        return;
      }

      setReasonData(
        data.map((item) => {
          return { reason: item.reason, count: item.count };
        })
      );
      setReasonNotification({
        type: "",
        message: "",
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: "Er ging iets mis bij het ophalen van de data",
      });
    }
  };

  /**
   * Fetches and sets the mailing list data from the server.
   * Displays an error notification if there is an issue fetching the data.
   */
  const getMailList = async () => {
    try {
      const response = await fetch("http://localhost:3001/unsubscribe/count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.length === 0) {
        setListNotifcation({
          type: "error",
          message: "Er zijn nog geen mailings om weer te geven",
        });
        return;
      }

      setMailListData(data);
      setListNotifcation({
        type: "",
        message: "",
      });
    } catch (error) {
      setListNotifcation({
        type: "error",
        message: "Er ging iets mis bij het ophalen van de data",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    getUnsubscribeReasons();
    getMailList();
    setChange(false);
  }, [change]);

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
    </Container>
  );
}
