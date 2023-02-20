const CardModel = require('../models/card');

module.exports.buildDieLineCard = (dieLineAttributes) => {
    const cardAttributes = {
        dieLine: dieLineAttributes
    };

    return new CardModel(cardAttributes);
};

module.exports.buildSpotPlateCard = (spotPlateAttributes) => {
    const cardAttributes = {
        spotPlate: spotPlateAttributes
    };

    return new CardModel(cardAttributes);
};