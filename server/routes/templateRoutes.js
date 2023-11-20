const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const designSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    design: {
        type: Object,
        required: true
    }
});

const emailSchema = new mongoose.Schema({
    id: {
      type: String,
      required: true,
      unique: true,
    },
    html: {
      type: String,
      required: true,
    },
  });

const Design = mongoose.model('Design', designSchema);
const Email = mongoose.model('Email', emailSchema);

router.get('/templates', async (req, res) => {
    try {
        const designs = await Design.find();

        res.json(designs);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/templates/:id', async (req, res) => {
    try {
        const email = await Email.findOne({ id: req.params.id });

        if (email){
            res.json(email);
        } else {
            res.status(404).json({ error: 'Email not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;
