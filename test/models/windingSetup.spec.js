const chance = require('chance').Chance();
const WindingSetupModel = require('../../application/models/windingSetup');
const mongoose = require('mongoose');

describe('validation', () => {
    let windingSetupAttributes;

    beforeEach(() => {
        jest.resetAllMocks();
        windingSetupAttributes = {
            author: new mongoose.Types.ObjectId(),
            machine: new mongoose.Types.ObjectId(),
            notes: chance.string(),
            video: chance.url(),
            watchOutFor: [
                'uv missing',
                'flags'
            ],
            difficulty: 'medium',
            backWinding: chance.bool(),
            alertTextBox: chance.string(),
            defaultMachine: new mongoose.Types.ObjectId()
        };
    });

    it('should validate when all attributes are defined correctly', () => {
        const windingSetup = new WindingSetupModel(windingSetupAttributes);
    
        const error = windingSetup.validateSync();

        expect(error).toBe(undefined);
    });

    describe('"author" attribute', () => {
        it('should fail if "author" is not define', () => {
            delete windingSetupAttributes.author;
            const windingSetup = new WindingSetupModel(windingSetupAttributes);

            const error = windingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });
    });

    describe('"machine" attribute', () => {
        it('should fail if "machine" is not define', () => {
            delete windingSetupAttributes.machine;
            const windingSetup = new WindingSetupModel(windingSetupAttributes);

            const error = windingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should fail if "machine" is not correct data type', () => {
            windingSetupAttributes.machine = chance.pickone([
                chance.string,
                chance.integer()
            ]);
            const windingSetup = new WindingSetupModel(windingSetupAttributes);

            const error = windingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });
    });

    describe('"notes" attribute', () => {
        it('should trim whitespace around "notes"', () => {
            const notesWithoutWhitespace = windingSetupAttributes.notes;
            windingSetupAttributes.notes = ' ' + notesWithoutWhitespace + '  ';

            const windingSetup = new WindingSetupModel(windingSetupAttributes);
    
            expect(windingSetup.notes).toBe(notesWithoutWhitespace);
        });
    });

    describe('"video" attribute', () => {
        it('should fail if video is not a valid URL', () => {
            windingSetupAttributes.video = chance.word();
            const windingSetup = new WindingSetupModel(windingSetupAttributes);
    
            const error = windingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });
    });

    describe('"watchOutFor" attribute', () => {
        const watchOutForOptionsEnum = [
            'FLAGS',
            'UV MISSING',
            'BUTT CUT',
            'MISSING LABELS',
            'LABELS CUT OFF'
        ];

        it('should fail validation if "watchOutFor" is not one of the available enum options', () => {
            windingSetupAttributes.watchOutFor = chance.string();
            const windingSetup = new WindingSetupModel(windingSetupAttributes);

            const error = windingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should have value from enum in "watchOutFor"', () => {
            const selectedOption = chance.pickone(watchOutForOptionsEnum);
            windingSetupAttributes.watchOutFor = selectedOption;
            const windingSetup = new WindingSetupModel(windingSetupAttributes);
    
            const error = windingSetup.validateSync();
    
            expect(error).toBe(undefined);
        });
    });

    describe('"difficulty" attribute', () => {
        it('should fail if "difficulty" is not define', () => {
            delete windingSetupAttributes.difficulty;
            const windingSetup = new WindingSetupModel(windingSetupAttributes);

            const error = windingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });
    });

    describe('"backWinding" attribute', () => {
        it('should fail if "backWinding" is not correct data type', () => {
            windingSetupAttributes.backWinding = chance.pickone([
                chance.string,
                chance.integer({min: 2})
            ]);
            const windingSetup = new WindingSetupModel(windingSetupAttributes);

            const error = windingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });
    });

    describe('"alertTextBox" attribute', () => {
        it('should trim whitespace around "alertTextBox"', () => {
            const alertTextBoxWithoutWhitespace = windingSetupAttributes.alertTextBox;
            windingSetupAttributes.alertTextBox = ' ' + alertTextBoxWithoutWhitespace + '  ';

            const windingSetup = new WindingSetupModel(windingSetupAttributes);
    
            expect(windingSetup.alertTextBox).toBe(alertTextBoxWithoutWhitespace);
        });
    });

    describe('"defaultMachine" attribute', () => {
        it('should fail if "defaultMachine" is not correct data type', () => {
            windingSetupAttributes.defaultMachine = chance.pickone([
                chance.string,
                chance.integer()
            ]);
            const windingSetup = new WindingSetupModel(windingSetupAttributes);

            const error = windingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });
    });
});