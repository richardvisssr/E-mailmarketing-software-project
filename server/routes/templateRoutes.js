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

const Design = mongoose.model('Design', designSchema);

router.get('/templates', async (req, res) => {
    try {
        const designs = await Design.find();

        res.json(designs);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
