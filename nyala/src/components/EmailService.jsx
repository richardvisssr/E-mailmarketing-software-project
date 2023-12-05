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
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    return false;
  }
}

export default sendDataToSendEmail;
