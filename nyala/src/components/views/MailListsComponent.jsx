"use client";

import { useEffect, useState } from "react";

export default function MailListComponent() {
  const [mailLists, setMailLists] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/mail/getList")
      .then((response) => response.json())
      .then((data) => setMailLists(data[0].mailList))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const fetchSubscribers = async () => {
      const promises = mailLists.map((mailList) =>
        fetch(
          `http://localhost:3001/subscribers?selectedMailingList=${mailList}`
        ).then((response) => response.json())
      );

      const subscribersData = await Promise.all(promises);
      setSubscribers(subscribersData);
    };

    if (mailLists.length > 0) {
      fetchSubscribers();
    }
  }, [mailLists]);

  const handleAccordionClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div>
      <div className="accordion accordion-flush" id="MaillistView">
        {mailLists.map((mailList, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header">
              <button
                className={`accordion-button ${
                  activeIndex === index ? "" : "collapsed"
                }`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#flush-collapse-${index}`}
                aria-expanded={activeIndex === index ? "true" : "false"}
                aria-controls={`flush-collapse-${index}`}
                onClick={() => handleAccordionClick(index)}
              >
                {mailList}
              </button>
            </h2>
            <div
              id={`flush-collapse-${index}`}
              className={`accordion-collapse collapse ${
                activeIndex === index ? "show" : ""
              }`}
              data-bs-parent="#MaillistView"
            >
              <div className="accordion-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">Naam</th>
                        <th scope="col">Email</th>
                      </tr>
                    </thead>
                    <tbody className="table-group-divider">
                      {subscribers[index]?.map((subscriber, subIndex) => (
                        <tr key={subIndex}>
                          <td>{subscriber.name}</td>
                          <td>{subscriber.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
