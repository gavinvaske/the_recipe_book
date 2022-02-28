const chance = require('chance').Chance();
const FinishModel = require('../../application/models/finish');

describe('validation', () => {
    let finishAttributes;

    beforeEach(() => {
        jest.resetAllMocks();
        finishAttributes = {
            name: chance.string()
        };
    });

    describe('successful validation', () => {
        it('should validate when required attributes are defined', () => {
            const finish = new FinishModel(finishAttributes);
    
            const error = finish.validateSync();
    
            expect(error).toBe(undefined);
        });

        it('should trim whitespace around "name"', () => {
            const name = chance.string();
            finishAttributes.name = ' ' + name + ' ';

            const finish = new FinishModel(finishAttributes);

            expect(finish.name).toBe(name);
        });
    });
});