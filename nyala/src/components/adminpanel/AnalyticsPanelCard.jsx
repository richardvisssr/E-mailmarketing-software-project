import React, { useState, useEffect } from "react";

const AnalyticsPanelCard = (props) => {
    const [openedOnlineEmails, setOpenedOnlineEmails] = useState(0);
    const id = props.id;

    useEffect(() => {
        fetch(`http://localhost:3001/stats/${id}`, {})
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            const key = Object.keys(data)[0]; // Get the first key in the object
            const value = data[key]; // Get the value associated with the key
            setOpenedOnlineEmails(value);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }, [id]);


  return (
    <div className="small-card p-2 bg-light d-grid gap-3 rounded shadow-lg">
      <h5 className="mb-0">Mail geopend : 50/200</h5>
      <h5 className="mb-0">Online : {openedOnlineEmails}/200</h5>
    </div>
  );
};

export default AnalyticsPanelCard;