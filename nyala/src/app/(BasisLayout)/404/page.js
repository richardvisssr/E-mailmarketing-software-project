import Link from "next/link";
import styles from "./404.module.css";

export default function page() {
  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center py-5 mt-5`}
    >
      <h1 className={`${styles.head}`}>
        <span>404</span> - Pagina niet gevonden
      </h1>
      <p>Sorry, de pagina die je zoekt bestaat niet.</p>
      <Link href="/" replace className={`${styles.customContainer}`}>
        <button type="button" className={`btn ${styles.button}`}>
          Ga naar de thuispagina
        </button>
      </Link>
    </div>
  );
}
