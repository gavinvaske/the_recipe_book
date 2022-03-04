const chance = require('chance').Chance();
const CuttingSetupModel = require('../../application/models/cuttingSetup');
const mongoose = require('mongoose');

describe('validation', () => {
    let cuttingSetupAttributes;

    beforeEach(() => {
        jest.resetAllMocks();
        cuttingSetupAttributes = {
            author: new mongoose.Types.ObjectId(),
            machine: new mongoose.Types.ObjectId(),
            notes: chance.string(),
            finish: new mongoose.Types.ObjectId(),
            setupFeet: chance.integer(),
            jobSpeed: chance.integer(),
            video: chance.url(),
            difficulty: 'eAsy',
            recipe: new mongoose.Types.ObjectId(),
            alertTextBox: chance.word(),
            defaultMachine: new mongoose.Types.ObjectId()
        };
    });

    describe('successful validation', () => {
        it('should validate when attributes are defined correctly', () => {
            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);
    
            const error = cuttingSetup.validateSync();
    
            expect(error).toBe(undefined);
        });
    });

    describe('required attributes', () => {
        it('should fail if "author" is not define', () => {
            delete cuttingSetupAttributes.author;
            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);

            const error = cuttingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should fail if "machine" is not define', () => {
            delete cuttingSetupAttributes.machine;
            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);

            const error = cuttingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should fail if "finish" is not define', () => {
            delete cuttingSetupAttributes.finish;
            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);

            const error = cuttingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should fail if "setupFeet" is not define', () => {
            delete cuttingSetupAttributes.setupFeet;
            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);

            const error = cuttingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should fail if "jobSpeed" is not define', () => {
            delete cuttingSetupAttributes.jobSpeed;
            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);

            const error = cuttingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should fail if "difficulty" is not define', () => {
            delete cuttingSetupAttributes.difficulty;
            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);

            const error = cuttingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });
    });

    describe('trim attributes', () => {
        it('should trim whitespace around "notes"', () => {
            const notesWithoutWhitespace = cuttingSetupAttributes.notes;
            cuttingSetupAttributes.notes = ' ' + notesWithoutWhitespace + '  ';

            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);
    
            expect(cuttingSetup.notes).toBe(notesWithoutWhitespace);
        });

        it('should trim whitespace around "video"', () => {
            const videoWithoutWhitespace = cuttingSetupAttributes.video;
            cuttingSetupAttributes.video = ' ' + videoWithoutWhitespace + '  ';

            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);
    
            expect(cuttingSetup.video).toBe(videoWithoutWhitespace);
        });

        it('should trim whitespace around "alertTextBox"', () => {
            const alertTextBoxWithoutWhitespace = cuttingSetupAttributes.alertTextBox;
            cuttingSetupAttributes.alertTextBox = ' ' + alertTextBoxWithoutWhitespace + '  ';

            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);
    
            expect(cuttingSetup.alertTextBox).toBe(alertTextBoxWithoutWhitespace);
        });
    });

    describe('"difficulty" attribute validation', () => {
        const difficultyOptionsEnum = [
            'EASY',
            'MEDIUM',
            'HARD',
            'VERY DIFFICULT'
        ];
        it('should fail validation if diffulty is not one of the available enum options', () => {
            cuttingSetupAttributes.difficulty = chance.string();
            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);

            const error = cuttingSetup.validateSync();
    
            expect(error).not.toBe(undefined);
        });

        it('should have value from enum in "difficulty"', () => {
            const selectedOption = chance.pickone(difficultyOptionsEnum);
            cuttingSetupAttributes.difficulty = selectedOption;
            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);
    
            const error = cuttingSetup.validateSync();
    
            expect(error).toBe(undefined);
        });

        it('should convert attribute to uppercase', () => {
            cuttingSetupAttributes.difficulty = cuttingSetupAttributes.difficulty.toLowerCase();
            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);
    
            expect(cuttingSetup.difficulty).toBe(cuttingSetup.difficulty.toUpperCase());
        });

        it('should validate regardless of string capitalization', () => {
            cuttingSetupAttributes.difficulty = chance.pickone([
                cuttingSetupAttributes.difficulty.toUpperCase(),
                cuttingSetupAttributes.difficulty.toLowerCase()
            ]);
            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);

            expect(cuttingSetup.difficulty).toBe(cuttingSetup.difficulty.toUpperCase());
        });
    });
    
    describe('attribute "setupFeet"', () => {
        it('should not fail if "setupFeet" is a string represented number', () => {
            cuttingSetupAttributes.setupFeet = cuttingSetupAttributes.setupFeet.toString();
            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);

            const error = cuttingSetup.validateSync();

            expect(error).toBe(undefined);
        });

        it('should fail if "setupFeet" is a non-numberic string', () => {
            cuttingSetupAttributes.setupFeet = chance.string();
            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);

            const error = cuttingSetup.validateSync();

            expect(error).not.toBe(undefined);
        });
    });

    describe('attribute "jobSpeed"', () => {
        it('should not fail if "jobSpeed" is a string represented number', () => {
            cuttingSetupAttributes.jobSpeed = cuttingSetupAttributes.jobSpeed.toString();
            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);

            const error = cuttingSetup.validateSync();

            expect(error).toBe(undefined);
        });

        it('should fail if "jobSpeed" is a non-numberic string', () => {
            cuttingSetupAttributes.jobSpeed = chance.string();
            const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);

            const error = cuttingSetup.validateSync();

            expect(error).not.toBe(undefined);
        });
    });

    it('should fail if video is not a valid URL', () => {
        cuttingSetupAttributes.video = chance.word();
        const cuttingSetup = new CuttingSetupModel(cuttingSetupAttributes);

        const error = cuttingSetup.validateSync();

        expect(error).not.toBe(undefined);
    });
});