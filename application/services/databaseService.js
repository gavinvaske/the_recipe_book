const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

module.exports.connectToMongoDatabase = async (databaseUrl) => {
    if (!databaseUrl) {
        throw new Error('Database URL is not defined');
    }

    await mongoose.connect(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

module.exports.connectToTestMongoDatabase = async () => {
    const testDatabaseUrl = mongod.getUri();

    await connectToMongoDatabase(testDatabaseUrl);
}

module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
}

module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}