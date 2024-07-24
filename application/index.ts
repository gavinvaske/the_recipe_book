import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import mongoose from 'mongoose';
import 'dotenv/config';
import { connectToMongoDatabase } from './services/databaseService.ts';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import session from 'express-session';
import fs from 'fs';
import ejsService from './services/ejsService.ts';
import httpServ from 'http';
import { Server } from 'socket.io';
import customWebSockets from './services/websockets/init.ts';
import { fileURLToPath } from 'url';

// Routes
import defaultRoute from './controllers/index.ts';
import userEndpoints from './controllers/userController.ts';
import recipeEndpoints from './controllers/recipeController.ts';

import adminEndpoints from './controllers/adminController.ts';
import finishEndpoints from './controllers/finishController.ts';
import machineEndpoints from './controllers/machineController.ts';
import materialEndpoints from './controllers/materialController.ts';
import setupEndpoints from './controllers/setupController.ts';
import printingSetupEndpoints from './controllers/printingSetupController.ts';
import cuttingSetupEndpoints from './controllers/cuttingSetupController.ts';
import windingSetupEndpoints from './controllers/windingSetupController.ts';
import vendorEndpoints from './controllers/vendorController.ts';
import materialOrderEndpoints from './controllers/materialOrdersController.ts';
import ticketEndpoints from './controllers/ticketController.ts';
import productEndpoints from './controllers/productController.ts';
import holdReasonEndpoints from './controllers/holdReasonController.ts';
import proofEndpoints from './controllers/proofController.ts';
import dieLineEndpoints from './controllers/dieLineController.ts';
import spotPlateEndpoints from './controllers/spotPlateController.ts';
import requestEndpoints from './controllers/requestController.ts';
import materialCategoryEndpoints from './controllers/materialCategoryController.ts';
import filePlanEndpoints from './controllers/filePlanController.ts';
import packagingEndpoints from './controllers/packagingController.ts';
import quoteEndpoints from './controllers/quoteController.ts';
import dieEndpoints from './controllers/dieController.ts';
import linerTypeEndpoints from './controllers/linerTypeController.ts';
import adhesiveCategoryEndpoints from './controllers/adhesiveCategoryController.ts';
import materialLengthAdjustmentEndpoints from './controllers/materialLengthAdjustmentController.ts';
import customerEndpoints from './controllers/customerController.ts';
import deliveryMethodEndpoints from './controllers/deliveryMethodController.ts';
import creditTermEndpoints from './controllers/creditTermsController.ts';


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
app.use('/die', dieEndpoints);
app.use('/liner-types', linerTypeEndpoints);
app.use('/adhesive-categories', adhesiveCategoryEndpoints);
app.use('/material-length-adjustments', materialLengthAdjustmentEndpoints);

app.use('/customers', customerEndpoints);
app.use('/delivery-methods', deliveryMethodEndpoints);
app.use('/credit-terms', creditTermEndpoints);

// This route loads the ENTIRE REACT APP
app.use('/react-ui', (_, response) => response.render('app.ejs'));

databaseConnection.on('error', (error) => {
    throw new Error(`Error connecting to the database: ${error}`);
});

databaseConnection.on('open', () => {
    httpServer.listen(PORT, () => {
        console.log(`Server started listening on PORT ${PORT}. Visit http://localhost:${PORT} in your browser`);
    });
});
