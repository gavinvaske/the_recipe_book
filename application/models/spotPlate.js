import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import fileSchema from '../schemas/s3File.js';
import destinationSchema from '../schemas/destination.js';
import * as departmentsEnum from '../enums/departmentsEnum.js';

function isValidSpotPlateDestination(destination) {
    const {department, departmentStatus} = destination;

    if (!destination.department && !destination.departmentStatus) return false;

    const validDepartmentStatuses = departmentsEnum.departmentToDepartmentStatusesForSpotPlateRequests[department];

    if (!validDepartmentStatuses) return false;

    if (validDepartmentStatuses.length === 0) { 
        return !departmentStatus;
    };
    
    return validDepartmentStatuses.includes(departmentStatus);
}

const spotPlateSchema = new Schema({
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
        validate: [isValidSpotPlateDestination, 'A "Spot Plate Request" cannot be moved to the following destination: {VALUE}']
    }
}, { timestamps: true });

const SpotPlate = mongoose.model('SpotPlate', spotPlateSchema);

export default SpotPlate;