const chance = require('chance').Chance();
const becksService = require('../../application/services/becksService');

describe('becksService test suite', () => {
    it('should return true if both strings are identical', () => {
        const s = chance.character();
        const t = s;

        const isAnogram = becksService.practiceProblem(s, t);

        expect(isAnogram).toBeTruthy()
    })

    it('should return false if strings are not anograms', () => {
        const s = 'b';
        const t = 'c';

        const isAnogram = becksService.practiceProblem(s, t);

        expect(isAnogram).toBeFalsy()
    })

    it('should return true if words are not anograms dsfsfds', () => {
        const s = 'heart';
        const t = 'earth';

        const isAnogram = becksService.practiceProblem(s, t);

        expect(isAnogram).toBeTruthy()
    })

    it('should return true if strings are anograms', () => {
        const s = 'anagram';
        const t = 'nagaram';

        const isAnogram = becksService.practiceProblem(s, t);

        expect(isAnogram).toBeTruthy()
    })

    it('should return false if words are not anograms', () => {
        const s = 'heartt';
        const t = 'earthh';

        const isAnogram = becksService.practiceProblem(s, t);

        expect(isAnogram).toBeFalsy()
    })
});