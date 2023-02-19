const CardModel = require('../../application/models/card');
const chance = require('chance').Chance();
const databaseService = require('../../application/services/databaseService');

function createSpotPlate() {
    return {
        title: chance.string()
    };
}
function createDieLine() {
    return {
        title: chance.string()
    };
}

describe('validation', () => {
    let cardAttributes;

    beforeEach(() => {
        cardAttributes = {};
    });

    describe('verify timestamps on created object', () => {
        beforeEach(async () => {
            await databaseService.connectToTestMongoDatabase();
        });

        afterEach(async () => {
            await databaseService.closeDatabase();
        });

        describe('verify timestamps on created object', () => {
            it('should have a "createdAt" attribute once object is saved', async () => {
                const card = new CardModel(cardAttributes);
                let savedCard = await card.save({validateBeforeSave: false});

                console.log(`blah: ${JSON.stringify(savedCard)}`);
    
                expect(savedCard.createdAt).toBeDefined();
            });
    
            it('should have a "updated" attribute once object is saved', async () => {
                const card = new CardModel(cardAttributes);
                let savedCard = await card.save({validateBeforeSave: false});
    
                expect(savedCard.createdAt).toBeDefined();
            });
        });
    });

    it('should fail validation if all attributes are empty', async () => {
        let validationError;
        const card = new CardModel(cardAttributes);
    
        try {
            await card.validate();
        } catch (error) {
            validationError = error;
        }

        expect(validationError).not.toBe(undefined);
    });

    it('should pass validation if only one attribute is defined', async () => {
        let validationError;
        cardAttributes = {
            spotPlate: createSpotPlate()
        };
        const card = new CardModel(cardAttributes);
    
        try {
            await card.validate();
        } catch (error) {
            validationError = error;
        }

        expect(validationError).toBe(undefined);
    });

    it('should fail validation more than one attribute is defined', async () => {
        let validationError;
        cardAttributes = {
            spotPlate: createSpotPlate(),
            dieLine: createDieLine()
        };
        const card = new CardModel(cardAttributes);
    
        try {
            await card.validate();
        } catch (error) {
            validationError = error;
        }

        expect(validationError).not.toBe(undefined);
    });
});