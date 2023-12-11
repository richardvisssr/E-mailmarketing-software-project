import React from "react";
import MailEditor from "@/components/email/MailEditor";

export default function Page({ params }) {
  return (
    <div>
      <MailEditor id={params.id} />
    </div>
  );
}
