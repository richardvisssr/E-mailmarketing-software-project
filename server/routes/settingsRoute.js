const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

function transformToMiliseconds(minutes) {
    if (minutes === undefined || minutes === null) return null;
    return minutes * 60000;
}

function checkBoolean (value) {
    if (value === undefined || value === null) return null;
    return value;
}

router.put('/settings', async (req, res) => {
    console.log("PUT /settings");
    try {
        const configFilePath = path.join(__dirname, "../../config/config.json");
        const config = require.resolve(configFilePath);
        const currentConfig = require(config);

        const { intervalTime, expirationTime, activityLog  } = req.body;
        currentConfig.updateInterval = transformToMiliseconds(intervalTime) || currentConfig.updateInterval;
        currentConfig.expireTime = transformToMiliseconds(expirationTime) || currentConfig.expireTime;
        currentConfig.enableActivity = checkBoolean(activityLog) || currentConfig.enableActivity;

        fs.writeFileSync(config, JSON.stringify(currentConfig, null, 2));

        res.status(200).send({ message: "Settings updated" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error updating settings" });
    }
});

router.get('/settings', async (req, res) => {
    console.log("GET /settings");
    try {
        const configFilePath = path.join(__dirname, "../../config/config.json");
        const config = require.resolve(configFilePath);
        const currentConfig = require(config);

        res.status(200).send({ intervalTime: currentConfig.updateInterval / 60000, expirationTime: currentConfig.expireTime / 60000, activityLog: currentConfig.enableActivity });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error getting settings" });
    }
});

module.exports = router;