import { useEffect, useState } from "react";
import style from "./Settings.module.css";
import Cookies from "js-cookie";
import Spinner from "../spinner/Spinner";
import ApiKeyButton from "./ApiKeyButton";
import AlertComponent from "../alert/AlertComponent";

function SettingsComponent() {
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [intervalTime, setIntervalTime] = useState("");
  const [expirationTime, setExpirationTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const [shouldUpdateInterval, setUpdateInterval] = useState(false);
  const [shouldUpdateExpiration, setUpdateExpiration] = useState(false);
  const [shouldUpdateActivityLog, setUpdateActivityLog] = useState(false);
  const [activityLog, setActivityLog] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(5);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = activityLog.slice(indexOfFirstEntry, indexOfLastEntry);

  const token = Cookies.get("token");
  let apiToken = Cookies.get("apiToken");

  const nextPage = () => {
    if (currentPage < Math.ceil(activityLog.length / entriesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleIntervalChange = (e) => {
    setIntervalTime(e.target.value);
    setUpdateInterval(true);
  };

  const handleExpirationChange = (e) => {
    setExpirationTime(e.target.value);
    setUpdateExpiration(true);
  };

  const handleChecked = (e) => {
    setChecked(e.target.checked);
    setUpdateActivityLog(true);
  };

  const handleGenerate = async () => {
    try {
      const response = await fetch("http://localhost:3001/generateToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set("apiToken", data.token);
        apiToken = data.token;
      } else {
        setNotification({
          type: "error",
          message: "Er is iets misgegaan, probeer het later opnieuw.",
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Er is iets misgegaan, probeer het later opnieuw.",
      });
    }
  };

  function parseUserAgent(userAgent) {
    const osRegex = /(Windows|Mac).*?(\d+).*?/;
    const browserRegex = /(Edg|Chrome|Firefox|Safari)/;

    const osMatches = osRegex.exec(userAgent);
    const browserMatches = browserRegex.exec(userAgent);

    let osName = "Unknown";
    let osVersion = "Unknown";

    if (osMatches && osMatches[1] && osMatches[2]) {
      osName = osMatches[1];
      osVersion = osMatches[2];
    }

    if (osName === "Mac") {
      osName = "Mac OS";
    }

    const browser =
      browserMatches && browserMatches[1] ? browserMatches[1] : "Unknown";

    return { osName, osVersion, browser };
  }

  useEffect(() => {
    const retrieveSettings = async () => {
      try {
        const response = await fetch("http://localhost:3001/settings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setChecked(data.activityLog);
          setExpirationTime(data.expirationTime);
          setIntervalTime(data.intervalTime);

          fetch("http://localhost:3001/activity", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              const parsedActivityLog = data.map((entry) => {
                const parsedDevice = parseUserAgent(entry.device);
                return {
                  ...entry,
                  osName: parsedDevice.osName,
                  osVersion: parsedDevice.osVersion,
                  browser: parsedDevice.browser,
                  formattedTime: new Date(entry.time).toLocaleString(),
                };
              });

              setActivityLog(parsedActivityLog);
            });

          fetch("http://localhost:3001/generateToken", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              Cookies.set("apiToken", data.token);
              apiToken = data.token;

              setLoading(false);
            });
        }
      } catch (error) {
        setLoading(false);
        setNotification({
          type: "error",
          message: "Er is iets misgegaan, probeer het later opnieuw.",
        });
      }
    };
    retrieveSettings();
  }, []);

  useEffect(() => {
    const updateInterval = async () => {
      try {
        const response = await fetch("http://localhost:3001/settings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            intervalTime: intervalTime,
            activityLog: checked,
          }),
        });

        if (!response.ok) {
          setNotification({
            type: "error",
            message: "Er is iets misgegaan, probeer het later opnieuw.",
          });
        }
      } catch (error) {
        setNotification({
          type: "error",
          message: "Er is iets misgegaan, probeer het later opnieuw.",
        });
      }
    };

    if (shouldUpdateInterval) {
      updateInterval();
      setUpdateInterval(false);
    }
  }, [shouldUpdateInterval]);

  useEffect(() => {
    const updateExpiration = async () => {
      try {
        const response = await fetch("http://localhost:3001/settings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            expirationTime: expirationTime,
            activityLog: checked,
          }),
        });

        if (!response.ok) {
          setNotification({
            type: "error",
            message: "Er is iets misgegaan, probeer het later opnieuw.",
          });
        }
      } catch (error) {
        setNotification({
          type: "error",
          message: "Er is iets misgegaan, probeer het later opnieuw.",
        });
      }
    };

    if (shouldUpdateExpiration) {
      updateExpiration();
      setUpdateExpiration(false);
    }
  }, [shouldUpdateExpiration]);

  useEffect(() => {
    const updateActivityLog = async () => {
      try {
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

        if (!response.ok) {
          setNotification({
            type: "error",
            message: "Er is iets misgegaan, probeer het later opnieuw.",
          });
        }
      } catch (error) {
        setNotification({
          type: "error",
          message: "Er is iets misgegaan, probeer het later opnieuw.",
        });
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
          {notification.type !== "" ? (
            <AlertComponent notification={notification} />
          ) : (
            <>
              <h2 className="h3 mb-4 page-title">Instellingen</h2>
              <div className="my-4">
                {!loading ? (
                  <>
                    <ul className="nav nav-tabs mb-4" id="myTab" role="tablist">
                      <li className="nav-item">
                        <a
                          className="nav-link active"
                          id="profile-tab"
                          data-toggle="tab"
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
                      Beheer algemene instellingen met betrekking tot de
                      applicatie. Aangepaste instellingen worden direct
                      opgeslagen en toegepast.
                    </p>

                    <div className="list-group mb-5 shadow">
                      <div className="list-group-item">
                        <div className="row align-items-center">
                          <div className="col">
                            <strong className="mb-2">
                              Inschakelen Activiteitlogboek
                            </strong>
                            <p className="text-muted mb-0">
                              Wanneer ingeschakeld, worden alle activiteiten met
                              betrekking tot uw account gelogd en weergegeven in
                              het logboek hier beneden.
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
                              Genereer een nieuwe API-sleutel of kopieër de
                              huidige API-sleutel voor gebruik in externe
                              applicaties.
                            </p>
                          </div>
                          <div className="col-auto">
                            <ApiKeyButton apiKey={apiToken} />
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
                              De maximale tijd in minuten dat een tijdelijke
                              token geldig is. Deze token wordt verschaft aan
                              een subcriber om mails online te kunnen bekijken
                              of zich in/ uit te kunnen schrijven.
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
                              De tijd in minuten wanneer de server moet
                              controleren of er mails verstuurd moeten worden.
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

                    <h5 className="mb-0">Recente activiteit</h5>
                    <p>Laatste activiteiten met uw account.</p>
                    <table className="table border bg-white">
                      <thead>
                        <tr>
                          <th>Apparaat</th>
                          <th>IP</th>
                          <th>Datum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityLog.length === 0 ? (
                          <tr>
                            <td colSpan="3" className="text-center">
                              Geen activiteiten gevonden, mogelijk heeft u
                              logging uit staan.
                            </td>
                          </tr>
                        ) : (
                          currentEntries.map((entry) => (
                            <tr>
                              <th scope="col">
                                <i className="fe fe-globe fe-12 text-muted mr-2"></i>
                                {entry.browser} - {entry.osName}{" "}
                                {entry.osVersion}
                              </th>
                              <td>{entry.ip}</td>
                              <td>{entry.formattedTime}</td>
                              <td>
                                <a hreff="#" className="text-muted">
                                  <i className="fe fe-x"></i>
                                </a>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    <nav aria-label="table navigation">
                      <ul className="pagination justify-content-center">
                        <li className="page-item">
                          <a
                            className={`page-link ${style.buttonNav}`}
                            aria-label="Previous"
                            onClick={prevPage}
                          >
                            <span aria-hidden="true">&laquo;</span>
                          </a>
                        </li>
                        <li className="page-item">
                          <a className={`page-link ${style.currentPage}`}>
                            {currentPage}
                          </a>
                        </li>
                        <li className="page-item">
                          <a
                            className={`page-link ${style.buttonNav}`}
                            aria-label="Next"
                            onClick={nextPage}
                          >
                            <span aria-hidden="true">&raquo;</span>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </>
                ) : (
                  <Spinner />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default SettingsComponent;
