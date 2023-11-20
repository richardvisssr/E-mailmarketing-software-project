const express = require("express");
const mailList = require("../model/mailingList");
const router = express.Router();

router.get('/getList', async (req, res) => {
    try {
      const subscriptions = await mailList.find();
      res.json(subscriptions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.put('/addList', async (req, res) => {
    const { name } = req.body;
  try {
    const subscription = await mailList.collection('mailList').insertOne({ name });
    res.json(subscription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});	

module.exports = router;