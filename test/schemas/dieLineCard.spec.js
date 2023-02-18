const dieLineCardSchema = require('../../application/schemas/dieLineCard');
const chance = require('chance').Chance();
const mongoose = require('mongoose');

describe('validation', () => {
    let dieLineCardAttributes,
        dieLineCardModel;

    beforeEach(() => {
        dieLineCardAttributes = {
            title: chance.string(),
            description: '',
            fileUploads: []
        };
        dieLineCardModel = mongoose.model('File', dieLineCardSchema);
    });

    it('should validate if all attributes are defined successfully', () => {
        const dieLineCard = new dieLineCardModel(dieLineCardAttributes);

        const error = dieLineCard.validateSync();

        expect(error).toBe(undefined);
    });
});