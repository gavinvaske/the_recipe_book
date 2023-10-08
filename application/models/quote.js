const mongoose = require('mongoose');
mongoose.Schema.Types.String.set('trim', true);
const Schema = mongoose.Schema;
const { convertDollarsToPennies, convertPenniesToDollars } = require('../services/currencyService');
const { dieShapes } = require('../enums/dieShapesEnum');
const constants = require('../enums/constantsEnum');
const { convertMinutesToSeconds, convertSecondsToMinutes } = require('../services/dateTimeService');

function numberHasNDecimalPlacesOrLess(number, maxNumberOfDecimalPlaces) {
    const digitsInDecimalPlace = number.toString().split('.')[1];

    if (!digitsInDecimalPlace) return true;

    return digitsInDecimalPlace.length <= maxNumberOfDecimalPlaces;
}

function numberHasFourDecimalPlacesOrLess(number) {
    const maxNumberOfDecimalPlaces = 4;
    return numberHasNDecimalPlacesOrLess(number, maxNumberOfDecimalPlaces);
}

function numberHasTwoDecimalPlacesOrLess(number) {
    const maxNumberOfDecimalPlaces = 2;
    return numberHasNDecimalPlacesOrLess(number, maxNumberOfDecimalPlaces);
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

// const percentageAttribute = {}   // TODO (9-13-2023): Finish this after talking to Storm
const msiAttribute = {
    type: Number,
    min: 0
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

const DEFAULT_EXTRA_FRAMES = 25;

const quoteSchema = new Schema({
    quoteId: {
        type: String,
        required: true,
        index: true
    },

    // * Inputs * //
    profitMargin: {
        type: Number,
        min: 0,
        required: true,
        default: 30,
        max: 100
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
    sizeAcross: {
        type: Number,
        validate: {
            validator: numberHasFourDecimalPlacesOrLess,
            message: '{VALUE} has more than four decimals'
        },
        min: 0
    },
    sizeAroundOverride: {
        type: Number,
        validate: {
            validator: numberHasFourDecimalPlacesOrLess,
            message: '{VALUE} has more than four decimals'
        },
        min: 0
    },
    cornerRadius: {
        type: Number,
        validate: {
            validator: numberHasFourDecimalPlacesOrLess,
            message: '{VALUE} has more than four decimals'
        },
        min: 0,
        max: 1
    },
    shape: {
        type: String,
        enum: dieShapes
    },
    overrideSpaceAround: {
        type: Number,
        validate: {
            validator: numberHasFourDecimalPlacesOrLess,
            message: '{VALUE} has more than four decimals'
        },
        min: 0
    },
    overrideSpaceAcross: {
        type: Number,
        validate: {
            validator: numberHasFourDecimalPlacesOrLess,
            message: '{VALUE} has more than four decimals'
        },
        min: 0
    },
    material: {
        type: Schema.Types.ObjectId,
        ref: 'Material'
    },
    overrideMaterialFreightMsi: {
        type: Number,
        validate: {
            validator: numberHasFourDecimalPlacesOrLess,
            message: '{VALUE} has more than four decimals'
        },
        min: 0
    },
    overrideMaterialTotalCostMsi: {
        type: Number,
        validate: {
            validator: numberHasFourDecimalPlacesOrLess,
            message: '{VALUE} has more than four decimals'
        },
        min: 0
    },
    overrideMaterialQuotedMsi: {
        type: Number,
        validate: {
            validator: numberHasFourDecimalPlacesOrLess,
            message: '{VALUE} has more than four decimals'
        },
        min: 0
    },
    overrideMaterialThickness: {
        type: Number,
        validate: {
            validator: numberHasFourDecimalPlacesOrLess,
            message: '{VALUE} has more than four decimals'
        },
        min: 0
    },
    overrideFinish: {
        type: Schema.Types.ObjectId,
        ref: 'Finish'
    },
    overrideFinishCostMsi: {
        type: Number,
        validate: {
            validator: numberHasFourDecimalPlacesOrLess,
            message: '{VALUE} has more than four decimals'
        },
        min: 0
    },
    overrideFinishFreightMsi: {
        type: Number,
        validate: {
            validator: numberHasFourDecimalPlacesOrLess,
            message: '{VALUE} has more than four decimals'
        },
        min: 0
    },
    overrideFinishTotalCostMsi: {
        type: Number,
        validate: {
            validator: numberHasFourDecimalPlacesOrLess,
            message: '{VALUE} has more than four decimals'
        },
        min: 0
    },
    overrideFinishQuotedMsi: {
        type: Number,
        validate: {
            validator: numberHasFourDecimalPlacesOrLess,
            message: '{VALUE} has more than four decimals'
        },
        min: 0
    },
    overrideFinishThickness: {
        type: Number,
        validate: {
            validator: numberHasFourDecimalPlacesOrLess,
            message: '{VALUE} has more than four decimals'
        },
        min: 0
    },
    coreDiameter: {
        type: Number,
        validate: {
            validator: numberHasTwoDecimalPlacesOrLess,
            message: '{VALUE} has more than two decimals'
        },
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
        ...lengthInFeetAttribute,
        default: constants.COLOR_CALIBRATION_FEET
    },
    proofRunupFeet: {
        ...lengthInFeetAttribute,
        default: constants.PROOF_RUNUP_FEET
    },
    printCleanerFeet: {
        ...lengthInFeetAttribute
    },
    scalingFeet: {
        ...lengthInFeetAttribute,
        default: constants.SCALING_FEET
    },
    newMaterialSetupFeet: {
        ...lengthInFeetAttribute,
        default: constants.NEWLY_LOADED_ROLL_WASTE_FEET
    },
    dieLineSetupFeet: {
        ...lengthInFeetAttribute
    },
    totalStockFeet: {
        ...lengthInFeetAttribute
    },
    // throwAwayStockPercentage: {
    //     ...percentageAttribute
    // },
    totalStockMsi: {
        ...msiAttribute
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
    totalStockCosts: {
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
    boxCost: {
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
        ...timeDurationAttribute,
        default: constants.NEW_MATERIAL_STOCK_SPLICE
    },
    colorCalibrationTime: {
        ...timeDurationAttribute,
        default: constants.COLOR_CALIBRATION_TIME
    },
    printingProofTime: {
        ...timeDurationAttribute
    },
    reinsertionPrintingTime: {
        ...timeDurationAttribute,
        default: 0
    },
    rollChangeOverTime: {
        ...timeDurationAttribute,
    },
    printingStockTime: {
        ...timeDurationAttribute,
    },
    printTearDownTime: {
        ...timeDurationAttribute,
        default: constants.PRINTING_TEAR_DOWN_TIME
    },
    totalTimeAtPrinting: {
        ...timeDurationAttribute
    },
    throwAwayPrintTime: {
        ...timeDurationAttribute
    },
    totalPrintingCost: {
        ...costAttribute
    },
    cuttingStockSpliceCost: {
        ...costAttribute,
        default: constants.CUTTING_STOCK_SPLICE
    },
    dieSetupTime: {
        ...timeDurationAttribute,
        default: constants.DIE_SETUP
    },
    sheetedSetupTime: {
        ...timeDurationAttribute,
        default: function() {
            if (this.isSheeted) return constants.SHEETED_SETUP_TIME;
            return 0;
        }
    },
    cuttingStockTime: {
        ...timeDurationAttribute
    },
    cuttingTearDownTime: {
        ...timeDurationAttribute,
        default: constants.CUTTING_TEAR_DOWN_TIME
    },
    sheetedTearDownTime: {
        ...timeDurationAttribute,
        default: function() {
            if (this.isSheeted) return constants.SHEETED_TEAR_DOWN_TIME;
            return 0;
        }
    },
    totalTimeAtCutting: {
        ...timeDurationAttribute
    },
    totalCuttingCost: {
        ...costAttribute
    },
    // throwAwayCuttingTime: {
    //     ...timeInSecondsAttribute,
    // }
    coreGatheringTime: {
        ...timeDurationAttribute,
        default: constants.CORE_GATHERING_TIME
    },
    changeOverTime: {
        ...timeDurationAttribute
    },
    windingAllRollsTime: {
        ...timeDurationAttribute
    },
    labelDropoffAtShippingTime: {
        ...timeDurationAttribute
    },
    totalWindingTime: {
        ...timeDurationAttribute
    },
    throwAwayWindingTime: {
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
        max: constants.MAX_FRAME_LENGTH_INCHES
    },
    frameUtilization: {
        type: Number,
        min: 0,
        max: 1
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
    }
}, { timestamps: true });

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;