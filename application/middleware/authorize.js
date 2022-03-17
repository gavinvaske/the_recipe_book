const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

require('dotenv').config();

const FORBIDDEN_STATUS_CODE = 403;

module.exports.verifyJwtToken = async (request, response, next) => {
    const token = request.cookies.jwtToken;

    if (!token) {
        return response.status(FORBIDDEN_STATUS_CODE).redirect('/');
    }

    try {
        request.user = jwt.verify(token, process.env.JWT_SECRET);

        const userFromDatabase = await UserModel.findById(request.user.id);

        request.user.profilePicture = userFromDatabase.profilePicture;

        return next();
    } catch (error) {
        request.flash('errors', ['Authorization could not be verified, please sign in again']);
        response.clearCookie('jwtToken');
        return response.redirect('/');
    }
};