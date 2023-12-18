import React from "react";
import { ProgressBar } from "react-bootstrap";

export default function Progress({ text, count, total }) {
  const calculatePercentage = (part, everything) => {
    return (part / everything) * 100;
  };

  return (
    <div>
      <div>
        <h1> {text} </h1>
      </div>
      <ProgressBar
        now={count}
        max={total}
        label={`${calculatePercentage(count, total)}%`}
        striped
        variant="info"
        style={{ height: "30px" }}
      />
    </div>
  );
}
