const chance = require('chance').Chance();
const MachineModel = require('../../application/models/machine');

describe('validation', () => {
    let machineAttributes;

    beforeEach(() => {
        jest.resetAllMocks();
        machineAttributes = {
            name: chance.string()
        };
    });

    describe('successful validation', () => {
        it('should validate when required attributes are defined', () => {
            const machine = new MachineModel(machineAttributes);
    
            const error = machine.validateSync();
    
            expect(error).toBe(undefined);
        });

        it('should trim whitespace around "name"', () => {
            const name = chance.string();
            machineAttributes.name = ' ' + name + ' ';

            const machine = new MachineModel(machineAttributes);

            expect(machine.name).toBe(name);
        });
    });
});