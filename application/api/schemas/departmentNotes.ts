import mongoose from 'mongoose';
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
import * as departmentsEnum from '../enums/departmentsEnum.ts';

const departmentNotesSchema = new Schema({
    orderPrep: {
        type: String,
        alias: departmentsEnum.ORDER_PREP_DEPARTMENT
    },
    artPrep: {
        type: String,
        alias: departmentsEnum.ART_PREP_DEPARTMENT
    },
    prePrinting: {
        type: String,
        alias: departmentsEnum.PRE_PRINTING_DEPARTMENT
    },
    printing: {
        type: String,
        alias: departmentsEnum.PRINTING_DEPARTMENT
    },
    cutting: {
        type: String,
        alias: departmentsEnum.CUTTING_DEPARTMENT
    },
    winding: {
        type: String,
        alias: departmentsEnum.WINDING_DEPARTMENT
    },
    packaging: {
        type: String,
        alias: departmentsEnum.PACKAGING_DEPARTMENT
    },
    shipping: {
        type: String,
        alias: departmentsEnum.SHIPPING_DEPARTMENT
    },
    billing: {
        type: String,
        alias: departmentsEnum.BILLING_DEPARTMENT
    }
}, {
    timestamps: true,
    strict: 'throw'
});

export default departmentNotesSchema;