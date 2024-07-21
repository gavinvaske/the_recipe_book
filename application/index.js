import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import mongoose from 'mongoose';
import 'dotenv/config'
import { connectToMongoDatabase } from './services/databaseService.js';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import session from 'express-session';
import fs from 'fs';
import ejsService from './services/ejsService.js'
import httpServ from 'http'
import { Server } from 'socket.io'
import customWebSockets from './services/websockets/init.js'
import { fileURLToPath } from 'url';

// Routes
import defaultRoute from './controllers/index.js'
import userEndpoints from './controllers/userController.js'
import recipeEndpoints from './controllers/recipeController.js'

import adminEndpoints from './controllers/adminController.js'
import finishEndpoints from './controllers/finishController.js'
import machineEndpoints from './controllers/machineController.js'
import materialEndpoints from './controllers/materialController.js'
import setupEndpoints from './controllers/setupController.js'
import printingSetupEndpoints from './controllers/printingSetupController.js'
import cuttingSetupEndpoints from './controllers/cuttingSetupController.js'
import windingSetupEndpoints from './controllers/windingSetupController.js'
import vendorEndpoints from './controllers/vendorController.js'
import materialOrderEndpoints from './controllers/materialOrdersController.js'
import ticketEndpoints from './controllers/ticketController.js'
import productEndpoints from './controllers/productController.js'
import holdReasonEndpoints from './controllers/holdReasonController.js'
import proofEndpoints from './controllers/proofController.js'
import dieLineEndpoints from './controllers/dieLineController.js'
import spotPlateEndpoints from './controllers/spotPlateController.js'
import requestEndpoints from './controllers/requestController.js'
import materialCategoryEndpoints from './controllers/materialCategoryController.js'
import filePlanEndpoints from './controllers/filePlanController.js'
import packagingEndpoints from './controllers/packagingController.js'
import quoteEndpoints from './controllers/quoteController.js'
// import dieEndpoints from './controllers/dieController.js'
// import linerTypeEndpoints from './controllers/linerTypeController.js'
// import adhesiveCategoryEndpoints from './controllers/adhesiveCategoryController.js'
// import materialLengthAdjustmentEndpoints from './controllers/materialLengthAdjustmentController.js'
// import customerEndpoints from './controllers/customerController.js'
// import deliveryMethodEndpoints from './controllers/deliveryMethodController.js'
// import creditTermEndpoints from './controllers/creditTermsController.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectToMongoDatabase(process.env.MONGO_DB_URL);
const databaseConnection = mongoose.connection;

const defaultPort = 8080;
const PORT = process.env.PORT || defaultPort;

const app = express();

app.locals.helperMethods = ejsService;

const httpServer = httpServ.Server(app);
const socket = new Server(httpServer);
customWebSockets(socket); // Initalize sockets listeners/emitters

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

app.use('/', defaultRoute);
app.use('/users', userEndpoints);
app.use('/recipes', recipeEndpoints);
app.use('/admin', adminEndpoints);
app.use('/finishes', finishEndpoints);
app.use('/machines', machineEndpoints);
app.use('/materials', materialEndpoints);
app.use('/setups', setupEndpoints);
app.use('/printing-setups', printingSetupEndpoints);
app.use('/cutting-setups', cuttingSetupEndpoints);
app.use('/winding-setups', windingSetupEndpoints);
app.use('/vendors', vendorEndpoints);
app.use('/material-orders', materialOrderEndpoints);
app.use('/tickets', ticketEndpoints);
app.use('/products', productEndpoints);
app.use('/hold-reasons', holdReasonEndpoints);
app.use('/proofs', proofEndpoints);
app.use('/die-lines', dieLineEndpoints);
app.use('/spot-plates', spotPlateEndpoints);
app.use('/requests', requestEndpoints);
app.use('/material-categories', materialCategoryEndpoints);
app.use('/file-plan', filePlanEndpoints);
app.use('/packaging', packagingEndpoints);
app.use('/quote', quoteEndpoints);
// app.use('/die', require('./controllers/dieController'));
// app.use('/liner-types', require('./controllers/linerTypeController'));
// app.use('/adhesive-categories', require('./controllers/adhesiveCategoryController'));
// app.use('/material-length-adjustments', require('./controllers/materialLengthAdjustmentController'));


// app.use('/customers', require('./controllers/customerController'));
// app.use('/delivery-methods', require('./controllers/deliveryMethodController'));
// app.use('/credit-terms', require('./controllers/creditTermsController'));

// This route loads the ENTIRE REACT APP
// app.use('/react-ui', (_, response) => response.render('app.ejs'));

databaseConnection.on('error', (error) => {
    throw new Error(`Error connecting to the database: ${error}`);
});

databaseConnection.on('open', () => {
    httpServer.listen(PORT, () => {
        console.log(`Server started listening on PORT ${PORT}. Visit http://localhost:${PORT} in your browser`);
    });
});
