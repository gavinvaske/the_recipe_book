import mongoose from 'mongoose';
mongoose.set('strictQuery', true);

import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;
const TEST_ENVIRONMENT = 'test';

export async function connectToMongoDatabase(databaseUrl) {
    if (!databaseUrl) {
        throw new Error('Database URL is not defined');
    }

    await mongoose.connect(databaseUrl, {});
}

export async function connectToTestMongoDatabase() {
    if (process.env.NODE_ENV !== TEST_ENVIRONMENT) {
        throw Error('the test database can only be connected too from test environments');
    }

    mongod = await MongoMemoryServer.create();
    mongoose.connect(mongod.getUri(), {});
}

export async function closeDatabase() {
    if (process.env.NODE_ENV !== TEST_ENVIRONMENT) {
        throw Error('the database can ONLY be closed manually in test environments');
    }
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
}

export async function clearDatabase() {
    if (process.env.NODE_ENV !== TEST_ENVIRONMENT) {
        throw Error('the database can ONLY be cleared manually in test environments');
    }
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}