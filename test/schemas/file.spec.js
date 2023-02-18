const fileSchema = require('../../application/schemas/file');
const chance = require('chance').Chance();
const mongoose = require('mongoose');

describe('validation', () => {
    let fileAttributes,
        FileModel;

    beforeEach(() => {
        fileAttributes = {
            url: chance.url(),
            fileName: chance.string()
        };
        FileModel = mongoose.model('File', fileSchema);
    });

    it('should validate if all attributes are defined successfully', () => {
        const file = new FileModel(fileAttributes);

        const error = file.validateSync();

        expect(error).toBe(undefined);
    });
});