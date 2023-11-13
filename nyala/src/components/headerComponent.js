import Link from "next/link";
import Image from "next/image";

export default function HeaderComponent(props) {
  return (
    <header
      className={`d-flex flex-wrap justify-content-around align-items-center py-1 mb-4 ml-2 border-bottom`}
      style={{ backgroundColor: "black" }}
    >
      <a
        target="_blank"
        href="https://svxtend.nl"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-5 text-dark text-decoration-none"
      >
        <Image
          src="/xtend-logo.webp"
          alt="Logo van s.v. Xtend"
          width={75}
          height={75}
          quality={100}
        />
      </a>

      <ul className="nav nav-pills">
        <li className="nav-item">
          <Link href="/" className="nav-link" aria-current="page">
            Templates
          </Link>
        </li>
        <span className="fs-4 text-dark">|</span>
        <li className="nav-item">
          <Link href="/" className="nav-link" aria-current="page">
            Lid toevoegen
          </Link>
        </li>
        <span className="fs-4 text-dark">|</span>
        <li className="nav-item">
          <Link href="/" className="nav-link" aria-current="page">
            Analyse
          </Link>
        </li>
      </ul>
    </header>
  );
}
