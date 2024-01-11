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
      <h5 className={`mb-4`}>Sorry, de pagina die je zoekt bestaat niet.</h5>
      <p>Voor meer informatie, neem contact op met <a className={`${styles.mail}`} href="mailto: info@svxtend.nl">info@svxtend.nl</a></p>
      <Link href="/" replace className={`${styles.customContainer}`}>
        <button type="button" className={`btn ${styles.button}`}>
          Ga naar de thuispagina
        </button>
      </Link>
    </div>
  );
}
