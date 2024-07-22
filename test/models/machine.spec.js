import Chance from 'chance';
import MachineModel from '../../application/models/machine';
import * as departmentEnum from '../../application/enums/departmentsEnum';

const chance = Chance();

describe('validation', () => {
    let machineAttributes;

    beforeEach(() => {
        jest.resetAllMocks();
        machineAttributes = {
            name: chance.string(),
            department: chance.pickone(departmentEnum.getAllDepartments())
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

        it('should fail when department is not defined', () => {
            delete machineAttributes.department;

            const machine = new MachineModel(machineAttributes);
            const error = machine.validateSync();

            expect(error).not.toBe(undefined);
        });
    });
});