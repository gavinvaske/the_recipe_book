const DowntimeReasonModel = require('../models/downtimeReason');

module.exports.getDowntimeReasons = async () => {
    const downtimeReasonMongooseObjects = await DowntimeReasonModel
        .find()
        .sort({reason: 1})
        .exec();

    return downtimeReasonMongooseObjects.map(({reason}) => {
        return reason;
    });
};