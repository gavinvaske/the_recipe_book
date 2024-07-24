import * as hotFolderEnum from '../../application/api/enums/hotFolderEnum';

describe('departmentsEnum', () => {
    it('should return the correct number of items', () => {
        const expectedNumberOfHotFolders = 64;

        const hotFolders = hotFolderEnum.hotFolders;

        expect(Object.keys(hotFolders).length).toBe(expectedNumberOfHotFolders);
    });

    it('should return the correct number of unique hot folders', () => {
        const expectedNumberOfUniqueHotFolders = 4;

        const uniqueHotFolders = hotFolderEnum.getUniqueHotFolders();

        expect(uniqueHotFolders.length).toBe(expectedNumberOfUniqueHotFolders);
    });
});