import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import { s3FileSchema } from '../schemas/s3File.ts';
import { destinationSchema } from '../schemas/destination.ts';
import * as departmentsEnum from '../enums/departmentsEnum.ts';

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
        type: [s3FileSchema],
        required: false
    },
    destination: {
        type: destinationSchema,
        required: false,
        validate: [isValidSpotPlateDestination, 'A "Spot Plate Request" cannot be moved to the following destination: {VALUE}']
    }
}, { timestamps: true });

export const SpotPlateModel = mongoose.model('SpotPlate', spotPlateSchema);
