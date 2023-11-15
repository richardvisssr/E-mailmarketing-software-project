import { useEffect, useState } from "react";
import styles from "./ToevoegVeld.module.css";

export default function ToevoegVeld(props) {
  const [data, setData] = useState({ email: "", lijst: "" });
  const [foutmelding, setFoutmelding] = useState("");

  useEffect(() => {
    if (data.email !== "") {
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
  }, [data]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div>
        <div className={`input-group ${styles.vorm} d-flex flex-column`}>
          <label htmlFor="vorm" className={`${styles.label} mb-2 rounded`}>
            Vul een email in, om toe te voegen aan een emaillijst
          </label>
          <div id="vorm">
            <input
              type="text"
              className={`form-control ${styles.invoer} p-2 mb-3`}
              placeholder="Email"
              aria-describedby="basic-addon1"
            />
            <div className={`${styles.selectContainer}`}>
              <select
                className={`form-select`}
                aria-label="Mailinglijst"
              >
                <option selected>Kies een mailinglijst</option>
                <option value="Leden">Leden</option>
                <option value="Nieuwsbrief">Nieuwsbrief</option>
                <option value="ICT">ICT</option>
                <option value="CMD">CMD</option>
              </select>
            </div>
          </div>
          <button type="button" className={`btn ${styles.knop} rounded mt-3`}>
            Toevoegen
          </button>
        </div>
      </div>
    </div>
  );
}
