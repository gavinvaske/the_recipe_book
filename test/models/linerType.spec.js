const chance = require('chance').Chance();
const LinerTypeModel = require('../../application/models/linerType')
const databaseService = require('../../application/services/databaseService');

describe('linerType validation', () => {
  let linerTypeAttributes;
  
  beforeEach(() => {
    linerTypeAttributes = {
      name: chance.string() 
    }
  });

  it('should have the correct indexes', async () => {
    const indexMetaData = LinerTypeModel.schema.indexes();
    const expectedIndexes = ['name'];

    console.log('indexMetaData: ', indexMetaData);

    const isEveryExpectedIndexActuallyAnIndex = expectedIndexes.every((expectedIndex) => {
        return indexMetaData.some((metaData) => {
            const index = Object.keys(metaData[0])[0];
            if (index === expectedIndex) return true;
        });
    });

    expect(isEveryExpectedIndexActuallyAnIndex).toBe(true);
});

  describe('attribute: name', () => {
    it('should be required', () => {
      delete linerTypeAttributes.name;
      const linerType = new LinerTypeModel(linerTypeAttributes)
      
      const error = linerType.validateSync();

      expect(error).toBeDefined()
    })

    it('should be a string', () => {
      const linerType = new LinerTypeModel(linerTypeAttributes)

      expect(linerType.name ).toEqual(expect.any(String))
    })

    it('should trim string before saving', () => {
      const expectedName = chance.string().toUpperCase();
      linerTypeAttributes.name = `  ${expectedName}  `
      const linerType = new LinerTypeModel(linerTypeAttributes);

      expect(linerType.name).toBe(expectedName)
    })

    it('should uppercase name', () => {
      const lowerCaseName = chance.string().toLowerCase();
      linerTypeAttributes.name = lowerCaseName
      const linerType = new LinerTypeModel(linerTypeAttributes);

      expect(linerType.name).toBe(lowerCaseName.toUpperCase())
    })
  })

  describe('verify database interactions', () => {
    beforeAll(async () => {
      await databaseService.connectToTestMongoDatabase();
    });

    afterEach(async () => {
        await databaseService.clearDatabase();
    });

    afterAll(async () => {
        await databaseService.closeDatabase();
    });
  
    it('should have timestamps', async () => {
      const linerType = new LinerTypeModel(linerTypeAttributes);

      const savedLinerType = await linerType.save()
      
      expect(savedLinerType.createdAt).toBeDefined()
      expect(savedLinerType.updatedAt).toBeDefined()
    })

    it('should be soft deletable', async () => {
      const linerType = new LinerTypeModel(linerTypeAttributes);
      const id = linerType._id;

      await linerType.save();
      await LinerTypeModel.deleteById(id);

      const softDeletedAdhesiveCategory = await LinerTypeModel.findOneDeleted({ _id: id }).exec();

      expect(softDeletedAdhesiveCategory).toBeDefined();
      expect(softDeletedAdhesiveCategory.deleted).toBe(true);
    });

    it('should be able to create a new LinerType using the same name as a previously deleted LinerType', async () => {
      const duplicateName = chance.string();
      linerTypeAttributes.name = duplicateName;
      const linerType = new LinerTypeModel(linerTypeAttributes);
      const id = linerType._id;

      await linerType.save();
      await LinerTypeModel.deleteById(id);

      const linerType2 = new LinerTypeModel(linerTypeAttributes);
      await linerType2.save();

      // if it made it here without an error, the test passed successfully
      expect(true).toBe(true)
    });
  });
})