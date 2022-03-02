const chance = require('chance').Chance();
const PrintingSetupModel = require('../../application/models/printingSetup');
const mongoose = require('mongoose');

describe('validation', () => {
    let printingSetupAttributes;

    beforeEach(() => {
        jest.resetAllMocks();
        printingSetupAttributes = {
            author: new mongoose.Types.ObjectId(),
            machine: new mongoose.Types.ObjectId(),
            framesToRun: chance.integer(),
            notes: chance.string(),
            material: new mongoose.Types.ObjectId(),
            video: chance.url(),
            difficulty: 'HaRd',
            alertTextBox: chance.word(),
            defaultMachine: new mongoose.Types.ObjectId(),
            recipe: new mongoose.Types.ObjectId()
        };
    });

    describe('successful validation', () => {
        it('should validate when attributes are defined correctly', () => {
            const printingSetup = new PrintingSetupModel(printingSetupAttributes);
    
            const error = printingSetup.validateSync();
    
            expect(error).toBe(undefined);
        });
    });

    describe('required attributes', () => {
        it('should fail if "author" is not define', () => {
            delete printingSetupAttributes.author;
            const printingSetup = new PrintingSetupModel(printingSetupAttributes);

            const error = printingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should fail if "machine" is not define', () => {
            delete printingSetupAttributes.machine;
            const printingSetup = new PrintingSetupModel(printingSetupAttributes);

            const error = printingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should fail if "framesToRun" is not define', () => {
            delete printingSetupAttributes.framesToRun;
            const printingSetup = new PrintingSetupModel(printingSetupAttributes);

            const error = printingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should fail if "material" is not define', () => {
            delete printingSetupAttributes.material;
            const printingSetup = new PrintingSetupModel(printingSetupAttributes);

            const error = printingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should fail if "difficulty" is not define', () => {
            delete printingSetupAttributes.difficulty;
            const printingSetup = new PrintingSetupModel(printingSetupAttributes);

            const error = printingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should fail if "recipe" is not define', () => {
            delete printingSetupAttributes.recipe;
            const printingSetup = new PrintingSetupModel(printingSetupAttributes);

            const error = printingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });
    });

    describe('trim attributes', () => {
        it('should trim whitespace around "notes"', () => {
            const notesWithoutWhitespace = printingSetupAttributes.notes;
            printingSetupAttributes.notes = ' ' + notesWithoutWhitespace + '  ';

            const printingSetup = new PrintingSetupModel(printingSetupAttributes);
    
            expect(printingSetup.notes).toBe(notesWithoutWhitespace);
        });

        it('should trim whitespace around "video"', () => {
            const videoWithoutWhitespace = printingSetupAttributes.video;
            printingSetupAttributes.video = ' ' + videoWithoutWhitespace + '  ';

            const printingSetup = new PrintingSetupModel(printingSetupAttributes);
    
            expect(printingSetup.video).toBe(videoWithoutWhitespace);
        });

        it('should trim whitespace around "alertTextBox"', () => {
            const alertTextBoxWithoutWhitespace = printingSetupAttributes.alertTextBox;
            printingSetupAttributes.alertTextBox = ' ' + alertTextBoxWithoutWhitespace + '  ';

            const printingSetup = new PrintingSetupModel(printingSetupAttributes);
    
            expect(printingSetup.alertTextBox).toBe(alertTextBoxWithoutWhitespace);
        });
    })

    describe('"difficulty" attribute validation', () => {
        const difficultyOptionsEnum = [
            'EASY',
            'MEDIUM',
            'HARD',
            'VERY DIFFICULT'
        ]
        it('should fail validation if diffulty is not one of the available enum options', () => {
            printingSetupAttributes.difficulty = chance.string();
            const printingSetup = new PrintingSetupModel(printingSetupAttributes);

            const error = printingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        })

        it('should have value from enum in "difficulty"', () => {
            const selectedOption = chance.pickone(difficultyOptionsEnum);
            printingSetupAttributes.difficulty = selectedOption;
            const printingSetup = new PrintingSetupModel(printingSetupAttributes);
    
            const error = printingSetup.validateSync();
    
            expect(error).toBe(undefined);
        });

        it('should convert attribute to uppercase', () => {
            printingSetupAttributes.difficulty = printingSetupAttributes.difficulty.toLowerCase();
            const printingSetup = new PrintingSetupModel(printingSetupAttributes);
    
            expect(printingSetup.difficulty).toBe(printingSetup.difficulty.toUpperCase());
        });

        it('should validate regardless of string capitalization', () => {
            printingSetupAttributes.difficulty = chance.pickone([
                printingSetupAttributes.difficulty.toUpperCase(),
                printingSetupAttributes.difficulty.toLowerCase()
            ]);
            const printingSetup = new PrintingSetupModel(printingSetupAttributes);

            expect(printingSetup.difficulty).toBe(printingSetup.difficulty.toUpperCase());
        })
    });

    it('should fail if video is not a valid URL', () => {
        printingSetupAttributes.video = chance.word();
        const printingSetup = new PrintingSetupModel(printingSetupAttributes);

        const error = printingSetup.validateSync();

        expect(error).not.toBe(undefined);
    });
});