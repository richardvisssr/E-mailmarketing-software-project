import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import style from "./Settings.module.css";
import Cookies from "js-cookie";

function SettingsComponent() {
  const [intervalTime, setIntervalTime] = useState("");
  const [expirationTime, setExpirationTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const [shouldUpdateInterval, setUpdateInterval] = useState(false);
  const [shouldUpdateExpiration, setUpdateExpiration] = useState(false);
  const [shouldUpdateActivityLog, setUpdateActivityLog] = useState(false);
  const token = Cookies.get("token");

  const handleIntervalChange = (e) => {
    setIntervalTime(e.target.value);
    setUpdateInterval(true);
    console.log(e.target.value);
  };

  const handleExpirationChange = (e) => {
    setExpirationTime(e.target.value);
    setUpdateExpiration(true);
  };

  const handleChecked = (e) => {
    setChecked(e.target.checked);
    setUpdateActivityLog(true);
    console.log(e.target.checked);
  };

  const handleCopy = () => {
    console.log("copy");
  };

  const handleGenerate = () => {
    console.log("generate");
  };

  useEffect(() => {
    const retrieveSettings = async () => {
      const response = await fetch("http://localhost:3001/settings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setChecked(data.activityLog);
        setExpirationTime(data.expirationTime);
        setIntervalTime(data.intervalTime);
        setLoading(false);
      } else {
        console.log("Settings not retrieved");
      }
    };
    retrieveSettings();
  }, []);

  useEffect(() => {
    const updateInterval = async () => {
      const response = await fetch("http://localhost:3001/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          intervalTime: intervalTime,
        }),
      });

      if (response.ok) {
        console.log("Interval time updated");
      } else {
        console.log("Interval time not updated");
      }
    };

    if (shouldUpdateInterval) {
      updateInterval();
      setUpdateInterval(false);
    }
  }, [shouldUpdateInterval]);

  useEffect(() => {
    const updateExpiration = async () => {
      const response = await fetch("http://localhost:3001/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          expirationTime: expirationTime,
        }),
      });

      if (response.ok) {
        console.log("Expiration time updated");
      } else {
        console.log("Expiration time not updated");
      }
    };

    if (shouldUpdateExpiration) {
      updateExpiration();
      setUpdateExpiration(false);
    }
  }, [shouldUpdateExpiration]);

  useEffect(() => {
    const updateActivityLog = async () => {
      const response = await fetch("http://localhost:3001/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          activityLog: checked,
        }),
      });

      if (response.ok) {
        console.log("Activity log updated");
      } else {
        console.log("Activity log not updated");
      }
    };

    if (shouldUpdateActivityLog) {
      updateActivityLog();
      setUpdateActivityLog(false);
    }
  }, [shouldUpdateActivityLog]);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8 mx-auto">
          <h2 className="h3 mb-4 page-title">Instellingen</h2>
          <div className="my-4">
            <ul className="nav nav-tabs mb-4" id="myTab" role="tablist">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  id="profile-tab"
                  data-toggle="tab"
                  href="#profile"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="false"
                >
                  Algemeen
                </a>
              </li>
            </ul>
            <h5 className="mb-0 mt-5">Algemene Instellingen</h5>
            <p>
              Beheer algemene instellingen met betrekking tot de applicatie. Aangepaste instellingen worden direct opgeslagen en toegepast.
            </p>
            {!loading ? (
              <div className="list-group mb-5 shadow">
                <div className="list-group-item">
                  <div className="row align-items-center">
                    <div className="col">
                      <strong className="mb-2">
                        Inschakelen Activiteitlogboek
                      </strong>
                      <p className="text-muted mb-0">
                        Wanneer ingeschakeld, worden alle activiteiten met
                        betrekking tot uw account gelogd en weergegeven in het
                        logboek hier beneden.
                      </p>
                    </div>
                    <div className="col-auto">
                      <div className="custom-control custom-switch">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="activityLog"
                          onChange={handleChecked}
                          checked={checked}
                        />
                        <span className="custom-control-label"></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="row align-items-center">
                    <div className="col">
                      <strong className="mb-2">API-sleutel</strong>
                      <span className="badge badge-pill badge-success">
                        Gekopieërd
                      </span>
                      <p className="text-muted mb-0">
                        Genereer een nieuwe API-sleutel of kopieër de huidige
                        API-sleutel voor gebruik in externe applicaties.
                      </p>
                    </div>
                    <div className="col-auto">
                      <button
                        className="btn btn-primary btn-sm me-1"
                        onClick={handleCopy}
                      >
                        Kopieër
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleGenerate}
                      >
                        <i className="bi bi-arrow-repeat"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="row align-items-center">
                    <div className="col">
                      <strong className="mb-2">
                        Vervaltijd tijdelijke token
                      </strong>
                      <p className="text-muted mb-0">
                        De maximale tijd in minuten dat een tijdelijke token
                        geldig is. Deze token wordt verschaft aan een subcriber
                        om mails online te kunnen bekijken of zich in/ uit te
                        kunnen schrijven.
                      </p>
                    </div>
                    <div className="col-auto">
                      <div className="custom-control custom-switch">
                        <select
                          name="time"
                          onChange={handleExpirationChange}
                          value={expirationTime}
                        >
                          <option value="5">5 minuten</option>
                          <option value="10">10 minuten</option>
                          <option value="15">15 minuten</option>
                          <option value="30">30 minuten</option>
                          <option value="60">1 uur</option>
                        </select>
                        <span className="custom-control-label"></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="row align-items-center">
                    <div className="col">
                      <strong className="mb-2">
                        Intervaltijd geplande mails
                      </strong>
                      <p className="text-muted mb-0">
                        De tijd in minuten wanneer de server moet controleren of
                        er mails verstuurd moeten worden.
                      </p>
                    </div>
                    <div className="col-auto">
                      <div className="custom-control custom-switch">
                        <select
                          name="plannedMails"
                          onChange={handleIntervalChange}
                          value={intervalTime}
                        >
                          <option value="1">1 minuut</option>
                          <option value="5">5 minuten</option>
                          <option value="10">10 minuten</option>
                          <option value="15">15 minuten</option>
                          <option value="30">30 minuten</option>
                          <option value="60">1 uur</option>
                        </select>
                        <span className="custom-control-label"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}

            <h5 className="mb-0">Recente activiteit</h5>
            <p>Laatste activiteiten met uw account.</p>
            <table className="table border bg-white">
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Location</th>
                  <th>IP</th>
                  <th>Time</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="col">
                    <i className="fe fe-globe fe-12 text-muted mr-2"></i>Chrome
                    - Windows 10
                  </th>
                  <td>Paris, France</td>
                  <td>192.168.1.10</td>
                  <td>Apr 24, 2019</td>
                  <td>
                    <a hreff="#" className="text-muted">
                      <i className="fe fe-x"></i>
                    </a>
                  </td>
                </tr>
                <tr>
                  <th scope="col">
                    <i className="fe fe-smartphone fe-12 text-muted mr-2"></i>
                    App - Mac OS
                  </th>
                  <td>Newyork, USA</td>
                  <td>10.0.0.10</td>
                  <td>Apr 24, 2019</td>
                  <td>
                    <a hreff="#" className="text-muted">
                      <i className="fe fe-x"></i>
                    </a>
                  </td>
                </tr>
                <tr>
                  <th scope="col">
                    <i className="fe fe-globe fe-12 text-muted mr-2"></i>Chrome
                    - iOS
                  </th>
                  <td>London, UK</td>
                  <td>255.255.255.0</td>
                  <td>Apr 24, 2019</td>
                  <td>
                    <a hreff="#" className="text-muted">
                      <i className="fe fe-x"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SettingsComponent;
