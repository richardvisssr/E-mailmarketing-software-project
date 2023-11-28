import React from "react";
import { Table } from "react-bootstrap";

const TableComponent = ({ subscribers, handleShow, mailList }) => {
  return (
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
          {subscribers.map((subscriberList, index) => (
            <React.Fragment key={index}>
              {subscriberList.map((subscriber, subIndex) => (
                <tr key={subIndex}>
                  <td>{subscriber.name}</td>
                  <td>{subscriber.email}</td>
                  <td className="hover-icon">
                    <i
                      className="bi bi-trash-fill"
                      onClick={() => handleShow(subscriber.email, mailList)}
                    ></i>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
