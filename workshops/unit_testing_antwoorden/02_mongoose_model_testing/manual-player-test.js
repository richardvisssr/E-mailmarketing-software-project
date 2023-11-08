'use strict';

const mongoose = require('mongoose');
require('./player');

const Player = mongoose.model('Player');

(async function doTests() {
    
    // Init the test suite
    await mongoose.connect('mongodb://localhost:27017/testPlayerDB', { useNewUrlParser: true });

    // Init a test
    await Player.create({ _id: 'han', capacity: 1 });

    // Test 1
    // Expect { _id: 'han', items: [], capacity: 1, __v: 0 }
    console.log(await Player.findById('han'));

    // Clean up a test
    await Player.deleteMany({});
    

    // Gracefully shut down test suite
    await mongoose.disconnect();

})();