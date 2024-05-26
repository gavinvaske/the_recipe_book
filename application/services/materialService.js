const MaterialModel = require('../models/material');

module.exports.getMaterialIds = (materials) => {
    return materials.map(({materialId}) => {
        return materialId;
    });
};