const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
require('dotenv').config();
const databaseService = require('./services/databaseService');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const fs = require('fs');

databaseService.connectToMongoDatabase(process.env.MONGO_DB_URL);
const databaseConnection = mongoose.connection;

const defaultPort = 8080;
const PORT = process.env.PORT || defaultPort;

const app = express();

app.locals.helperMethods = require('../application/services/ejsService');

const http = require('http').Server(app);
const io = require('socket.io')(http);
require('./services/socketService')(io); // Initalize sockets listeners/emitters

app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(flash());
app.use((request, response, next) => {
    response.locals.errors = request.flash('errors');
    response.locals.alerts = request.flash('alerts');
    next();
});

app.use(express.static(__dirname + '/public'));

const reactBuildFolderPath = './build';

if (!fs.existsSync(reactBuildFolderPath)) {
    throw new Error('React build folder does not exist. Please run `npm run build` and try again.');
}
app.use(express.static(reactBuildFolderPath));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('layout', path.join(__dirname, '/views/layout.ejs'));

app.use('/', require('./controllers/index'));
app.use('/users', require('./controllers/userController'));
app.use('/recipes', require('./controllers/recipeController'));
app.use('/admin', require('./controllers/adminController'));
app.use('/finishes', require('./controllers/finishController'));
app.use('/machines', require('./controllers/machineController'));
app.use('/materials', require('./controllers/materialController'));
app.use('/setups', require('./controllers/setupController'));
app.use('/printing-setups', require('./controllers/printingSetupController'));
app.use('/cutting-setups', require('./controllers/cuttingSetupController'));
app.use('/winding-setups', require('./controllers/windingSetupController'));
app.use('/vendors', require('./controllers/vendorController'));
app.use('/material-orders', require('./controllers/materialOrdersController'));
app.use('/tickets', require('./controllers/ticketController'));
app.use('/products', require('./controllers/productController'));
app.use('/material-inventory', require('./controllers/materialInventoryController'));
app.use('/hold-reasons', require('./controllers/holdReasonController'));
app.use('/proofs', require('./controllers/proofController'));
app.use('/die-lines', require('./controllers/dieLineController'));
app.use('/spot-plates', require('./controllers/spotPlateController'));
app.use('/requests', require('./controllers/requestController'));
app.use('/material-categories', require('./controllers/materialCategoryController'));
app.use('/file-plan', require('./controllers/filePlanController'));
app.use('/packaging', require('./controllers/packagingController'));
app.use('/quote', require('./controllers/quoteController'));
app.use('/die', require('./controllers/dieController'));


app.use('/customers', require('./controllers/customerController'));
app.use('/delivery-methods', require('./controllers/deliveryMethodController'));
app.use('/credit-terms', require('./controllers/creditTermsController'));

// This route loads the ENTIRE REACT APP
app.use('/react-ui', (_, response) => response.render('app.ejs'));

databaseConnection.on('error', (error) => {
    throw new Error(`Error connecting to the database: ${error}`);
});

databaseConnection.on('open', () => {
    http.listen(PORT, () => {
        console.log(`Server started listening on PORT ${PORT}. Visit http://localhost:${PORT} in your browser`);
    });
});
