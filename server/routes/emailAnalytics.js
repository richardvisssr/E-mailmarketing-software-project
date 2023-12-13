const express = require("express");
const router = express();

let openedOnlineEmails = {};

router.get("/trackOnlineView/:emailId", (req, res) => {
  const { emailId } = req.params;
  console.log(`Email opened for email ID: ${emailId}`);

  // Verhoog de teller voor geopende e-mails voor de specifieke e-mail-id
  openedOnlineEmails[emailId] = (openedOnlineEmails[emailId] || 0) + 1;

  return res.status(200).send();
});

router.get("/stats/:emailId", (req, res) => {
  const { emailId } = req.params;
console.log(openedOnlineEmails);
  // Controleer of er gegevens zijn voor de opgegeven emailId
  if (!openedOnlineEmails[emailId]) {
    return res.status(404).json({ message: 'Geen gegevens gevonden voor de opgegeven emailId' });
  }

  // Geef alleen de gegevens voor de opgegeven emailId terug
  res.json({ [emailId]: openedOnlineEmails[emailId] });
});

module.exports = router;