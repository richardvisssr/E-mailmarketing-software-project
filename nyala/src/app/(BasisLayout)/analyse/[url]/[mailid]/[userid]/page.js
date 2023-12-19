"use client";
"use strict";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/(BasisLayout)/loading";
import AlertComponent from "@/components/alert/AlertComponent";

const TrackingPage = ({ params }) => {
  const { mailid, userid, url } = params;
  const [notification, setNotification] = useState({ type: "", message: "" });

  const router = useRouter();

  useEffect(() => {
    let trackUrl = "";
    let errorMessage = "";

    switch (url) {
      case "onlineEmail":
        trackUrl = `http://localhost:3001/trackOnlineView/${mailid}`;
        errorMessage = "Er is een fout opgetreden bij het bijhouden van de online weergave.";
        break;
      case "unsubscribe":
        trackUrl = `http://localhost:3001/trackUnsubscribe/${mailid}`;
        errorMessage = "Er is een fout opgetreden bij het verwerken van uw uitschrijving.";
        break;
      default:
        trackUrl = `http://localhost:3001/trackHyperlinks/${url}/${mailid}`;
        errorMessage = "Er is een fout opgetreden bij het bijhouden van de hyperlinks.";
        break;
    }

    fetch(trackUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(errorMessage);
        }
        return response;
      })
      .then(() => {
        if (url === "onlineEmail" || url === "unsubscribe") {
          router.push(`/${url}/${mailid}/${userid}`);
        } else {
          const decodedUrl = decodeURIComponent(url);
          router.push(decodedUrl);
        }
      })
      .catch((error) => {
        setNotification({
          type: "error",
          message: errorMessage,
          error,
        });
      });
  }, []);

  return (
    <>
      <Loading />
      {notification.message && <AlertComponent notification={notification} />}
    </>
  );
};

export default TrackingPage;