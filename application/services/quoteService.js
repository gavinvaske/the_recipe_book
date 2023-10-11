const constants = require('../enums/constantsEnum');
const Die = require('../../application/models/die');

const INCHES_PER_FOOT = 12;
const FEET_PER_ROLL = 5000;
// updateQuote(...)
// createQuote(...)
// (?) computeQuote(...)
module.exports.createQuote = async (quoteInputs) => {
    const { isSheeted, die : dieId } = quoteInputs;

    const die = dieId ? await Die.findById(dieId) : null;

    const quoteAttributes = {
        ...quoteInputs,
        colorCalibrationFeet: constants.COLOR_CALIBRATION_FEET,
        proofRunupFeet: constants.PROOF_RUNUP_FEET,
        scalingFeet: constants.SCALING_FEET,
        newMaterialSetupFeet: constants.NEWLY_LOADED_ROLL_WASTE_FEET,
        stockSpliceTime: constants.NEW_MATERIAL_STOCK_SPLICE,
        colorCalibrationTime: constants.COLOR_CALIBRATION_TIME,
        reinsertionPrintingTime: 0,
        printTearDownTime: constants.PRINTING_TEAR_DOWN_TIME,
        cuttingStockSpliceCost: constants.CUTTING_STOCK_SPLICE,
        dieSetupTime: constants.DIE_SETUP,
        sheetedSetupTime: isSheeted ? constants.SHEETED_SETUP_TIME : 0,
        cuttingTearDownTime: constants.CUTTING_TEAR_DOWN_TIME,
        sheetedTearDownTime: isSheeted ? constants.SHEETED_TEAR_DOWN_TIME : 0,
        coreGatheringTime: constants.CORE_GATHERING_TIME,
        labelDropoffAtShippingTime: constants.LABEL_DROP_OFF_TIME,
        packingSlipsTime: constants.PACKING_SLIP_TIME,
        dieCutterSetupFeet: constants.DIE_CUTTER_SETUP_FEET
    };

    quoteAttributes.frameLength = computeFrameLength(die, quoteAttributes);
    quoteAttributes.initialStockLength = computeInitialStockLength(die, quoteAttributes);
    quoteAttributes.printCleanerFeet = computePrintCleanerFeet(quoteAttributes);
    quoteAttributes.dieLineSetupFeet = computeDieLineSetupFeet(quoteAttributes);
    quoteAttributes.totalStockFeet = computeTotalStockFeet(quoteAttributes);
    quoteAttributes.totalRollsOfPaper = computeTotalRollsOfPaper(quoteAttributes);
    quoteAttributes.throwAwayStockPercentage = computeThrowAwayStockPercentage(quoteAttributes);

    return quoteAttributes;
};

function computeThrowAwayStockPercentage(quoteAttributes) {
    const { initialStockLength, totalStockFeet } = quoteAttributes;

    return 1 - (initialStockLength / totalStockFeet);
}

function computeTotalStockFeet(quoteAttributes) {
    const { 
        initialStockLength, colorCalibrationFeet, proofRunupFeet, dieCutterSetupFeet, 
        printCleanerFeet, scalingFeet, newMaterialSetupFeet, dieLineSetupFeet 
    } = quoteAttributes;

    const totalStockFeet = 
        initialStockLength + colorCalibrationFeet + proofRunupFeet + dieCutterSetupFeet
        + printCleanerFeet + scalingFeet + newMaterialSetupFeet + dieLineSetupFeet;
        
    return totalStockFeet;
}

function computeTotalRollsOfPaper(quoteAttributes) {
    const { totalStockFeet } = quoteAttributes;
    
    if (totalStockFeet <= FEET_PER_ROLL) return 0;

    return Math.floor(totalStockFeet / FEET_PER_ROLL) - 1;
}

function computeFrameLength(die, quoteAttributes) {
    const { sizeAroundOverride, spaceAroundOverride } = quoteAttributes;
    const sizeAround = sizeAroundOverride 
        ? sizeAroundOverride : die.sizeAround;
    const spaceAround = spaceAroundOverride
        ? spaceAroundOverride : die.spaceAround;

    return (sizeAround + spaceAround) * die.numberAround;
}

function computeInitialStockLength(die, quoteAttributes) {
    const { sizeAroundOverride, spaceAroundOverride } = quoteAttributes;
    const sizeAround = sizeAroundOverride 
        ? sizeAroundOverride : die.sizeAround;
    const spaceAround = spaceAroundOverride
        ? spaceAroundOverride : die.spaceAround;
    
    const initialStockLength = (((sizeAround + spaceAround) * quoteAttributes.labelQty) / die.numberAround) / INCHES_PER_FOOT;
    
    return initialStockLength;
}

function computePrintCleanerFeet(quoteAttributes) {
    const { 
        initialStockLength, colorCalibrationFeet, proofRunupFeet, 
        dieCutterSetupFeet, scalingFeet, newMaterialSetupFeet 
    } = quoteAttributes;
    
    const sum = initialStockLength + colorCalibrationFeet + proofRunupFeet + dieCutterSetupFeet + scalingFeet + newMaterialSetupFeet;
    
    return Math.ceil(sum / FEET_PER_ROLL) * constants.PRINT_CLEANER_FEET;
}

function computeDieLineSetupFeet(quoteAttributes) {
    const { frameLength } = quoteAttributes;

    return (frameLength * 2) / INCHES_PER_FOOT;
}