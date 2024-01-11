import styles from "./FooterComponent.module.css";

export default function FooterComponent() {
  return (
    <footer className="border-top bg-white">
      <div className="d-flex flex-wrap justify-content-around py-0 mt-3">
        <p>@ 2024 S.V.Xtend</p>

        <div className={`${styles.linky}`}>
          <i className={`bi bi-map mr-3`}></i>
          <a
            target="_blank"
            className={`link-underline link-underline-opacity-0 ${styles.space}`}
            href="https://www.google.com/maps/place/Ruitenberglaan+26,+6826+CC+Arnhem/@51.987831,5.9476216,17z/data=!3m1!4b1!4m6!3m5!1s0x47c7a46f8160614d:0x3a1bc587c5374eeb!8m2!3d51.9878277!4d5.9501965!16s%2Fg%2F11b8v574gr?entry=ttu"
          >
            Ruitenberglaan 26, Arnhem
          </a>
        </div>
        
        <div className={`${styles.linky}`}>
        <i className="bi bi-envelope-fill "></i>
          <a
            className={`link-underline link-underline-opacity-0 ${styles.space}`}
            href="mailto: info@svxtend.nl"
          >
            info@svxtend.nl
          </a>
        </div>

        <ul className="list-unstyled d-flex">
          <li className="ms-3">
            <a
              target="_blank"
              className={`${styles.linky}`}
              href="https://www.instagram.com/svxtend/"
            >
              <i className="bi bi-instagram"></i>
            </a>
          </li>
          <li className="ms-3">
            <a
              target="_blank"
              className={`${styles.linky}`}
              href="https://www.facebook.com/svXtend/"
            >
              <i className="bi bi-facebook"></i>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
