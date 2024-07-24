import Chance from 'chance';
const chance = Chance();
import * as dieService from '../../application/services/dieService.ts';

describe('File: dieService.js', () => {
    describe('Function: getCoreHeightFromDie()', () => {
        const CORE_HEIGHT_BUFFER = 0.125;

        it('should calculate the core height from the die correctly', () => {
            const sizeAcross = chance.d100();
            const die = {
                sizeAcross
            };
            const expectedCoreHeight = sizeAcross + CORE_HEIGHT_BUFFER;

            const actualCoreHeight = dieService.getCoreHeightFromDie(die);

            expect(actualCoreHeight).toEqual(expectedCoreHeight);
        });
    });
});