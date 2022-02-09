const express = require('express');
const router = express.Router();

router.get('/move', (request, response) => {
    response.send('You moved');
});

module.exports = router;