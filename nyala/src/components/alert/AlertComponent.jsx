export default function AlertComponent({ notification }) {
  return (
    <div>
      <div>
        {notification.type !== "success" ? (
          <></>
        ) : (
          <div
            className="alert alert-success mx-auto d-flex justify-content-around w-auto"
            role="alert"
          >
            <p>{notification.message}</p>
            <i className="ms-2 bi bi-check"></i>
          </div>
        )}
      </div>
      <div>
        {notification.type !== "error" ? (
          <></>
        ) : (
          <div
            className="alert alert-danger mx-auto d-flex justify-content-center w-auto"
            role="alert"
          >
            <p>{notification.message}</p>
            <i className="ms-2 bi bi-exclamation-triangle"></i>
          </div>
        )}
      </div>
    </div>
  );
}
