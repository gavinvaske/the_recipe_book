const databaseService = require('../../application/services/databaseService');
const chance = require('chance').Chance();
const mongoose = require('mongoose');

jest.mock('mongoose');
let originalNodeEnv;

beforeAll(() => {
    originalNodeEnv = process.env.NODE_ENV;
});

afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
});

it('should error if no database url is provided', async () => {
    await expect(databaseService.connectToMongoDatabase(null)).rejects.toThrow('Database URL is not defined');
});

it('should attempt to connect to mongo database', () => {
    const databaseUrl = chance.string();
    databaseService.connectToMongoDatabase(databaseUrl);

    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(mongoose.connect).toHaveBeenCalledWith(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

describe('test environment database interactions', () => {
    it('should NOT allow OPENING of the test database if NODE_ENV is not in test mode', async () => {
        delete process.env.NODE_ENV;

        await expect(databaseService.connectToTestMongoDatabase(null)).rejects.toThrow('the test database can only be connected too from test environments');
    });

    it('should NOT allow CLOSING of the database if NODE_ENV is not in test mode', async () => {
        delete process.env.NODE_ENV;

        await expect(databaseService.closeDatabase()).rejects.toThrow('the database can ONLY be closed manually in test environments');
    });

    it('should NOT allow CLEARING of the database if NODE_ENV is not in test mode', async () => {
        delete process.env.NODE_ENV;

        await expect(databaseService.clearDatabase()).rejects.toThrow('the database can ONLY be cleared manually in test environments');
    });

});