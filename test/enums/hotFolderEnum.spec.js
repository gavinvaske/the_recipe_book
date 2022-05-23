const hotFolderEnum = require('../../application/enums/hotFolderEnum');

describe('departmentsEnum', () => {
    it('should return the correct number of items', () => {
        const expectedNumberOfHotFolders = 64;

        const hotFolders = hotFolderEnum.hotFolders;

        expect(Object.keys(hotFolders).length).toBe(expectedNumberOfHotFolders);
    });
});