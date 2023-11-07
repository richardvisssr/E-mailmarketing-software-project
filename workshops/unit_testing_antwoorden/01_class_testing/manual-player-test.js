'use strict';

const Player = require('./player');

const testPlayer = new Player();

(async function doTests() {

    // Test 1
    await testPlayer.startNew();
    //Expect { description: 'a town', exits: [ 'forest', 'mountain' ] }
    console.log(testPlayer.getLocationInformation());

    // Test 2
    await testPlayer.goToLocation('forest');
    //Expect { description: 'a forest', exits: [ 'town' ] }
    console.log(testPlayer.getLocationInformation());

    // Test 3

    await testPlayer.goToLocation('forest');
    //Expect { description: 'a forest', exits: [ 'town' ] }
    console.log(testPlayer.getLocationInformation());

    // Test 4
    await testPlayer.goToLocation('mountain');
    //Expect { description: 'a forest', exits: [ 'town' ] }
    console.log(testPlayer.getLocationInformation());
})();