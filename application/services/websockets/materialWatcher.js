const MaterialModel = require('../../models/material');

module.exports.materialWatcher = (socket) => {
    MaterialModel.watch().on('change', async (change) => {
        const mongooseObjectId = change.documentKey._id;

        const material = await MaterialModel
            .findById(mongooseObjectId)
            .populate({path: 'vendor'})
            .populate({path: 'materialCategory'})
            .lean()
            .exec();

        socket.emit(mongooseObjectId, material, change);
        socket.emit('MATERIAL:CHANGED', material, change);
    });
};