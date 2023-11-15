"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Check if there's an unsubscribed email in localStorage
    const unsubscribedEmail = localStorage.getItem("unsubscribedEmail");
    if (unsubscribedEmail) {
      localStorage.removeItem("unsubscribedEmail");
    } else {
      // If no unsubscribed email found, redirect to home or any other page
      router.push("/");
    }
  }, []);

  const handleUndo = () => {
    // Implement logic to re-subscribe the user using the email stored in localStorage
    // You may need an API endpoint to handle re-subscription

    // After re-subscription, clear the localStorage
    localStorage.removeItem("unsubscribedEmail");

    // Redirect to a page indicating successful re-subscription
    router.push("/resubscribed");
  };

  return (
    <div
      className="alert alert-success mt-3 d-flex justify-content-center"
      role="alert"
    >
      U bent succesvol uitgeschreven
      <button className="btn btn-primary ms-2" onClick={handleUndo}>
        Ongedaan maken
      </button>
    </div>
  );
}
