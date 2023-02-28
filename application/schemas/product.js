const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const MaterialModel = require('../models/material');
const {hotFolders, getUniqueHotFolders} = require('../enums/hotFolderEnum');
const {idToColorEnum: numberToColorEnum} = require('../enums/idToColorEnum');
const {getAllDepartments} = require('../enums/departmentsEnum');
const s3FileSchema = require('../schemas/s3File');

// For help deciphering these regex expressions, visit: https://regexr.com/
PRODUCT_DIE_REGEX = /(DR|DO|DC|DSS|XLDR|DB|DD|DRC|DCC)-(.{1,})/;
URL_VALIDATION_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

const NUMBER_OF_PENNIES_IN_A_DOLLAR = 100;
const NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY = 2;
const FRAME_REPEAT_SCALAR = 25.4;
const FEET_PER_ROLL = 5000;

function roundToNearestQuarterInch(valueInInches) {
    const numberOfQuarterInchesPerInch = 4;

    if (!valueInInches || numberOfQuarterInchesPerInch < 0) { // eslint-disable-line no-magic-numbers
        return;
    }

    const numberOfQuarterInches = valueInInches * numberOfQuarterInchesPerInch;

    const totalNumberOfQuarterInchesRoundedToNearestQuarterInch = roundValueToNearestDecimalPlace(numberOfQuarterInches, 0); // eslint-disable-line no-magic-numbers
    const totalNumberOfInches = totalNumberOfQuarterInchesRoundedToNearestQuarterInch / numberOfQuarterInchesPerInch;

    return totalNumberOfInches;
}

function isRollsFinishType(finishType) {
    return finishType && finishType.toUpperCase() === 'ROLLS';
}

function cannotBeFalsy(value) {
    if (!value) {
        return false;
    }
    return true;
}

function mustNotContainWhitespace(str) {
    const doesContainWhitespace = /\s/.test(str);

    return !doesContainWhitespace;
}

async function validateMaterialExists(materialId) {
    const searchCriteria = {
        materialId: {$regex: materialId, $options: 'i'}
    };
    
    try {
        const material = await MaterialModel.findOne(searchCriteria).exec();

        return !material ? false : true;
    } catch (error) {
        return false;
    }
}

function convertStringCurrency(numberAsString) {
    const currencyWithoutCommas = numberAsString.split(',').join('');

    return Number(currencyWithoutCommas * NUMBER_OF_PENNIES_IN_A_DOLLAR);
}

function validateProductDie(productDie) {
    const isAPressProof = productDie.toUpperCase() === 'PRESS PROOF';

    return PRODUCT_DIE_REGEX.test(productDie) || isAPressProof;
}

function numberMustBeGreaterThanZero(number) {
    return number > 0; // eslint-disable-line no-magic-numbers
}

function validateCornerRadius(cornerRadius) {
    const greaterThanOrEqualToZero = cornerRadius >= 0; // eslint-disable-line no-magic-numbers
    const lessThanOne = cornerRadius < 1;

    return greaterThanOrEqualToZero && lessThanOne;
}

function validateColor(nameOfColor) {
    return Object.values(numberToColorEnum).includes(nameOfColor);
}

const alertSchema = new Schema({
    department: {
        type: String,
        required: true,
        enum: getAllDepartments()
    },
    message: {
        type: String,
        required: false,
        default: ''
    }
}, { timestamps: true });

const productSchema = new Schema({
    proof: {
        type: s3FileSchema,
        required: false
    },
    hotFolder: {
        type: String,
        required: true,
        default: function() {
            return hotFolders[this.primaryMaterial];
        },
        enum: getUniqueHotFolders()
    },
    alerts: {
        type: [alertSchema]
    },
    productNumber: {
        type: String,
        required: true,
        uppercase: true,
        alias: 'ProductNumber',
        validate: [mustNotContainWhitespace, '"productNumber" cannot contain whitespace(s)']
    },
    productDie: {
        type: String,
        validate: [validateProductDie, '"ToolNo1" is in the wrong format'],
        required: true,
        uppercase: true,
        alias: 'ToolNo1'
    },
    primaryMaterial: {
        type: String,
        validate: [validateMaterialExists, 'Unknown material ID of "{VALUE}". Please add this material ID through the admin panel before uploading the XML'],
        required: false,
        alias: 'StockNum2'
    },
    uvFinish: {
        type: String,
        required: false,
        alias: 'InkType'
    },
    sizeAcross: {
        type: Number,
        validate: [numberMustBeGreaterThanZero, 'Size Across must be greater than 0'],
        required: true,
        alias: 'SizeAcross'
    },
    sizeAround: {
        type: Number,
        validate: [numberMustBeGreaterThanZero, 'Size Around must be greater than 0'],
        required: true,
        alias: 'SizeAround'
    },
    labelsAcross: {
        type: Number,
        validate: [numberMustBeGreaterThanZero, 'Size Around must be greater than 0'],
        required: true,
        alias: 'NoAcross'
    },
    labelsAround: {
        type: Number,
        validate: [numberMustBeGreaterThanZero, 'Size Around must be greater than 0'],
        required: true,
        alias: 'NoAround'
    },
    cornerRadius: {
        type: Number,
        required: true,
        validate: [validateCornerRadius, 'Corner Radius must be between 0 and 1'],
        alias: 'CornerRadius'
    },
    unwindDirection: {
        type: String,
        required: true,
        alias: 'FinalUnwind'
    },
    matrixAcross: {
        type: Number,
        min: 0,
        required: true,
        alias: 'ColSpace'
    },
    matrixAround: {
        type: Number,
        min: 0,
        required: true,
        alias: 'RowSpace'
    },
    description: {
        type: String,
        required: true,
        alias: 'Description'
    },
    labelQty: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message   : 'Label Quantity must be an integer'
        },
        min: 0,
        alias: 'OrderQuantity'
    },
    windingNotes: {
        type: String,
        required: false,
        alias: 'FinishNotes'
    },
    dieCuttingNotes: {
        type: String,
        required: false,
        alias: 'StockNotes'
    },
    prePrintingNotes: {
        type: String,
        required: false,
        alias: 'Notes'
    },
    printingNotes: {
        type: String,
        alias: 'Hidden_Notes'
    },
    numberOfColors: {
        type: String,
        required: true,
        validate : [
            {
                validator : validateColor,
                message   : 'Number of Colors does not map to any color'
            }
        ],
        set: function (integerRepresentingAColor) {
            return numberToColorEnum[integerRepresentingAColor];
        },
        alias: 'NoColors'
    },
    labelsPerRoll: {
        type: Number,
        validate : {
            validator : Number.isInteger,
            message   : 'Number of Colors must be an integer'
        },
        min: 0,
        required: true,
        alias: 'LabelsPer_'
    },
    finishType: {
        type: String,
        required: true,
        alias: 'FinishType'
    },
    price: {
        type: Number,
        validate: [
            {
                validator: cannotBeFalsy,
                message: 'Price cannot be 0 or blank'
            },
            {
                validator: numberMustBeGreaterThanZero,
                message: 'Price cannot be negative'
            }
        ],
        get: amountInDollars => Number((amountInDollars / NUMBER_OF_PENNIES_IN_A_DOLLAR).toFixed(NUMBER_OF_DECIMAL_PLACES_IN_CURRENCY)),
        set: convertStringCurrency,
        required: true,
        alias: 'PriceM'
    },
    priceMode: {
        type: String,
        required: false,
        alias: 'PriceMode'
    },
    productDieTwo: {
        type: String,
        validate: [validateProductDie, 'Product Die is in the wrong format'],
        uppercase: true,
        required: false,
        alias: 'ToolNo2'
    },
    toolNumberAround: {
        type: Number,
        validate : [
            {
                validator : Number.isInteger,
                message   : 'Tool Number Around must be an integer'
            }
        ],
        min: 0,
        required: true,
        alias: 'Tool_NumberAround'
    },
    plateId: {
        type: String,
        alias: 'Plate_ID'
    },
    totalWindingRolls: {
        type: Number,
        default: function() {
            return Math.ceil(this.labelQty / this.labelsPerRoll);
        }
    },
    coreHeight: {
        type: Number,
        default: function() {
            if (!isRollsFinishType(this.finishType)) {
                return;
            }

            return roundToNearestQuarterInch(this.labelsAcross);
        },
        required: function() {
            return isRollsFinishType(this.finishType);
        }
    },
    labelRepeat: {
        type: Number,
        required: true,
        alias: 'LabelRepeat'
    },
    overRun: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
        set: function (overRun) {
            const decimalPositionToRound = 2;
            const overRunBeforeRounding = overRun / 100; // eslint-disable-line no-magic-numbers
            return roundValueToNearestDecimalPlace(overRunBeforeRounding, decimalPositionToRound);
        },
        required: false,
        alias: 'OverRun'
    },
    varnish: {
        type: String,
        required: false,
        set: function(varnish) {
            const stringToRemove = 'C:';
            return varnish && varnish.replace(stringToRemove, '');
        },
        alias: 'ColorDescr'
    },
    coreDiameter: {
        type: Number,
        required: true,
        set: function(coreDiameter) {
            const decimalPositionToRound = 4;

            return roundValueToNearestDecimalPlace(coreDiameter, decimalPositionToRound);
        },
        alias: 'CoreDiameter'
    },
    numberAcross: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message   : '"NoLabAcrossFin" (aka "Number Across") must be an integer'
        },
        alias: 'NoLabAcrossFin'
    },
    shippingAttention: {
        type: String,
        required: false,
        alias: 'ShipAttn'
    },
    dieCuttingMarriedMaterial: {
        type: String,
        required: false,
        alias: 'StockNum3'
    },
    dieCuttingFinish: {
        type: String,
        required: false,
        alias: 'StockNum'
    },
    toolingNotes: {
        type: String,
        required: false,
        alias: 'ToolingNotes'
    },
    frameCount: {
        type: Number,
        required: true,
        min: 0,
        set: function(frameCount) {
            return Math.ceil(frameCount);
        },
        alias: 'MachineCount'
    },
    labelsPerFrame: {
        type: Number,
        min: 1,
        required: true,
        default: function() {
            return Math.floor(this.labelsAround * this.labelsAcross);
        }
    },
    measureAcross: {
        type: Number,
        required: true,
        default: function() {
            const decimalPositionToRound = 4;
            const measureAcrossBeforeRounding = this.labelsAcross + this.matrixAcross;
            return roundValueToNearestDecimalPlace(measureAcrossBeforeRounding, decimalPositionToRound);
        }
    },
    measureAround: {
        type: Number,
        required: true,
        default: function() {
            const decimalPositionToRound = 4;
            const measureAroundBeforeRounding = this.labelsAround + this.matrixAround;
            return roundValueToNearestDecimalPlace(measureAroundBeforeRounding, decimalPositionToRound);
        }
    },
    framesPlusOverRun: {
        type: Number,
        required: true,
        default: function() {
            return Math.ceil((this.frameCount * this.overRun) + this.frameCount);
        }
    },
    topBottomBleed: {
        type: Number,
        required: true,
        default: function() {
            const decimalPositionToRound = 4;
            const topBottomBleedBeforeRound = this.matrixAcross / 2; // eslint-disable-line no-magic-numbers
            return roundValueToNearestDecimalPlace(topBottomBleedBeforeRound, decimalPositionToRound);
        }
    },
    leftRightBleed: {
        type: Number,
        required: true,
        default: function() {
            const decimalPositionToRound = 4;
            const leftRightBleedBeforeRound = this.matrixAround / 2; // eslint-disable-line no-magic-numbers
            return roundValueToNearestDecimalPlace(leftRightBleedBeforeRound, decimalPositionToRound);
        }
    },
    frameRepeat: {
        type: Number,
        required: true,
        default: function() {
            const frameRepeatBeforeRounding = this.labelsAround * this.labelRepeat * FRAME_REPEAT_SCALAR;
            const frameRepeatRoundedUpToSecondDecimalPlace = (Math.ceil(frameRepeatBeforeRounding * 100) / 100); // eslint-disable-line no-magic-numbers
            return frameRepeatRoundedUpToSecondDecimalPlace;
        }
    },
    extraFrames: {
        type: Number,
        required: true,
        default: function() {
            const defaultNumberOfExtraFrames = 25;
            const extraFramesForUvVarnish = 50;
            const extraFramesForSheetedFinishType = 100;
            let extraFrames = defaultNumberOfExtraFrames;

            if (this.varnish && this.varnish.toLowerCase().includes('anything uv')) {
                extraFrames += extraFramesForUvVarnish;
            }
            if (this.finishType && this.finishType.toLowerCase().includes('sheeted')) {
                extraFrames += extraFramesForSheetedFinishType;
            }

            return extraFrames;
        }
    },
    totalFrames: {
        type: Number,
        required: true,
        default: function() {
            return this.framesPlusOverRun + this.extraFrames;
        }
    },
    totalFeet: {
        type: Number,
        required: true,
        default: function() {
            const inchesPerFoot = 12;
            const totalFeetBeforeRounding = (this.measureAround * this.labelsAround * this.totalFrames) / inchesPerFoot;
            return Math.ceil(totalFeetBeforeRounding);
        }
    },
    numberOfRolls: {
        type: Number,
        required: true,
        default: function() {
            const decimalPositionToRound = 2;
            const numberOfRollsBeforeRounding = this.totalFeet / FEET_PER_ROLL;
            return roundValueToNearestDecimalPlace(numberOfRollsBeforeRounding, decimalPositionToRound);
        }
    },
    rotoRepeat: {
        type: Number,
        required: true,
        default: function() {
            const decimalPositionToRound = 3;
            const rotoRepeatBeforeRounding = this.labelRepeat * this.toolNumberAround;
            return roundValueToNearestDecimalPlace(rotoRepeatBeforeRounding, decimalPositionToRound);
        }
    },
    deltaRepeat: {
        type: Number,
        required: true,
        default: function(){
            return this.labelRepeat;
        }
    },
    numberOfCores: {
        type: Number,
        default: function() {
            return Math.ceil(this.labelQty / this.labelsPerRoll);
        }
    }
}, { timestamps: true });


function roundValueToNearestDecimalPlace(unRoundedValue, decimalPositionToRound) {
    const precision = Math.pow(10, decimalPositionToRound); // eslint-disable-line no-magic-numbers

    return Math.round(unRoundedValue * precision) / precision;
}

module.exports = productSchema;
