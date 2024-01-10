import styles from "./Calendar.module.css";

function TableRowComponent(props) {
  const mail = props.mail;

  return (
    <tr key={mail.date}>
      <td title={mail.subject}>{props.formatSubject(mail.subject)}</td>
      <td>{props.formatDate(mail.date)}</td>
      <td>{props.formatTime(mail.date)}</td>
      {
        <td style={
          mail.status === "Mislukt"
            ? { backgroundColor: "#ff00003b" }
            : mail.status === "Verzonden"
            ? { backgroundColor: "#00d60019" }
            : { backgroundColor: "#ffd61f40"}
        }>
          {mail.status}
        </td>
      }
      <td className="text-end">
        {mail.status !== "Verzonden" && (
          <i
            id="calendar"
            className={`bi bi-calendar-week-fill ${styles.icon}`}
            onClick={() => props.handleOpenModal(mail.id, mail.title)}
            style={{ cursor: "pointer" }}
          ></i>
        )}
        <i
          className={`bi bi-trash3-fill ${styles.icon}`}
          onClick={() => props.deleteMail(mail.id)}
          style={{
            marginLeft: "2em",
            marginRight: "1em",
            cursor: "pointer",
          }}
        ></i>
      </td>
    </tr>
  );
}

export default TableRowComponent;
