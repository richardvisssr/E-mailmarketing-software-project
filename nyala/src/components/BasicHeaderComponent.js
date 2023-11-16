import Image from "next/image";
import styles from "./HeaderComponent.module.css";
import Link from "next/link";

export default function BasicHeaderComponent() {
  return (
    <header
      className={`d-flex flex-wrap justify-content-around align-items-center py-1 mb-4 ml-2 border-bottom ${styles.darkHeader}`}
    >
      <a
        target="_blank"
        href="https://svxtend.nl"
        className="d-flex align-items-center mb-3 mb-md-0  text-dark text-decoration-none"
      >
        <Image
          src="/xtend-logo.webp"
          alt="Logo van s.v. Xtend"
          width={75}
          height={75}
          quality={100}
          className={`${styles.logo}`}
        />
      </a>
    </header>
  );
}
