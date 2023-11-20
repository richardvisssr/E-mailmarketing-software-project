import React from "react";
import HeaderComponent from "@/components/HeaderComponent";
import MailEditor from "@/components/MailEditor";

export default function Page({ params }) {
  return (
    <div>
      <HeaderComponent />
      <MailEditor id={params.id} />
    </div>
  );
}
