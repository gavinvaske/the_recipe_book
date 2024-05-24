const MaterialModel = require('../../models/material')

module.exports.materialWatcher = (socket) => {
  MaterialModel.watch().on('change', async (change) => {
    console.log('Material changed:', change)
    const mongooseObjectId = change.documentKey._id;

    const material = await MaterialModel
      .findById(mongooseObjectId)
      .populate({path: 'vendor'})
      .populate({path: 'materialCategory'})
      .lean()
      .exec();

    socket.emit(mongooseObjectId, material, change);
  })
}