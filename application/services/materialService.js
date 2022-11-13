const MaterialModel = require('../models/material');

module.exports.getMaterialIds = (materials) => {
    return materials.map((material) => {
        return material._id;
    });
};

module.exports.getAllMaterials = async () => {
    return await MaterialModel
        .find()
        .exec();
};