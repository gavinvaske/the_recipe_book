const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const {error: envLoadError} = require('dotenv').config();
const databaseService = require('./services/databaseService');
const cookieParser = require('cookie-parser');

if (envLoadError) {
    throw new Error('No .env file was found, please add one to the root directory of this project!');
}

databaseService.connectToMongoDatabase(process.env.MONGO_DB_URL);
const databaseConnection = mongoose.connection;

const defaultPort = 8080;
const PORT = process.env.PORT || defaultPort;

const app = express();

app.use(cookieParser());
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('layout', path.join(__dirname, '/views/layout.ejs'));

app.use('/', require('./controllers/index'));
app.use('/users', require('./controllers/users'));

databaseConnection.on('error', (error) => {
    throw new Error(`Error connecting to the database: ${error}`);
});

databaseConnection.on('open', () => {
    app.listen(PORT, () => {
        console.log(`Server started listening on PORT ${PORT}. Visit http://localhost:${PORT} in your browser`);
    });
});
