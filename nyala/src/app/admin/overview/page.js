"use client";

import MailListsComponent from "@/components/views/MailListsComponent";
import SubscribersTable from "@/components/views/SubscribersTable";
import styles from "@/components/views/Views.module.css";
import { useState } from "react";

export default function Page() {
  const [activeComponent, setActiveComponent] = useState("SubscribersTable");

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        <button
          onClick={() => handleComponentChange("MailLists")}
          className={`btn ${styles.buttonPrimary} rounded m-4`}
        >
          Maillijsten{" "}
        </button>
        <button
          onClick={() => handleComponentChange("SubscribersTable")}
          className={`btn ${styles.buttonPrimary} rounded m-4`}
        >
          Ledenlijst{" "}
        </button>
      </div>

      {activeComponent === "MailLists" && <MailListsComponent />}
      {activeComponent === "SubscribersTable" && <SubscribersTable />}
    </div>
  );
}
