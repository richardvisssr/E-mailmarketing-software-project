import React, { useState } from "react";
import styles from "./Views.module.css";
import SubscribeLinkButton from "../subscribe/SubscribeLinkButton";

export default function MailListAccordion({
  mailLists,
  subscribers,
  handleShow,
  handleShowDeleteListModal,
  handleShowUpdateListModal,
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={`accordion accordion-flush p-5 pt-1`} id="MaillistView">
      {mailLists.length === 0 && (
        <div className="text-center">
          <h1 className="text-center">Geen mailinglijsten gevonden</h1>
        </div>
      )}
      {mailLists.map((mailList, index) => (
        <div
          className={`accordion-item shadow ${styles.customAccordion}`}
          key={index}
        >
          <h2 className="accordion-header shadow">
            <div className="d-flex align-items-center">
              <i
                className={`bi bi-pencil-fill h4 ms-auto ps-2 pe-1 pt-2 ${styles.icon}`}
                onClick={() => handleShowUpdateListModal(mailList)}
              ></i>
              <i
                className={`bi bi-x ms-auto ps-2 pe-1 ${styles.icon}`}
                onClick={() => handleShowDeleteListModal(mailList)}
              ></i>
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
            </div>
          </h2>
          <div
            id={`flush-collapse-${index}`}
            className={`accordion-collapse collapse ${
              activeIndex === index ? "show" : ""
            }`}
            data-bs-parent="#MaillistView"
          >
            <div className="accordion-body">
              <div className="d-flex justify-content-start">
                <SubscribeLinkButton list={mailList} />
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Naam</th>
                      <th scope="col">Email</th>
                      <th> </th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {subscribers[index]?.map((subscriber, subIndex) => (
                      <tr key={subIndex}>
                        <td>{subscriber.name}</td>
                        <td>{subscriber.email}</td>
                        <td className="hover-icon text-end">
                          <i
                            className={`bi bi-trash-fill me-5 ${styles.icon}`}
                            onClick={() =>
                              handleShow(subscriber.email, mailList)
                            }
                          ></i>
                        </td>
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
  );
}
