import { MaterialOrderModel } from '../../models/materialOrder.ts';

export function materialOrderWatcher(socket) {
  MaterialOrderModel.watch().on('change', async (change) => {
        const mongooseObjectId = change.documentKey._id;

        const materialOrder = await MaterialOrderModel
            .findById(mongooseObjectId)
            .populate({path: 'author'})
            .populate({path: 'material'})
            .populate({path: 'vendor'})
            .lean()
            .exec();

        socket.emit(mongooseObjectId, materialOrder, change);
        socket.emit('MATERIAL_ORDER:CHANGED', materialOrder, change);
    });
}