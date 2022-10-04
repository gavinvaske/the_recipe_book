const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
require('dotenv').config();
const databaseService = require('./services/databaseService');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');

databaseService.connectToMongoDatabase(process.env.MONGO_DB_URL);
const databaseConnection = mongoose.connection;

const defaultPort = 8080;
const PORT = process.env.PORT || defaultPort;

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const PurchaseOrderModel = require('./models/materialOrder');

PurchaseOrderModel.watch().on('change', async (change) => {
    console.log(`Change to a PurchaseOrder in database ${JSON.stringify(change)}`)
    
    const operationType = change.operationType;
    const purchaseOrderObjectId = change.documentKey._id;
    let purchaseOrder = null;

    if (operationType === 'delete') {
        console.log(`PurchaseOrder was deleted: ${JSON.stringify(change)}`)
        io.emit(purchaseOrderObjectId, purchaseOrder);

        return;
    }

    purchaseOrder = await PurchaseOrderModel
        .findById(change.documentKey._id)
        .populate({path: 'material'});

    if (operationType === 'update') {
        console.log(`P.O has been updated`);
        io.emit('test', purchaseOrder);
    } else if (operationType === 'insert') {
        console.log(`P.O has been created`);
    }
});

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
app.use('/material-inventory', require('./controllers/materialInventory'));

databaseConnection.on('error', (error) => {
    throw new Error(`Error connecting to the database: ${error}`);
});

databaseConnection.on('open', () => {
    http.listen(PORT, () => {
        console.log(`Server started listening on PORT ${PORT}. Visit http://localhost:${PORT} in your browser`);
    });
});
