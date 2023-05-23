/* eslint no-magic-numbers: 0 */
const distributionGeneratorService = require('../../application/services/distributionGeneratorService');

describe('distributionGeneratorService.js', () => {
    let groupSize;

    it('should build corect distributions with a groupSize of 1', () => {
        groupSize = 1;
        const expectedDistributions = {
            1: [[groupSize]]
        };

        const actualDistributions = distributionGeneratorService.getDistributions(groupSize);

        expect(actualDistributions).toEqual(expectedDistributions);
    });

    it('should build corect distributions with a groupSize of 2', () => {
        groupSize = 2;
        const expectedDistributions = {
            1: [[groupSize]],
            2: [[1, 1]]
        };

        const actualDistributions = distributionGeneratorService.getDistributions(groupSize);

        expect(actualDistributions).toEqual(expectedDistributions);
    });

    it('should build corect distributions with a groupSize of 3', () => {
        groupSize = 3;
        const expectedDistributions = {
            1: [[groupSize]],
            2: [[1, 2]],
            3: [[1, 1, 1]]
        };

        const actualDistributions = distributionGeneratorService.getDistributions(groupSize);

        expect(actualDistributions).toEqual(expectedDistributions);
    });

    it('should build corect distributions with a groupSize of 4', () => {
        groupSize = 4;
        const expectedDistributions = {
            1: [[groupSize]],
            2: [[1, 3], [2, 2]],
            3: [[1, 1, 2]],
            4: [[1, 1, 1, 1]]
        };

        const actualDistributions = distributionGeneratorService.getDistributions(groupSize);

        expect(actualDistributions).toEqual(expectedDistributions);
    });

    it('should build corect distributions with a groupSize of 5', () => {
        groupSize = 5;
        const expectedDistributions = {
            1: [[groupSize]],
            2: [[1, 4], [2, 3]],
            3: [[1, 1, 3], [1, 2, 2]],
            4: [[1, 1, 1, 2]],
            5: [[1, 1, 1, 1, 1]]
        };

        const actualDistributions = distributionGeneratorService.getDistributions(groupSize);

        expect(actualDistributions).toEqual(expectedDistributions);
    });

    it('should build corect distributions with a groupSize of 6', () => {
        groupSize = 6;
        const expectedDistributions = {
            1: [[groupSize]],
            2: [[1, 5], [2, 4], [3, 3]],
            3: [[1, 1, 4], [1, 2, 3], [2, 2, 2]],
            4: [[1, 1, 1, 3], [1, 1, 2, 2]],
            5: [[1, 1, 1, 1, 2]],
            6: [[1, 1, 1, 1, 1, 1]]
        };

        const actualDistributions = distributionGeneratorService.getDistributions(groupSize);

        expect(actualDistributions).toEqual(expectedDistributions);
    });

    it('should build corect distributions with a groupSize of 7', () => {
        groupSize = 7;
        const expectedDistributions = {
            1: [[groupSize]],
            2: [[1, 6], [2, 5], [3, 4]],
            3: [[1, 1, 5], [1, 2, 4], [2, 2, 3], [1, 3, 3]],
            4: [[1, 1, 1, 4], [1, 1, 2, 3], [1, 2, 2, 2]],
            5: [[1, 1, 1, 1, 3], [1, 1, 1, 2, 2]],
            6: [[1, 1, 1, 1, 1, 2]],
            7: [[1, 1, 1, 1, 1, 1, 1]]
        };

        const actualDistributions = distributionGeneratorService.getDistributions(groupSize);

        expect(actualDistributions).toEqual(expectedDistributions);
    });

    it('should build corect distributions with a groupSize of 8', () => {
        groupSize = 8;
        const expectedDistributions = {
            1: [[groupSize]],
            2: [[1, 7], [2, 6], [3, 5], [4, 4]],
            3: [[1, 1, 6], [1, 2, 5], [2, 2, 4], [2, 3, 3], [1, 3, 4]],
            4: [[1, 1, 1, 5], [1, 1, 2, 4], [1, 2, 2, 3], [2, 2, 2, 2], [1, 1, 3, 3]],
            5: [[1, 1, 1, 1, 4], [1, 1, 1, 2, 3], [1, 1, 2, 2, 2]],
            6: [[1, 1, 1, 1, 1, 3], [1, 1, 1, 1, 2, 2]],
            7: [[1, 1, 1, 1, 1, 1, 2]],
            8: [[1, 1, 1, 1, 1, 1, 1, 1]]
        };

        const actualDistributions = distributionGeneratorService.getDistributions(groupSize);

        expect(actualDistributions).toEqual(expectedDistributions);
    });
});