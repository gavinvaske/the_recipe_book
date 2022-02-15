const {connectToMongooseDatabase} = require('../../application/services/databaseService');
const chance = require('chance').Chance();

it('should error if no database url is provided', () => {
    expect(() => {
        connectToMongooseDatabase(null)
    }).toThrow('Database URL is not defined');
});