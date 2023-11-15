import React from "react";
import HeaderComponent from "@/components/headerComponent";
import MailBewerken from "@/components/MailBewerken";

export default function Page({ params }) {
  return (
    <div>
      <HeaderComponent />
      <MailBewerken id={params.id} />
    </div>
  );
}
