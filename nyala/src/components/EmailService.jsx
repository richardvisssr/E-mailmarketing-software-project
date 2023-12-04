async function sendDataToSendEmail(html, subscribers, subject, showHeader, id) {
  try {
    const response = await fetch("http://localhost:3001/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html,
        subscribers,
        subject,
        showHeader,
        id,
      }),
    });

    return true;
  } catch (error) {
    return false;
  }
}

export default sendDataToSendEmail;
