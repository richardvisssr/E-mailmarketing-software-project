import styles from "./Spinner.module.css";

export default function Spinner() {
    return (
        <div
          className={`d-flex flex-column justify-conten-center align-items-center py-5`}
        >
          <div className={`spinner-border ${styles.spinner}`} role="status">
            <span className="sr-only"></span>
          </div>
        </div>
    );
};
