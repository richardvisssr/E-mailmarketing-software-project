const express = require("express");
const mailLijst = require("../model/mailLijsten");
const router = express.Router();

router.get('/getList', async (req, res) => {
    try {
      const subscriptions = await mailLijst.find({});
      res.json(subscriptions);
      console.log(subscriptions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.put('/addList', async (req, res) => {
    const { mailLijsten } = req.body;

    try {
      const subscription = await mailLijst.create({ mailLijsten });
      res.json(subscription);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
});	

module.exports = router;