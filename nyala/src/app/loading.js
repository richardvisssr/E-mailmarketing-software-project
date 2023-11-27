import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div
      className={`d-flex flex-column justify-conten-center align-items-center py-5`}
    >
      <h3>Aan het laden...</h3>
      <div className={`spinner-border ${styles.spinner}`} role="status">
        <span className="sr-only"></span>
      </div>
    </div>
  );
}
