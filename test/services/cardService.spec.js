const chance = require('chance').Chance();
const cardService = require('../../application/services/cardService');

describe('cardService test suite', () => {
    describe('buildDieLineCard()', () => {
        let dieLineAttributes;

        beforeEach(() => {
            dieLineAttributes = {
                title: chance.string(),
                description: chance.string()
            };
        });

        it('should return a card with the correct attributes', () => {
            const actualDieLineCard = cardService.buildDieLineCard(dieLineAttributes);

            expect(actualDieLineCard.dieLine._id).toBeDefined();
            expect(actualDieLineCard.dieLine.title).toEqual(dieLineAttributes.title);
            expect(actualDieLineCard.dieLine.description).toEqual(dieLineAttributes.description);
        });
    });

    describe('buildSpotPlateCard()', () => {
        let spotPlateAttributes;

        beforeEach(() => {
            spotPlateAttributes = {
                title: chance.string(),
                description: chance.string()
            };
        });

        it('should return a card with the correct attributes', () => {
            const actualSpotPlateCard = cardService.buildSpotPlateCard(spotPlateAttributes);

            expect(actualSpotPlateCard.spotPlate._id).toBeDefined();
            expect(actualSpotPlateCard.spotPlate.title).toEqual(spotPlateAttributes.title);
            expect(actualSpotPlateCard.spotPlate.description).toEqual(spotPlateAttributes.description);
        });
    });
});