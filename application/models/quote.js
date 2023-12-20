const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const { convertDollarsToPennies, convertPenniesToDollars } = require('../services/currencyService');
const constants = require('../enums/constantsEnum');
const { convertMinutesToSeconds, convertSecondsToMinutes } = require('../services/dateTimeService');
const Decimal = require('decimal.js');
const PackagingDetailsSchema = require('../schemas/packagingDetails');

const DEFAULT_EXTRA_FRAMES = 25;
const FIVE_DECIMAL_PLACES = 5;
const FOUR_DECIMAL_PLACES = 4;
const THREE_DECIMAL_PLACES = 3;
const TWO_DECIMAL_PLACES = 2;

const STARTING_QUOTE_NUMBER = 60000;

function roundNumberToNthDecimalPlace(nthDecimalPlaces) {
    return function (number) {
        const moreAccurateNumber = new Decimal(number);

        return moreAccurateNumber.toFixed(nthDecimalPlaces);
    };
}

const lengthInFeetAttribute = {
    type: Number,
    min: 0,
    set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
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
    min: 0,
    set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
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
    quotePricePerMsi: {
        type: Number,
        required: true,
        min: 0,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
    },
    thickness: {
        type: Number,
        required: true,
        min: 0
    },
    costPerMsi: {
        type: Number,
        required: true,
        min: 0,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
    },
}, { strict: 'throw' });

const finishOverrideSchema = new Schema({
    quotePricePerMsi: {
        type: Number,
        required: true,
        min: 0,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
    },
    thickness: {
        type: Number,
        required: true,
        min: 0
    },
    costPerMsi: {
        type: Number,
        required: true,
        min: 0,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
    },
}, { strict: 'throw' });

const dieOverrideSchema = new Schema({
    sizeAcross: {
        type: Number,
        required: true,
        min: 0
    },
    sizeAround: {
        type: Number,
        required: true,
        min: 0
    },
    spaceAround: { // also known as "Row Space"
        type: Number,
        required: true,
        min: 0
    },
    numberAcross: {
        type: Number,
        required: true,
        min: 0
    },
}, { strict: 'throw' });

const quoteSchema = new Schema({
    // * Inputs * //
    quoteNumber: {
        type: Number,
        required: true,
        index: true,
        min: STARTING_QUOTE_NUMBER
    },
    profitMargin: {
        ...percentageAttribute,
        required: true,
    },
    labelsPerRollOverride: {
        type: Number,
        min: 1,
        max: 1000000,
        validate : {
            validator : Number.isInteger,
            message: '{VALUE} is not an integer'
        }
    },
    numberOfDesignsOverride: {
        type: Number,
        min: 1,
        max: 1000,
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
    dieOverride: {
        type: dieOverrideSchema
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
    coreDiameterOverride: {
        type: Number,
        set: roundNumberToNthDecimalPlace(TWO_DECIMAL_PLACES),
        min: 0,
        default: 3.25
    },
    numberOfColorsOverride: {
        type: Number,
        min: 1,
        max: 12,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer'
        }
    },

    // * Outputs * //
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
        ...percentageAttribute
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
        min: 0,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
    },
    finishedRollDiameter: {
        type: Number,
        set: roundNumberToNthDecimalPlace(THREE_DECIMAL_PLACES)
    },
    finishedRollDiameterWithoutCore: {
        type: Number,
        set: roundNumberToNthDecimalPlace(THREE_DECIMAL_PLACES)
    },
    printingSpeed: {
        type: Number,
        min: 0,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
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
    packagingDetails: {
        type: PackagingDetailsSchema,
        required: false
    },
    totalClicksCost: {
        type: Number,
        min: 0
    },
    reinsertionSetupTime: {
        ...timeDurationAttribute
    },
    totalCores: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer'
        }
    },
    cuttingDiameter: {
        type: Number,
        min: 0,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
    },
    combinedMaterialThickness: {
        type: Number,
        min: 0,
        set: roundNumberToNthDecimalPlace(FOUR_DECIMAL_PLACES)
    },
    totalMachineCost: {
        ...costAttribute
    },
    totalProductionCost: {
        ...costAttribute
    },
    quotedPrice: {
        ...costAttribute
    },
    pricePerThousand: {
        ...costAttribute
    },
    profit: {
        ...costAttribute
    },
    pricePerLabel: {
        type: Number,
        set: roundNumberToNthDecimalPlace(FIVE_DECIMAL_PLACES),
        min: 0
    },
}, {
    timestamps: true,
    strict: 'throw'
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;