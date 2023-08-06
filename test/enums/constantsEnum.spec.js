const constantsEnum = require('../../application/enums/constantsEnum');

describe('constantsEnum', () => {
    it('MAX_FRAME_LENGTH_INCHES : should equal the correct value', () => {
        const expectedValue = 38.58;
        
        expect(constantsEnum.MAX_FRAME_LENGTH_INCHES).toEqual(expectedValue);
    });
    it('PER_BOX_MAX_POUNDS : should equal the correct value', () => {
        const expectedValue = 32;

        expect(constantsEnum.PER_BOX_MAX_POUNDS).toEqual(expectedValue);
    });
    it('BOX_LENGTH_INCHES : should equal the correct value', () => {
        const expectedValue = 14;

        expect(constantsEnum.BOX_LENGTH_INCHES).toEqual(expectedValue);
    });
    it('BOX_HEIGHT_INCHES : should equal the correct value', () => {
        const expectedValue = 12;

        expect(constantsEnum.BOX_HEIGHT_INCHES).toEqual(expectedValue);
    });
    it('BOX_WIDTH_INCHES : should equal the correct value', () => {
        const expectedValue = 14;

        expect(constantsEnum.BOX_WIDTH_INCHES).toEqual(expectedValue);
    });
    
    it('PRINTING_HOURLY_RATE : should equal the correct value', () => {
        const expectedValue = 154;

        expect(constantsEnum.PRINTING_HOURLY_RATE).toEqual(expectedValue);
    });
    it('CUTTING_HOURLY_RATE : should equal the correct value', () => {
        const expectedValue = 101;

        expect(constantsEnum.CUTTING_HOURLY_RATE).toEqual(expectedValue);
    });
    it('WINDING_HOURLY_RATE : should equal the correct value', () => {
        const expectedValue = 95;

        expect(constantsEnum.WINDING_HOURLY_RATE).toEqual(expectedValue);
    });
    it('BOXING_HOURLY_RATE : should equal the correct value', () => {
        const expectedValue = 20;

        expect(constantsEnum.BOXING_HOURLY_RATE).toEqual(expectedValue);
    });
    it('SHIPPING_HOURLY_RATE : should equal the correct value', () => {
        const expectedValue = 20;

        expect(constantsEnum.SHIPPING_HOURLY_RATE).toEqual(expectedValue);
    });

    it('NEWLY_LOADED_ROLL_WASTE_FEET : should equal the correct value', () => {
        const expectedValue = 78;

        expect(constantsEnum.NEWLY_LOADED_ROLL_WASTE_FEET).toEqual(expectedValue);
    });
    it('PRINT_CLEANER_FEET : should equal the correct value', () => {
        const expectedValue = 40;

        expect(constantsEnum.PRINT_CLEANER_FEET).toEqual(expectedValue);
    });
    it('PROOF_RUNUP_FEET : should equal the correct value', () => {
        const expectedValue = 23;

        expect(constantsEnum.PROOF_RUNUP_FEET).toEqual(expectedValue);
    });
    it('SCALING_FEET : should equal the correct value', () => {
        const expectedValue = 30;

        expect(constantsEnum.SCALING_FEET).toEqual(expectedValue);
    });
    it('DIE_LINE_SETUP_FEET : should equal the correct value', () => {
        const expectedValue = 6;

        expect(constantsEnum.DIE_LINE_SETUP_FEET).toEqual(expectedValue);
    });
    it('NEW_BLANKET_FEET : should equal the correct value', () => {
        const expectedValue = 88;

        expect(constantsEnum.NEW_BLANKET_FEET).toEqual(expectedValue);
    });
    it('NEW_PIP_FEET : should equal the correct value', () => {
        const expectedValue = 41;

        expect(constantsEnum.NEW_PIP_FEET).toEqual(expectedValue);
    });
    it('DIE_LINE_SETUP_FRAMES : should equal the correct value', () => {
        const expectedValue = 4;

        expect(constantsEnum.DIE_LINE_SETUP_FRAMES).toEqual(expectedValue);
    });
    it('SCALING_FRAMES : should equal the correct value', () => {
        const expectedValue = 9;

        expect(constantsEnum.SCALING_FRAMES).toEqual(expectedValue);
    });
    it('PRINT_CLEANER_FRAME : should equal the correct value', () => {
        const expectedValue = 20;

        expect(constantsEnum.PRINT_CLEANER_FRAME).toEqual(expectedValue);
    });
    
    it('BOX_COST : should equal the correct value', () => {
        const expectedValue = 5;

        expect(constantsEnum.BOX_COST).toEqual(expectedValue);
    });
    it('PER_CORE_COST : should equal the correct value', () => {
        const expectedValue = 0.10;

        expect(constantsEnum.PER_CORE_COST).toEqual(expectedValue);
    });

    it('REWINDING_CHANGE_OVER_MINUTES : should equal the correct value', () => {
        const expectedValue = 0.5;

        expect(constantsEnum.REWINDING_CHANGE_OVER_MINUTES).toEqual(expectedValue);
    });
    it('CORE_GATHERING_MINUTES : should equal the correct value', () => {
        const expectedValue = 3;

        expect(constantsEnum.CORE_GATHERING_MINUTES).toEqual(expectedValue);
    });
    it('PRINTING_ROLL_CHANGE_OVER_MINUTES : should equal the correct value', () => {
        const expectedValue = 7;

        expect(constantsEnum.PRINTING_ROLL_CHANGE_OVER_MINUTES).toEqual(expectedValue);
    });
    it('CUTTING_ROLL_CHANGE_OVER_MINUTES : should equal the correct value', () => {
        const expectedValue = 10;

        expect(constantsEnum.CUTTING_ROLL_CHANGE_OVER_MINUTES).toEqual(expectedValue);
    });
});