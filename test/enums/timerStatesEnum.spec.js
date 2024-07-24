import { TIMER_STATES } from '../../application/api/enums/timerStatesEnum';

describe('File: timerStatesEnum.js', () => {
    it('should have the correct value for TIMER_STATES', () => {
        const expectedValue = [
            'STARTED',
            'PAUSED',
            'STOPPED'
        ];

        expect(TIMER_STATES).toEqual(expectedValue);
    });
});