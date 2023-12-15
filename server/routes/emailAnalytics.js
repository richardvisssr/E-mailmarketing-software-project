const express = require("express");
const router = express();

let openedOnlineEmails = {};
let unsubscribedEmails = {};

router.get("/trackOnlineView/:emailId", (req, res) => {
  const { emailId } = req.params;
  console.log(`Email opened for email ID: ${emailId}`);

  // Increase the counter for opened emails for the specific email ID
  openedOnlineEmails[emailId] = (openedOnlineEmails[emailId] || 0) + 1;

  console.log(`New count for email ID ${emailId}: ${openedOnlineEmails[emailId]}`);

  return res.status(200).send();
});

router.get("/trackUnsubscribe/:emailId", (req, res) => {
  const { emailId } = req.params;
  console.log(`Email unsubscribed for email ID: ${emailId}`);

  // Increase the counter for unsubscribed emails for the specific email ID
  unsubscribedEmails[emailId] = (unsubscribedEmails[emailId] || 0) + 1;

  console.log(`New count for email ID ${emailId}: ${unsubscribedEmails[emailId]}`);

  return res.status(200).send();
});


router.get("/stats/:emailId", (req, res) => {
  const { emailId } = req.params;
  console.log(openedOnlineEmails);
  // Check if there are data for the specified emailId
  if (!openedOnlineEmails[emailId] && !unsubscribedEmails[emailId]) {
    return res
      .status(404)
      .json({ message: "No data found for the specified emailId" });
  }

  // Return only the data for the specified emailId
  res.json({ 
    [emailId]: { 
      opened: openedOnlineEmails[emailId] || 0, 
      unsubscribed: unsubscribedEmails[emailId] || 0 
    } 
  });
});

module.exports = router;