const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const { convertDollarsToPennies, convertPenniesToDollars } = require('../services/currencyService');
const { dieShapes } = require('../enums/dieShapesEnum');
const constants = require('../enums/constantsEnum');
const { convertMinutesToSeconds, convertSecondsToMinutes } = require('../services/dateTimeService');
const Decimal = require('decimal.js');
const MaterialModel = require('../models/material');
const FinishModel = require('../models/finish');

// MaterialModel.schema.path('cost')
// console.log('material 69: ', MaterialModel.schema.path('name'));
console.log('material 72: ', MaterialModel.schema.paths['name']);

const FOUR_DECIMAL_PLACES = 4;
const TWO_DECIMAL_PLACES = 2;

function roundNumberToNthDecimalPlace(nthDecimalPlaces) {
    return function (number) {
        const moreAccurateNumber = new Decimal(number);

        return moreAccurateNumber.toFixed(nthDecimalPlaces);
    };
}

const lengthInFeetAttribute = {
    type: Number,
    min: 0
};

const timeDurationAttribute = {
    type: Number,
    set: convertMinutesToSeconds,
    get: convertSecondsToMinutes,
    min: 0,
    validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer'
    }
};

const numberOfFramesAttribute = {
    type: Number,
    min: 0
};

const numberOfRollsAttribute = {
    type: Number,
    min: 0,
    validate : {
        validator : Number.isInteger,
        message: '{VALUE} is not an integer'
    },
};

const costAttribute = {
    type: Number,
    min: 0,
    set: convertDollarsToPennies,
    get: convertPenniesToDollars,
    validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer'
    }
};

const msiAttribute = {
    type: Number,
    min: 0
};

const percentageAttribute = {
    type: Number,
    min: 0,
    max: 1,
    set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
};

const productWithQtySchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'BaseProduct',
        required: true
    },
    labelQty: {
        type: Number,
        min: 0,
        required: true,
        validate : {
            validator : Number.isInteger,
            message: '{VALUE} is not an integer'
        }
    }
});

const materialOverrideSchema = new Schema({
    name: MaterialModel.schema.obj['name'],
    thickness: MaterialModel.schema.obj['thickness'],
    costPerMsi: MaterialModel.schema.obj['costPerMsi'],
    freightCostPerMsi: MaterialModel.schema.obj['freightCostPerMsi'],
    quotePricePerMsi: MaterialModel.schema.obj['quotePricePerMsi'],
    facesheetWeightPerMsi: MaterialModel.schema.obj['facesheetWeightPerMsi'],
    adhesiveWeightPerMsi: MaterialModel.schema.obj['adhesiveWeightPerMsi'],
    linerWeightPerMsi: MaterialModel.schema.obj['linerWeightPerMsi'],
}, { strict: 'throw' });

const finishOverrideSchema = new Schema({
    name: FinishModel.schema.obj['name'],
    thickness: FinishModel.schema.obj['thickness'],
    costPerMsi: FinishModel.schema.obj['costPerMsi'],
    freightCostPerMsi: FinishModel.schema.obj['freightCostPerMsi'],
    quotePricePerMsi: FinishModel.schema.obj['quotePricePerMsi'],
}, { strict: 'throw' });

const DEFAULT_EXTRA_FRAMES = 25;

const quoteSchema = new Schema({
    quoteId: {
        type: String,
        required: true,
        index: true
    },

    // * Inputs * //
    profitMargin: {
        ...percentageAttribute,
        required: true,
    },
    labelsPerRoll: {
        type: Number,
        min: 1,
        max: 1000000,
        required: true,
        default: 1000,
        validate : {
            validator : Number.isInteger,
            message: '{VALUE} is not an integer'
        }
    },
    numberOfDesigns: {
        type: Number,
        min: 1,
        max: 1000,
        default: 1,
        required: true,
        validate : {
            validator : Number.isInteger,
            message: '{VALUE} is not an integer'
        }
    },
    reinsertion: {
        type: Boolean,
        default: false
    },
    variableData: {
        type: Boolean,
        default: false
    },
    isSheeted: {
        type: Boolean,
        default: false
    },
    labelQty: {
        type: Number,
        min: 0
    },
    die: {
        type: Schema.Types.ObjectId,
        ref: 'Die'
    },
    sizeAcrossOverride: {
        type: Number,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES),
        min: 0
    },
    sizeAroundOverride: {
        type: Number,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES),
        min: 0
    },
    cornerRadius: {
        type: Number,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES),
        min: 0,
        max: 1
    },
    shape: {
        type: String,
        enum: dieShapes
    },
    spaceAroundOverride: {
        type: Number,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES),
        min: 0
    },
    overrideSpaceAcross: {
        type: Number,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES),
        min: 0
    },
    primaryMaterialOverride: {
        type: materialOverrideSchema
    },
    secondaryMaterialOverride: {
        type: materialOverrideSchema
    },
    finishOverride: {
        type: finishOverrideSchema
    },
    coreDiameter: {
        type: Number,
        set: roundNumberToNthDecimalPlace(TWO_DECIMAL_PLACES),
        min: 0,
        default: 3
    },
    numberOfColors: {
        type: Number,
        min: 1,
        max: 12,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer'
        }
    },

    // * Outputs * //
    productQty: { // TODO (10-2-2023): Where does this come from?
        type: Number,
        min: 0,
        required: true
    },
    initialStockLength: {
        ...lengthInFeetAttribute
    },
    colorCalibrationFeet: {
        ...lengthInFeetAttribute
    },
    proofRunupFeet: {
        ...lengthInFeetAttribute
    },
    printCleanerFeet: {
        ...lengthInFeetAttribute
    },
    scalingFeet: {
        ...lengthInFeetAttribute
    },
    newMaterialSetupFeet: {
        ...lengthInFeetAttribute
    },
    dieLineSetupFeet: {
        ...lengthInFeetAttribute,
    },
    dieCutterSetupFeet: {
        ...lengthInFeetAttribute
    },
    totalStockFeet: {
        ...lengthInFeetAttribute
    },
    throwAwayStockPercentage: {
        ...percentageAttribute,
    },
    totalStockMsi: {
        ...msiAttribute,
    },
    totalRollsOfPaper: {
        ...numberOfRollsAttribute
    },
    extraFrames: {
        ...numberOfFramesAttribute,
        default: DEFAULT_EXTRA_FRAMES
    },
    totalFrames: {
        ...numberOfFramesAttribute
    },
    totalStockCost: {
        ...costAttribute
    },
    totalFinishFeet: {
        ...lengthInFeetAttribute
    },
    totalFinishMsi: {
        ...msiAttribute
    },
    totalFinishCost: {
        ...costAttribute
    },
    totalCoreCost: {
        ...costAttribute
    },
    totalBoxCost: {
        ...costAttribute
    },
    inlinePrimingCost: {
        ...costAttribute
    },
    scalingClickCost: {
        ...costAttribute
    },
    proofRunupClickCost: {
        ...costAttribute
    },
    printCleanerClickCost: {
        ...costAttribute
    },
    totalMaterialsCost: {
        ...costAttribute
    },
    stockSpliceTime: {
        ...timeDurationAttribute
    },
    colorCalibrationTime: {
        ...timeDurationAttribute
    },
    proofPrintingTime: {
        ...timeDurationAttribute
    },
    reinsertionPrintingTime: {
        ...timeDurationAttribute
    },
    rollChangeOverTime: {
        ...timeDurationAttribute,
    },
    printingStockTime: {
        ...timeDurationAttribute,
    },
    printTearDownTime: {
        ...timeDurationAttribute
    },
    totalTimeAtPrinting: {
        ...timeDurationAttribute
    },
    throwAwayPrintTimePercentage: {
        ...percentageAttribute
    },
    totalPrintingCost: {
        ...costAttribute
    },
    cuttingStockSpliceTime: {
        ...timeDurationAttribute
    },
    dieSetupTime: {
        ...timeDurationAttribute
    },
    sheetedSetupTime: {
        ...timeDurationAttribute
    },
    cuttingStockTime: {
        ...timeDurationAttribute
    },
    cuttingTearDownTime: {
        ...timeDurationAttribute
    },
    sheetedTearDownTime: {
        ...timeDurationAttribute
    },
    totalTimeAtCutting: {
        ...timeDurationAttribute
    },
    totalCuttingCost: {
        ...costAttribute
    },
    throwAwayCuttingTimePercentage: {
        ...percentageAttribute,
    },
    coreGatheringTime: {
        ...timeDurationAttribute
    },
    changeOverTime: {
        ...timeDurationAttribute
    },
    totalWindingRollTime: {
        ...timeDurationAttribute
    },
    labelDropoffAtShippingTime: {
        ...timeDurationAttribute
    },
    totalWindingTime: {
        ...timeDurationAttribute
    },
    throwAwayWindingTimePercentage: {
        ...timeDurationAttribute
    },
    totalFinishedRolls: {
        ...numberOfRollsAttribute
    },
    totalWindingCost: {
        ...costAttribute
    },
    totalCostOfMachineTime: {
        ...costAttribute
    },
    boxCreationTime: {
        ...timeDurationAttribute
    },
    packagingBoxTime: {
        ...timeDurationAttribute
    },
    packingSlipsTime: {
        ...timeDurationAttribute
    },
    totalShippingTime: {
        ...timeDurationAttribute
    },
    totalShippingCost: {
        ...costAttribute
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },

    // Job Variables //
    frameLength: {
        type: Number,
        min: 0,
        max: constants.MAX_FRAME_LENGTH_INCHES,
        required: false
    },
    frameUtilization: {
        ...percentageAttribute,
    },
    finishedRollLength: {
        type: Number,
        min: 0
    },
    // finishedRollDiameter: {  // TODO (10-2-2023): Storm marked this as TBD on lucid, revist it later
    //     type: Number
    // },
    printingSpeed: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer'
        }
    },
    products: {
        type: [productWithQtySchema]
    },
    totalNumberOfRolls: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer'
        }
    },
    totalBoxes: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer'
        }
    },
}, { 
    timestamps: true,
    strict: 'throw'
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;