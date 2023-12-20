
const express = require('express');
const router = express.Router();

// Define a route for loading images
router.get('/:imageName', (req, res) => {
  const imageName = req.params.imageName;
    res.sendFile(`${__dirname}/${imageName}`);
});

module.exports = router;
