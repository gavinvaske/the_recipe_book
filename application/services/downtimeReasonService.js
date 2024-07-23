import DowntimeReasonModel from '../models/downtimeReason';

export async function getDowntimeReasons() {
    const downtimeReasonMongooseObjects = await DowntimeReasonModel
        .find()
        .sort({reason: 1})
        .exec();

    return downtimeReasonMongooseObjects.map(({reason}) => {
        return reason;
    });
}