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
            const expectedDieLineAttributes = {
                title: dieLineAttributes.title,
                description: dieLineAttributes.description,
            }
            const actualDieLineCard = cardService.buildDieLineCard(dieLineAttributes);

            expect(actualDieLineCard.dieLine._id).toBeDefined();
            expect(actualDieLineCard.dieLine).toEqual(expect.objectContaining(expectedDieLineAttributes));
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
            const expectedSpotPlateAttributes = {
                title: spotPlateAttributes.title,
                description: spotPlateAttributes.description
            }
            const actualSpotPlateCard = cardService.buildSpotPlateCard(spotPlateAttributes);

            expect(actualSpotPlateCard.spotPlate._id).toBeDefined();
            expect(actualSpotPlateCard.spotPlate).toEqual(expect.objectContaining(expectedSpotPlateAttributes));
        });
    });
});