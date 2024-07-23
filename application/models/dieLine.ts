import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import fileSchema from '../schemas/s3File';
import destinationSchema from '../schemas/destination';
import * as departmentsEnum from '../enums/departmentsEnum';

function isValidDieLineDestination(destination) {
    const {department, departmentStatus} = destination;

    if (!destination.department && !destination.departmentStatus) return false;

    const validDepartmentStatuses = departmentsEnum.departmentToDepartmentStatusesForDieLineRequests[department];

    if (!validDepartmentStatuses) return false;

    if (validDepartmentStatuses.length === 0) { 
        return !departmentStatus;
    };
    
    return validDepartmentStatuses.includes(departmentStatus);
}

const dieLineSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    fileUploads: {
        type: [fileSchema],
        required: false
    },
    destination: {
        type: destinationSchema,
        required: false,
        validate: [isValidDieLineDestination, 'A "Die Line Request" cannot be moved to the following destination: {VALUE}']
    }
}, { timestamps: true });

const DieLine = mongoose.model('DieLine', dieLineSchema);

export default DieLine;