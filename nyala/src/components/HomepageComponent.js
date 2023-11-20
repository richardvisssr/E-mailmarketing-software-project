"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./HomepageComponent.module.css";

export default function ThuispaginaComponent() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("../../beheerder");
  }, []);

  return (
    <main>
      <div
        className={`${styles.customContainer} d-flex flex-column align-items-center align-items-center py-5`}
      >
        <h5 className={`py-5`}>
          Zoek je de s.v. Xtend website? Klik dan op het logo aan de bovenkant
          van de pagina.
        </h5>
        <button
          type="button"
          className={`btn ${styles.button}`}
          onClick={() => {
            router.push("../../admin");
          }}
        >
          Ga naar de beheerspagina
        </button>
      </div>
    </main>
  );
}
