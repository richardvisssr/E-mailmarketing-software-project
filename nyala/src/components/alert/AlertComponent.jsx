import { useState, useEffect } from "react";

export default function AlertComponent({ notification }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
  }, [notification]);

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (dismissed) {
    return null;
  }

  return (
    <div>
      {notification.type === "success" && (
        <div
          className="alert alert-success mx-auto d-flex justify-content-around w-auto alert-dismissible"
          role="alert"
        >
          <button
            type="button"
            className="btn-close"
            onClick={handleDismiss}
          ></button>
          <p>{notification.message}</p>
          <i className="ms-2 bi bi-check"></i>
        </div>
      )}

      {notification.type === "error" && (
        <div
          className="alert alert-danger mx-auto d-flex justify-content-center w-auto alert-dismissible"
          role="alert"
        >
          <button
            type="button"
            className="btn-close"
            onClick={handleDismiss}
          ></button>
          <p>{notification.message}</p>
          <i className="ms-2 bi bi-exclamation-triangle"></i>
        </div>
      )}
    </div>
  );
}
