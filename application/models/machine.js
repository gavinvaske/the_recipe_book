import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import { getAllDepartments } from '../enums/departmentsEnum.js';

function isDepartmentValid(department) {
    if (!getAllDepartments().includes(department)) {
        return false;
    }

    return true;
}

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        validate: [isDepartmentValid, 'The department "{VALUE}" is not an accepted value.'],
    }
}, { timestamps: true });

const Machine = mongoose.model('Machine', schema);

export default Machine;
