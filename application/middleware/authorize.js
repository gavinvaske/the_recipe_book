const jwt = require('jsonwebtoken');

require('dotenv').config();

const FORBIDDEN_STATUS_CODE = 403;

module.exports.verifyJwtToken = (request, response, next) => {
    const token = request.cookies.jwtToken;

    if (!token) {
        return response.status(FORBIDDEN_STATUS_CODE).redirect('/');
    }

    try {
        request.user = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch (error) {
        response.clearCookie('jwtToken');
        return response.redirect('/');
    }
};