import 'dotenv/config';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import mongoose from 'mongoose';
import { connectToMongoDatabase } from './services/databaseService.ts';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import session from 'express-session';
import fs from 'fs';
import ejsService from './services/ejsService.ts';
import httpServ from 'http';
import { Server } from 'socket.io';
import customWebSockets from './services/websockets/init.ts';
import { setupApiRoutes } from './routes.ts'
import path from 'path';
import { fileURLToPath } from 'url';

connectToMongoDatabase(process.env.MONGO_DB_URL);
const databaseConnection = mongoose.connection;

const defaultPort = 8080;
const PORT = process.env.PORT || defaultPort;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.locals.helperMethods = ejsService;

const httpServer = new httpServ.Server(app);
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

const publicDirectory = 'application/public'

app.use(express.static(publicDirectory));

if (!fs.existsSync(publicDirectory)) {
    throw new Error('Public folder does not exist, cannot render any .ejs views and/or css styles for those pages');
}

const reactBuildFolderPath = 'build';

if (!fs.existsSync(reactBuildFolderPath)) {
    throw new Error('React build folder does not exist. Please run `npm run build` and try again.');
}

const pathToReactEntryPoint = path.join(__dirname, '..', 'react/index.html')

if (!fs.existsSync(pathToReactEntryPoint)) {
  throw new Error(`React entry file does not exist. Investigate why this path is not linked correctly: ${pathToReactEntryPoint}`);
}

app.use(express.static(reactBuildFolderPath));  // Sets up React

/* Defines every HTTP route the API provides */ 
setupApiRoutes(app)

// This route loads the ENTIRE REACT APP
app.use('/react-ui', (_, response) => {
  response.sendFile(pathToReactEntryPoint);
});

databaseConnection.on('error', (error) => {
    throw new Error(`Error connecting to the database: ${error}`);
});

databaseConnection.on('open', () => {
    httpServer.listen(PORT, () => {
        console.log(`Server started listening on PORT ${PORT}. Visit http://localhost:${PORT} in your browser`);
    });
});
