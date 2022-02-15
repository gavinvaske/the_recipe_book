const {connectToMongooseDatabase} = require('../../application/services/databaseService');
const chance = require('chance').Chance();
const mongoose = require('mongoose');

jest.mock('mongoose');

it('should error if no database url is provided', () => {
    expect(() => {
        connectToMongooseDatabase(null)
    }).toThrow('Database URL is not defined');
});

it('should attempt to connect to mongo database', () => {
    const databaseUrl = chance.string();
    connectToMongooseDatabase(databaseUrl);

    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(mongoose.connect).toHaveBeenCalledWith(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});