import React from "react";
import HeaderComponent from "@/components/HeaderComponent";
import MailEditor from "@/components/MailEditor";

export default function Page({ params }) {
  return (
    <div>
      <MailEditor id={params.id} />
    </div>
  );
}
