const express = require('express');
const router = express.Router();

router.get('/login', (request, response) => {
    response.render('login');
});

router.post('/login', (request, response) => {
    response.json('TODO: Build this endpoint');
});

router.get('/register', (request, response) => {
    response.render('register');
});

router.post('/register', (request, response) => {
    response.json('TODO: Build this endpoint');
});

module.exports = router;