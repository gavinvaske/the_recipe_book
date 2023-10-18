const constants = require('../enums/constantsEnum');
const DieModel = require('../../application/models/die');
const MaterialModel = require('../../application/models/material');
const FinishModel = require('../../application/models/finish');

const INCHES_PER_FOOT = 12;
const FEET_PER_ROLL = 5000;
const ONE_THOUSAND = 1000;
const FOUR = 4;

const MINUTES_PER_HOUR = 60;

const DEFAULT_EXTRA_FRAMES = 25;
// updateQuote(...)
// createQuote(...)
// (?) computeQuote(...)
module.exports.createQuote = async (quoteInputs) => {
    const { 
        isSheeted, 
        die : dieId, 
        material : materialId, 
        finish: finishId 
    } = quoteInputs;

    const die = dieId ? await DieModel.findById(dieId) : null;
    const material = materialId ? await MaterialModel.findById(materialId) : null;
    const finish = finishId ? await FinishModel.findById(finishId) : null;

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
        cuttingStockSpliceTime: constants.CUTTING_STOCK_SPLICE_TIME,
        dieSetupTime: constants.DIE_SETUP,
        sheetedSetupTime: isSheeted ? constants.SHEETED_SETUP_TIME : 0,
        cuttingTearDownTime: constants.CUTTING_TEAR_DOWN_TIME,
        sheetedTearDownTime: isSheeted ? constants.SHEETED_TEAR_DOWN_TIME : 0,
        coreGatheringTime: constants.CORE_GATHERING_TIME,
        labelDropoffAtShippingTime: constants.LABEL_DROP_OFF_TIME,
        packingSlipsTime: constants.PACKING_SLIP_TIME,
        dieCutterSetupFeet: constants.DIE_CUTTER_SETUP_FEET,
        extraFrames: DEFAULT_EXTRA_FRAMES,
        cuttingStockTime: 0 // TODO: Storm is working on this algorithm. Until he's done, I'm defaulting this to 0. Fix this once he's
    };

    quoteAttributes.printingSpeed = computePrintingSpeed(die, quoteAttributes);
    quoteAttributes.totalFinishedRolls = computeTotalFinishedRolls(quoteAttributes);
    quoteAttributes.frameLength = computeFrameLength(die, quoteAttributes);
    quoteAttributes.initialStockLength = computeInitialStockLength(die, quoteAttributes);
    quoteAttributes.printCleanerFeet = computePrintCleanerFeet(quoteAttributes);
    quoteAttributes.dieLineSetupFeet = computeDieLineSetupFeet(quoteAttributes);
    quoteAttributes.totalStockFeet = computeTotalStockFeet(quoteAttributes);
    quoteAttributes.totalRollsOfPaper = computeTotalRollsOfPaper(quoteAttributes);
    quoteAttributes.totalFrames = computeTotalFrames(quoteAttributes);
    quoteAttributes.throwAwayStockPercentage = computeThrowAwayStockPercentage(quoteAttributes);
    quoteAttributes.totalStockMsi = computeTotalStockMsi(quoteAttributes);
    quoteAttributes.totalStockCost = computeTotalStockCost(quoteAttributes, material);
    quoteAttributes.totalFinishFeet = computeTotalFinishFeet(quoteAttributes);
    quoteAttributes.totalFinishMsi = computeTotalFinishMsi(quoteAttributes);
    quoteAttributes.totalCoreCost = computeTotalCoreCost(quoteAttributes);
    quoteAttributes.inlinePrimingCost = computeInlinePrimingCost(quoteAttributes);
    quoteAttributes.scalingClickCost = computeScalingClickCost(quoteAttributes);
    quoteAttributes.proofRunupClickCost = computeProofRunupClickCost(quoteAttributes);
    quoteAttributes.printCleanerClickCost = computePrintCleanerClickCost(quoteAttributes);
    quoteAttributes.proofPrintingTime = computeProofPrintingTime(quoteAttributes);
    quoteAttributes.rollChangeOverTime = computeRollChangeOverTime(quoteAttributes);
    quoteAttributes.printingStockTime = computePrintingStockTime(quoteAttributes);
    quoteAttributes.totalTimeAtPrinting = computeTotalTimeAtPrinting(quoteAttributes);
    quoteAttributes.throwAwayStockTimePercentage = computeThrowAwayStockTimePercentage(quoteAttributes);
    quoteAttributes.totalPrintingCost = computeTotalPrintingCost(quoteAttributes);
    quoteAttributes.totalTimeAtCutting = computeTotalTimeAtCutting(quoteAttributes);
    quoteAttributes.totalCuttingCost = computeTotalCuttingCost(quoteAttributes);
    quoteAttributes.totalFinishCost = computeTotalFinishCost(quoteAttributes, finish);

    return quoteAttributes;
};

function computeTotalFinishCost(quoteAttributes, finish) {
    const { totalFinishMsi, overrideFinishCostMsi } = quoteAttributes;

    const costPerMsi = overrideFinishCostMsi 
        ? overrideFinishCostMsi : finish.quotePrice;

    return totalFinishMsi * costPerMsi;
}

function computeTotalStockCost(quoteAttributes, material) {
    const { overrideMaterialQuotedMsi, totalStockMsi} = quoteAttributes;

    const materialQuotedMsi = overrideMaterialQuotedMsi 
        ? overrideMaterialQuotedMsi : material.quotePrice;

    return totalStockMsi * materialQuotedMsi;
}

function computeTotalFrames(quoteAttributes) {
    const { totalStockFeet, frameLength } = quoteAttributes;

    return Math.ceil((totalStockFeet / frameLength) * INCHES_PER_FOOT);
}

function computeTotalCuttingCost(quoteAttributes) {
    const { totalTimeAtCutting } = quoteAttributes;

    return (totalTimeAtCutting / MINUTES_PER_HOUR) * constants.CUTTING_HOURLY_RATE;
}

function computeTotalTimeAtCutting(quoteAttributes) {
    const { 
        cuttingStockSpliceTime, dieSetupTime, sheetedSetupTime, 
        cuttingStockTime, cuttingTearDownTime, sheetedTearDownTime 
    } = quoteAttributes;

    const sum = 
        cuttingStockSpliceTime + dieSetupTime + sheetedSetupTime 
        + cuttingStockTime + cuttingTearDownTime + sheetedTearDownTime;

    return sum;
}

function computeTotalPrintingCost(quoteAttributes) {
    const { totalTimeAtPrinting } = quoteAttributes;

    return (totalTimeAtPrinting / MINUTES_PER_HOUR) * constants.PRINTING_HOURLY_RATE;
}

function computeTotalTimeAtPrinting(quoteAttributes) {
    const { 
        stockSpliceTime, colorCalibrationTime, proofPrintingTime, 
        reinsertionPrintingTime, printTearDownTime 
    } = quoteAttributes;

    const sum = stockSpliceTime + colorCalibrationTime + proofPrintingTime 
        + reinsertionPrintingTime + printTearDownTime;

    return sum;
}

function computeThrowAwayStockTimePercentage(quoteAttributes) {
    const { printingStockTime, totalTimeAtPrinting } = quoteAttributes;

    return 1 - (printingStockTime / totalTimeAtPrinting);
}

function computePrintingStockTime(quoteAttributes) {
    const { totalStockFeet, printingSpeed } = quoteAttributes;

    return Math.ceil(totalStockFeet * printingSpeed);
}

function computePrintingSpeed(die, quoteAttributes) {
    const { numberOfColors, sizeAroundOverride, spaceAroundOverride } = quoteAttributes;
    const sizeAround = sizeAroundOverride 
        ? sizeAroundOverride : die.sizeAround;
    const spaceAround = spaceAroundOverride
        ? spaceAroundOverride : die.spaceAround;

    const unroundedPrintingSpeed = 60 / ((numberOfColors * 0.49) * (12 / (sizeAround + spaceAround))); // eslint-disable-line no-magic-numbers

    return Math.round(unroundedPrintingSpeed);
}

function computeRollChangeOverTime(quoteAttributes) {
    const { totalRollsOfPaper } = quoteAttributes;

    return totalRollsOfPaper * constants.PRINTING_ROLL_CHANGE_OVER_TIME;
}

function computeProofPrintingTime(quoteAttributes) {
    const { numberOfDesigns } = quoteAttributes;

    return numberOfDesigns * constants.PRINTING_PROOF_TIME;
}


function computePrintCleanerClickCost(quoteAttributes) {
    const { totalStockFeet } = quoteAttributes;
    const { PRINT_CLEANER_FRAME, COST_PER_COLOR } = constants;
    let scalar = 1;

    if (totalStockFeet >= FEET_PER_ROLL) {
        scalar = Math.floor(totalStockFeet / FEET_PER_ROLL);
    }

    return scalar * (PRINT_CLEANER_FRAME * COST_PER_COLOR * FOUR);
}

function computeProofRunupClickCost(quoteAttributes) {
    const { numberOfColors, numberOfDesigns } = quoteAttributes;

    return constants.COST_PER_COLOR * numberOfColors * 2 * numberOfDesigns;
}

function computeTotalFinishedRolls(quoteAttributes) {
    const { labelQty, labelsPerRoll } = quoteAttributes;

    const numberOfFinishedRolls = labelQty / labelsPerRoll;

    return Math.ceil(numberOfFinishedRolls);
}

function computeScalingClickCost(quoteAttributes) {
    const { numberOfColors } = quoteAttributes;
    const { SCALING_CLICKS, COST_PER_COLOR } = constants;

    return SCALING_CLICKS * numberOfColors * 2 * COST_PER_COLOR;
}

function computeInlinePrimingCost(quoteAttributes) {
    const { totalStockMsi } = quoteAttributes;

    return totalStockMsi * constants.INLINE_PRIMING_COST;
}

function computeTotalCoreCost(quoteAttributes) {
    const { totalFinishedRolls } = quoteAttributes;

    return totalFinishedRolls * constants.PER_CORE_COST;
}

function computeTotalFinishMsi(quoteAttributes) {
    const { totalFinishFeet } = quoteAttributes;

    return (totalFinishFeet * constants.MAX_MATERIAL_SIZE_ACROSS * INCHES_PER_FOOT) / ONE_THOUSAND;
}

function computeTotalFinishFeet(quoteAttributes) {
    const { dieCutterSetupFeet, printCleanerFeet, dieLineSetupFeet } = quoteAttributes;
    
    const sum = dieCutterSetupFeet + printCleanerFeet + dieLineSetupFeet;

    return sum;
}

function computeTotalStockMsi(quoteAttributes) {
    const { totalStockFeet } = quoteAttributes;

    return (totalStockFeet * constants.MAX_MATERIAL_SIZE_ACROSS * INCHES_PER_FOOT) / ONE_THOUSAND;
}

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