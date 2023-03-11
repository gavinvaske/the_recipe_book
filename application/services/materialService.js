const MaterialModel = require('../models/material');

module.exports.getMaterialIds = (materials) => {
    return materials.map(({materialId}) => {
        return materialId;
    });
};

module.exports.getAllMaterials = async () => {
    return await MaterialModel
        .find()
        .exec();
};