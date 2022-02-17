const jwt = require('jsonwebtoken');

require('dotenv').config();

UNAUTHORIZED_STATUS_CODE = 401;
FORBIDDEN_STATUS_CODE = 403;

module.exports.verifyJwtToken = (request, response, next) => {
    const token = request.cookies.jwtToken;

    if (!token) {
        return response.sendStatus(FORBIDDEN_STATUS_CODE);
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        request.user = user;
        return next();
    } catch (error) {
        response.clearCookie('jwtToken');
        return response.redirect('/')
    }
}