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

function roundPercentage(percentage) {
    const numberOfDecimalPlaces = 4;
    return Number(percentage.toFixed(numberOfDecimalPlaces));
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
    set: roundPercentage
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
    spaceAroundOverride: {
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
        // default: function() {
        //     if (!this.frameLength) return;

        //     return (this.frameLength * 2) / INCHES_PER_FOOT;
        // }
    },
    dieCutterSetupFeet: {
        ...lengthInFeetAttribute
    },
    totalStockFeet: {
        ...lengthInFeetAttribute
    },
    throwAwayStockPercentage: {
        ...percentageAttribute,
        // default: function() {
        //     if (!this.initialStockLength || !this.totalStockFeet) return;

        //     return 1 - (this.initialStockLength / this.totalStockFeet);
        // }
    },
    totalStockMsi: {
        ...msiAttribute,
        // default: function() {
        //     if (!this.totalStockFeet) return;

        //     return (this.totalStockFeet * constants.MAX_MATERIAL_SIZE_ACROSS) * (INCHES_PER_FOOT / 1000); // eslint-disable-line no-magic-numbers
        // }
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
        ...timeDurationAttribute
    },
    colorCalibrationTime: {
        ...timeDurationAttribute
    },
    printingProofTime: {
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
    throwAwayPrintTime: {
        ...timeDurationAttribute
    },
    totalPrintingCost: {
        ...costAttribute
    },
    cuttingStockSpliceCost: {
        ...costAttribute
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
    // throwAwayCuttingTime: {
    //     ...timeInSecondsAttribute,
    // }
    coreGatheringTime: {
        ...timeDurationAttribute
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
        max: constants.MAX_FRAME_LENGTH_INCHES,
        required: false
    },
    frameUtilization: {
        ...percentageAttribute,
        // default: function() {
        //     if (!this.frameLength) return;
        //     return this.frameLength / constants.MAX_FRAME_LENGTH_INCHES;
        // }
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
}, { 
    timestamps: true,
    strict: 'throw' // TODO: Test this line.
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;