const mongoose = require('mongoose');

exports.connectToMongooseDatabase = (databaseUrl) => {
    if (!databaseUrl) {
        throw new Error('Database URL is not defined');
    }

    mongoose.connect(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}