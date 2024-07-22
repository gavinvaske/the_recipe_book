import { TIMER_TYPES } from '../../application/enums/timerTypesEnum';

describe('File: timerTypesEnum.js', () => {
    it('should have the correct value for TIMER_TYPES', () => {
        const expectedValue = [
            'PRINTING_SETUP',
            'PRINTING',
            'CUTTING_SETUP',
            'CUTTING',
            'WINDING'
        ];

        expect(TIMER_TYPES).toEqual(expectedValue);
    });
});