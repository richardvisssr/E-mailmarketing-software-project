import { useEffect, useState } from "react";
import styles from "../app/handmatigToevoegen/toevoeg.module.css";

export default function ToevoegVeld(props) {
  const [data, setData] = useState({ email: "", lijst: "" });
  const [status, setStatus] = useState(false);
  const [foutmelding, setFoutmelding] = useState("");

  useEffect(() => {
    if (status) {
      const postEmail = async () => {
        const response = fetch(`http://localhost:3001/subscribers/add`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            lijst: lijst,
          }),
        });
        if (response === "insert foutmelding") {
          setFoutmelding(response);
        }
      };
      // postEmail();
    }
  }, [status]);

  const err =
    foutmelding === "" ? (
      <></>
    ) : (
      <div class="alert alert-danger" role="alert">
        {foutmelding}
      </div>
    );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (data.email === "") {
      setFoutmelding("Het emailadres is niet ingevuld!");
    } else if (data.lijst === "") {
      setFoutmelding("Het emailadres is niet ingevuld!");
    } else {
      setStatus(true);
    }
  };

  const handleEmailChange = (event) => {
    setData({ ...data, email: event.target.value });
  };

  const handleLijstChange = (event) => {
    setData({ ...data, lijst: event.target.value });
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div>
        <div>{err}</div>
        <form
          className={`input-group ${styles.vorm} d-flex flex-column`}
          onSubmit={handleSubmit}
        >
          <label htmlFor="vorm" className={`${styles.label} mb-2 rounded`}>
            Vul een email in, om toe te voegen aan een emaillijst
          </label>
          <div id="vorm">
            <input
              type="text"
              className={`form-control ${styles.invoer} p-2 mb-3`}
              placeholder="Email"
              aria-describedby="basic-addon1"
              onChange={handleEmailChange}
            />

            <input
              type="text"
              className={`form-control ${styles.invoer} p-2 mb-2 rounded`}
              placeholder="Lijst"
              aria-describedby="basic-addon1"
              onChange={handleLijstChange}
            />
          </div>
          <input
            type="submit"
            className={`btn ${styles.knop} rounded`}
            value="Toevoegen"
          />
        </form>
      </div>
    </div>
  );
}
