const chance = require('chance').Chance();
const DieModel = require('../../application/models/Die')

describe('validation', () => {
    let dieAttributes;

    beforeEach(() => {
        dieAttributes = {
            dieNumber: 'ABC-123',
            pitch: `${chance.floating()} CP`,
            gear: chance.d100(),
            shape: chance.string()
        };
    });

    it('should not fail validation if all attributes are defined correctly', () => {
        const die = new DieModel(dieAttributes);

        const error = die.validateSync();

        expect(error).toBeUndefined();
    });

    describe('attribute: dieNumber', () => {
        it('should fail validation if attribute is undefined', () => {
            delete dieAttributes.dieNumber;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).toBeDefined();
        });

        it('should be a string', () => {
            const die = new DieModel(dieAttributes);

            expect(die.dieNumber).toEqual(expect.any(String))
        });

        it('should fail if the string DOES NOT follow the correct regex pattern', () => {
            const invalidDieNumber = chance.word();
            dieAttributes.dieNumber = invalidDieNumber;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).toBeDefined()
        })

        it('should pass validation if the string DOES follow the correct regex pattern', () => {
            const validDieNumber = 'fdkjZKJKfdskljf-4892349823429';
            dieAttributes.dieNumber = validDieNumber;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).not.toBeDefined()
        })

        it('should convert the attribute to uppercase', () => {
            const lowerCaseDieNumber = 'abccc-111';
            dieAttributes.dieNumber = lowerCaseDieNumber;
            
            const die = new DieModel(dieAttributes);

            expect(die.dieNumber).toBe(lowerCaseDieNumber.toUpperCase())
        })
    });

    describe('attribute: pitch', () => {
        it('should be a number', () => {
            const die = new DieModel(dieAttributes);

            expect(die.pitch).toEqual(expect.any(Number))
        });

        it('should fail validation if attribute is not defined', () => {
            delete dieAttributes.pitch;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync();

            expect(error).toBeDefined();
        })

        it('should remove non-digits', () => {
            const expectedPitch = chance.floating({ min: 0 });
            const pitchContainingNonDigits = `fdskfjs*()(*--$#*$${expectedPitch}fjkhfdskjfsfsdf`
            dieAttributes.pitch = pitchContainingNonDigits;
            
            const die = new DieModel(dieAttributes);

            expect(die.pitch).toBe(expectedPitch);
        })

        it('should not remove all non-digits except for the decimal points', () => {
            const expectedPitch = 1234567.1234
            const pitchContainingNonDigits = `${expectedPitch} CP`
            dieAttributes.pitch = pitchContainingNonDigits;
            
            const die = new DieModel(dieAttributes);

            expect(die.pitch).toBe(expectedPitch);
        })

        it('should handle floating points', () => {
            const expectedPitch = chance.floating({ min: 0 })
            const pitchContainingNonDigits = expectedPitch
            dieAttributes.pitch = pitchContainingNonDigits;
            
            const die = new DieModel(dieAttributes);

            expect(die.pitch).toBe(expectedPitch);
        })
    })

    describe('attribute: gear', () => {
        it('should be a number', () => {
            const die = new DieModel(dieAttributes);

            expect(die.gear).toEqual(expect.any(Number))
        });

        it('should fail validation if attribute is not defined', () => {
            delete dieAttributes.gear;
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();

            expect(error).toBeDefined()
        })

        it('should fail validation if attribute is negative', () => {
            dieAttributes.gear = chance.integer({ max: -1 });
            const die = new DieModel(dieAttributes);
            
            const error = die.validateSync();

            expect(error).toBeDefined()
        })
    })

    describe('attribute: shape', () => {
        it('should be a string', () => {
            const die = new DieModel(dieAttributes);

            expect(die.shape).toEqual(expect.any(String));
        });

        it('should fail validation if attribute is undefined', () => {
            delete dieAttributes.shape;
            const die = new DieModel(dieAttributes);

            const error = die.validateSync()

            expect(error).toBeDefined();
        })
    })
});