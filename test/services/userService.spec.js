const {createUser} = require('../../application/services/userService');
const databaseService = require('../../application/services/databaseService');
const UserModel = require('../../application/models/user');

beforeAll(async () => {
    await databaseService.connectToTestMongoDatabase();
});

afterEach(async () => {
    await databaseService.clearDatabase();
    jest.resetAllMocks();
});

afterAll(async () => {
    await databaseService.closeDatabase();
});

it('should save user to database', async () => {
    let userAttributes = {
        email: 'test@gmail.com',
        password: '12345678'
    };
    const {_id} = await createUser(userAttributes);

    const userFromDatabase = await UserModel.findById(_id);

    expect(userFromDatabase.email).toBe(userAttributes.email.toUpperCase());
    expect(userFromDatabase.password).toBe(userAttributes.password);
});