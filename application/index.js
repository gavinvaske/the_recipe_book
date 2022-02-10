const express = require('express');
const path = require('path');
var expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const defaultPort = 8080;
const PORT = process.env.PORT || defaultPort;

const app = express();

app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('layout', path.join(__dirname, '/views/layout.ejs'))

app.use('/', require('./controllers/index'));
app.use('/users', require('./controllers/users'));

app.listen(PORT, () => {
    console.log(`Server started listening on PORT ${PORT}. Visit http://localhost:${PORT} in your browser`);
});

