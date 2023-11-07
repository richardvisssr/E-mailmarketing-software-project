'use strict';

const mongoose = require('mongoose');
require('../player');

const Player = mongoose.model('Player');

describe('Player Model Tests', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/testPlayerDB');
    });
    
    beforeEach(async () => {
        await Player.create({ _id: 'han', capacity: 1, items: [] });
    });
    
    afterEach(async () => {
        await Player.deleteMany({});
    
    });
    
    afterAll(async () => {
        await mongoose.disconnect();
    });
    
    test('dummy exercise', async () => {
        let testPlayer = await Player.findById('han').lean();
        
        expect(testPlayer._id).toEqual('han');
        expect(testPlayer.capacity).toEqual(1);
        expect(testPlayer.items).toEqual([]);

    });
    
    test('item can be added if capacity is not yet exceeded', async () => {
        let testPlayer = await Player.findById('han');
        
        await testPlayer.addItem('sword');

        const resultPlayer = await Player.findById('han');

        const expectedItem = ['sword'];
        

        expect(resultPlayer.items).toEqual(expectedItem);
    });
    
    test('item can not be added if nr of items equals the capacity', async () => {
    

    });
});