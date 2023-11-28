import { useEffect, useState } from "react";
import styles from "./SubscribeLinkButton.module.css";

const protocol = `http`; // e.g. https
const domain = `localhost:3000`; // e.g. svxtend.nl

export default function SubscribeLinkButton(props) {
  // In de props moet de list mee worden gegeven
  const list = props.list;
  const link = `${protocol}://${domain}/${list}/subscribe`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
  };

  return (
    <div className={`${styles.around} input-group-prepend`}>
      <input
        type="submit"
        className={`btn ${styles.buttonPrimary} rounded p-2`}
        value="Link naar de lijst kopiëren"
        onClick={handleCopy}
      />
    </div>
  );
}
