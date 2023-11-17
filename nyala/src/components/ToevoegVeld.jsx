import { useEffect, useState } from "react";
import styles from "./ToevoegVeld.module.css";
import AbonnementenFormulier from "./categorieeënComponent";

export default function ToevoegVeld(props) {
  const [data, setData] = useState({ email: undefined, lijst: [] });
  const [status, setStatus] = useState(false);
  const [lijsten, setLijsten] = useState([]);
  const [toevoegen, setToevoegen] = useState(false);
  const [melding, setMelding] = useState({ type: "", bericht: "" });
  const [lijst, setLijst] = useState("");

  useEffect(() => {
    const fetchLijsten = async () => {
      const response = await fetch("http://localhost:3001/mail/getList");
      const body = await response.json();
      if (!response.ok) {
        setMelding({
          type: "foutmelding",
          bericht: "Er is iets foutgegaan tijdens het ophalen",
        });
      }
      setLijsten(body[0].mailLijst);
    };
    fetchLijsten();

    if (status) {
      const postEmail = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/subscribers/add`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: data.email,
                abonnement: data.lijst,
              }),
            }
          );
          if (response.ok) {
            setData({ email: undefined, lijst: [] });
            setStatus(false);
            setMelding({
              type: "succes",
              bericht: "Email succesvol toegevoegd.",
            });
          } else if (!response.ok) {
            setMelding({
              type: "foutmelding",
              bericht:
                "Er heeft zich een fout opgetreden tijdens het toevoegen van de mail.",
            });
            setSucces(false);
          }
        } catch (error) {
          setMelding({
            type: "foutmelding",
            bericht:
              "Er heeft zich een fout opgetreden tijdens het toevoegen van de mail.",
          });
          setSucces(false);
        }
      };
      postEmail();
    }
  }, [status]);

  useEffect(() => {
    if (lijst !== "") {
      const postLijsten = async () => {
        try {
          const response = await fetch("http://localhost:3001/mail/addList", {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: lijst,
            }),
          });
          if (response.ok) {
            setMelding({
              type: "succes",
              bericht: "De lijst is succesvol toegevoegd",
            });
          } else if (!response.ok) {
            setMelding({
              type: "foutmelding",
              bericht:
                "Er heeft zich een fout opgetreden tijdens het toevoegen van de lijst.",
            });
          }
        } catch (error) {
          setMelding({
            type: "foutmelding",
            bericht:
              "Er heeft zich een fout opgetreden tijdens het toevoegen van de lijst.",
          });
        }
      };
      postLijsten();
    }
  }, [lijsten]);

  const handleLijstToevoegen = (event) => {
    event.preventDefault();

    if (lijst === "") {
      setMelding({
        type: "foutmelding",
        bericht: "De lijst is niet ingevuld.",
      });
    } else {
      setLijsten([...lijsten, lijst]);
      setToevoegen(false);
    }
  };

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
      setMelding({
        type: "foutmelding",
        bericht: "Het emailadres is niet ingevuld.",
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setMelding({
        type: "foutmelding",
        bericht: "Het emailadres is geen valide formaat.",
      });
    } else if (data.lijst.length === 0) {
      setMelding({
        type: "foutmelding",
        bericht: "Er is geen mailinglijst gekozen.",
      });
    } else if (data.lijst.length > lijsten.length) {
      setMelding({
        type: "foutmelding",
        bericht: "Er zijn te veel mailinglijsten gekozen.",
      });
    } else if (inLijsten === false) {
      setMelding({
        type: "foutmelding",
        bericht: "De gekozen mailinglijst bestaat niet.",
      });
    } else {
      setStatus(true);
    }
  };

  const handleEmailChange = (event) => {
    if (melding.type === "succes") {
      setMelding({ type: "", bericht: "" });
    }
    setData({ ...data, email: event.target.value });
  };

  const handleCheckboxChange = (event) => {
    if (melding.type === "succes") {
      setMelding({ type: "", bericht: "" });
    }
    const listName = event.target.value;
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
        <div>
          {melding.type !== "succes" ? (
            <></>
          ) : (
            <div
              className="alert alert-success d-flex justify-content-around"
              role="alert"
            >
              <p>{melding.bericht}</p>
              <i className="bi bi-check"></i>
            </div>
          )}
        </div>
        <div>
          {melding.type !== "foutmelding" ? (
            <></>
          ) : (
            <div
              className="alert alert-danger d-flex justify-content-around"
              role="alert"
            >
              <p>{melding.bericht}</p>
              <i className="bi bi-exclamation-triangle"></i>
            </div>
          )}
        </div>
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
              value={data.email || ""}
            />
            <div>
              {lijsten.length > 0 ? (
                <AbonnementenFormulier
                  abonnees={lijsten}
                  setValue={handleCheckboxChange}
                />
              ) : (
                <></>
              )}
              {toevoegen ? (
                <div
                  className={`input-group ${styles.vorm} d-flex justify-items-center align-content-center`}
                >
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className={`form-control ${styles.invoer} p-2`}
                      placeholder="Lijst"
                      aria-describedby="basic-addon1"
                      onChange={(e) => {
                        const value = e.target.value;
                        setLijst(value);
                      }}
                    />
                    <div className={`${styles.eromheen} input-group-prepend`}>
                      <input
                        type="submit"
                        className={`btn ${styles.knopPrimary} rounded p-2`}
                        value="Lijst toevoegen"
                        onClick={handleLijstToevoegen}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  className={`btn ${styles.knopPrimary} rounded`}
                  onClick={() => {
                    setToevoegen(true);
                  }}
                >
                  Lijst aanmaken
                </button>
              )}
            </div>

            <div className={`${styles.selectContainer}`}></div>
          </div>
          <input
            type="submit"
            className={`btn ${styles.knopPrimary} rounded mt-4`}
            value="Lid toevoegen"
          />
        </form>
      </div>
    </div>
  );
}
