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
    if (url === "onlineEmail") {
      fetch(`http://localhost:3001/trackOnlineView/${mailid}`)
        .then(() => {
          router.push(`/${url}/${mailid}/${userid}`);
        })
        .catch((error) => {
          setNotification({ type: "error", message: error.message });
        });
    }
    if(url === "unsubscribe") {
      fetch(`http://localhost:3001/trackUnsubscribe/${mailid}`)
        .then(() => {
          // router.push(`/${url}/${userid}`);
        })
        .catch((error) => {
          setNotification({ type: "error", message: error.message });
        });
    }
  }, []);

  return (
    <>
      <Loading />
      {notification.message && (
        <AlertComponent
          type={notification.type}
          message={notification.message}
        />
      )}
    </>
  );
};

export default TrackingPage;
