const {connectToMongoDatabase} = require('../../application/services/databaseService');
const chance = require('chance').Chance();
const mongoose = require('mongoose');

jest.mock('mongoose');

it('should error if no database url is provided', async () => {
    await expect(connectToMongoDatabase(null)).rejects.toThrow('Database URL is not defined');
});

it('should attempt to connect to mongo database', () => {
    const databaseUrl = chance.string();
    connectToMongoDatabase(databaseUrl);

    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(mongoose.connect).toHaveBeenCalledWith(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});