import React, { useState, useEffect } from "react";

const AnalyticsPanelCard = (props) => {
    const [openedOnlineEmails, setOpenedOnlineEmails] = useState(0);
    const [unsubscribe, setUnsubscribe] = useState(0);
    const id = props.id;
    console.log(unsubscribe);

    useEffect(() => {
        fetch(`http://localhost:3001/stats/${id}`, {})
          .then((response) => response.json())
          .then((data) => {
            const key = Object.keys(data)[0]; 
            const value = data[key]; 
            console.log(value);
            setOpenedOnlineEmails(value.opened);
            setUnsubscribe(value.unsubscribed);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }, [id]);

  return (
    <div className="small-card p-2 bg-light d-grid gap-2 rounded shadow-lg">
      <h5 className="mb-0">Verzonden : 400</h5>
      <p className="mb-0">Uitgeschreven : {unsubscribe}</p>
      <p className="mb-0">Online weergaven : {openedOnlineEmails}</p>
    </div>
  );
};

export default AnalyticsPanelCard;