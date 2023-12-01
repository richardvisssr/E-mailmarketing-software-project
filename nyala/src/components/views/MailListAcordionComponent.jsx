import React, { useState } from "react";
import styles from "./Views.module.css";

export default function MailListAccordion({
  mailLists,
  subscribers,
  handleShow,
  handleShowDeleteListModal,
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleDeleteButtonClick = (mailList) => {
    handleShowDeleteListModal(mailList);
  };

  return (
    <div className={`accordion accordion-flush p-5 pt-1`} id="MaillistView">
      {mailLists.map((mailList, index) => (
        <div
          className={`accordion-item shadow ${styles.customAccordion}`}
          key={index}
        >
          <h2 className="accordion-header shadow">
            <div className="d-flex align-items-center">
              <i
                className={`bi bi-x ms-auto ps-2 pe-1 ${styles.icon}`}
                onClick={() => handleDeleteButtonClick(mailList)}
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
