"use client";

import styles from "./resubscribeComponent.module.css";
import { useRouter } from "next/navigation";

export default function Resubscribed() {
  const router = useRouter();
  const handleRoute = () => {
    router.push("/");
  };
  return (
    <div>
      <div className="mt-3 d-flex justify-content-center">
        <div
          className="alert alert-success d-flex justify-content-around"
          role="alert"
        >
          <p>He topper, bedankt dat je jezelf weer hebt ingeschreven</p>
          <i className="bi bi-check"></i>
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <button
          className={`btn ${styles.knopPrimary} ms-3 `}
          onClick={handleRoute}
        >
          Klik hier om terug te gaan naar de homepage
        </button>
      </div>
    </div>
  );
}
