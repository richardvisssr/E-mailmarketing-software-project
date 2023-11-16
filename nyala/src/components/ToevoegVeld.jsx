import { useEffect, useState } from "react";
import styles from "./ToevoegVeld.module.css";
import AbonnementenFormulier from "./categorieeënComponent";

export default function ToevoegVeld(props) {
  const [data, setData] = useState({ email: undefined, lijst: [] });
  const [status, setStatus] = useState(false);
  const [foutmelding, setFoutmelding] = useState("");
  const [succes, setSucces] = useState(false);
  const [lijsten, setLijsten] = useState([
    "ICT",
    "CMD",
    "Leden",
    "Nieuwsbrief",
  ]);

  useEffect(() => {
    if (status) {
      const postEmail = async () => {
        // const response = await fetch(`http://localhost:3001/subscribers/add`, {
        //   method: "POST",
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     email: data.email,
        //     lijst: data.lijst,
        //   }),
        // });
        // if (response.ok) {
        //   setData({ email: undefined, lijst: undefined });
        //   setStatus(false);
        //   setSucces(true);
        // } else if (!response.ok) {
        //   setSucces(false);
        // }
        console.log(data);
      };
      postEmail();
    }
  }, [status]);

  const melding = !succes ? (
    <></>
  ) : (
    <div className="alert alert-success d-flex justify-content-around" role="alert">
      <p>Email succesvol toegevoegd.</p>
      <i class="bi bi-check"></i>
    </div>
  );

  const err =
    foutmelding === "" ? (
      <></>
    ) : (
      <div
        className="alert alert-danger d-flex justify-content-around"
        role="alert"
      >
        <p>{foutmelding}</p>
        <i className="bi bi-exclamation-triangle"></i>
      </div>
    );

  const handleSubmit = (event) => {
    event.preventDefault();

    let inLijsten = true;

    if (data.lijst.length === 0) {
      inLijsten = false;
    } else {
      data.lijst.forEach((lijst) => {
        if (!lijsten.includes(lijst)) {
          inLijsten = false;
        }
      });
    }

    if (data.email === "") {
      setFoutmelding("Het emailadres is niet ingevuld.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setFoutmelding("Het emailadres is geen valide formaat!");
    } else if (data.lijst.length === 0) {
      setFoutmelding("De mailinglijst is niet ingevuld.");
    } else if (inLijsten === false) {
      setFoutmelding("De gekozen mailinglijst bestaat niet.");
    } else {
      setSucces(true);
      setStatus(true);
    }
  };

  const handleEmailChange = (event) => {
    setData({ ...data, email: event.target.value });
  };

  const handleCheckboxChange = (event) => {
    const listName = event.target.value;
    console.log(listName);
    const isSelected = data.lijst.includes(listName);

    if (isSelected) {
      setData({
        ...data,
        lijst: [...data.lijst.filter((list) => list !== listName)],
      });
    } else {
      setData({ ...data, lijst: [...data.lijst, listName] });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div>
        <div>{melding}</div>
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
              <AbonnementenFormulier
                abonnees={lijsten}
                setValue={handleCheckboxChange}
              />
            <div className={`${styles.selectContainer}`}></div>
          </div>
          <input
            type="submit"
            className={`btn ${styles.knop} rounded`}
            value="Toevoegen"
          />
        </form>
      </div>
      {data.lijst.map((lijst) => {
        <p>{lijst}</p>;
      })}
    </div>
  );
}
