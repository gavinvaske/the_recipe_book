const spotPlateCardSchema = require('../../application/schemas/spotPlateCard');
const chance = require('chance').Chance();
const mongoose = require('mongoose');

describe('validation', () => {
    let spotPlateCardAttributes,
        spotPlateCardModel;

    beforeEach(() => {
        spotPlateCardAttributes = {
            title: chance.string(),
            description: '',
            fileUploads: []
        };
        spotPlateCardModel = mongoose.model('File', spotPlateCardSchema);
    });

    it('should validate if all attributes are defined successfully', () => {
        const dieLineCard = new spotPlateCardModel(spotPlateCardAttributes);

        const error = dieLineCard.validateSync();

        expect(error).toBe(undefined);
    });
});