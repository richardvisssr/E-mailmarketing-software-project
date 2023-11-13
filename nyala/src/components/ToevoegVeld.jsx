import { useEffect, useState } from "react";
import styles from "../app/handmatigToevoegen/toevoeg.module.css";

export default function ToevoegVeld(props) {
  const [email, setEmail] = useState("");
  const [foutmelding, setFoutmelding] = useState("");

  useEffect(() => {
    if (email !== "") {
      const postEmail = async () => {
        const response = fetch("", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loginCode: loginCode,
          }),
        });

        if (response === "insert foutmelding") {
          setFoutmelding(response);
        }
      };
      // postEmail();
    }
  }, [setEmail]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div>
        <div className={`input-group ${styles.vorm}`}>
          <label htmlFor="vorm" className={`${styles.label} mb-1`}>
            Vul een email in, om toe te voegen aan een emaillijst*
          </label>
          <input
            type="text"
            className={`form-control ${styles.invoer}`}
            placeholder="Email"
            aria-describedby="basic-addon1"
            id="vorm"
          />
        </div>
      </div>
    </div>
  );
}
