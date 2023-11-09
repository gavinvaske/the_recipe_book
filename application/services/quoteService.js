/* eslint-disable complexity */
const constants = require('../enums/constantsEnum');
const DieModel = require('../../application/models/die');
const MaterialModel = require('../../application/models/material');
const BaseProductModel = require('../../application/models/baseProduct');
const FinishModel = require('../../application/models/finish');
const packagingService = require('../../application/services/packagingService');
const dieService = require('../../application/services/dieService');
const isNil = require('lodash.isNil');
const QuoteModel = require('../../application/models/quote');
const { getImageForNCirclesInSquare } = require('../enums/circlesPerSquareEnum');

const INCHES_PER_FOOT = 12;
const FEET_PER_ROLL = 5000;
const ONE_THOUSAND = 1000;
const FOUR = 4;
const MINUTES_PER_HOUR = 60;
const DEFAULT_EXTRA_FRAMES = 25;
const ROLL_CORE_DIAMETER = 3.3;

module.exports.createQuote = async (quoteInputs) => {
    const {
        isSheeted,
        products,
        dieOverride, 
        primaryMaterialOverride, 
        secondaryMaterialOverride,
        finishOverride,
        numberOfColorsOverride,
        labelsPerRollOverride,
        numberOfDesignsOverride
    } = quoteInputs;

    /* 
        Grab one productId from the list, it could be any product from the list. 
        We need one product to figure out which finish, die, ect to use on this quote.
    */
    const oneProductId = (products && products.length) ? products[0].productId : null;
    const aProduct = oneProductId ? await BaseProductModel.findById(oneProductId) : null;

    const overridableValues = {
        numberOfColors: !isNil(numberOfColorsOverride)
            ? numberOfColorsOverride : aProduct.numberOfColors,
        die: !isNil(dieOverride)
            ? dieOverride : await getDieFromProduct(aProduct),
        primaryMaterial: !isNil(primaryMaterialOverride)
            ? primaryMaterialOverride : await getPrimaryMaterialFromProduct(aProduct),
        secondaryMaterial: !isNil(secondaryMaterialOverride)
            ? secondaryMaterialOverride : await getSecondaryMaterialFromProduct(aProduct),
        finish: !isNil(finishOverride)
            ? finishOverride : await getFinishFromProduct(aProduct),
        labelsPerRoll: !isNil(labelsPerRollOverride)
            ? labelsPerRollOverride : aProduct.labelsPerRoll
    };

    const quoteAttributes = {
        ...quoteInputs,
        ...overridableValues,
        numberOfDesigns: (products && products.length) ? products.length : numberOfDesignsOverride,
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

    quoteAttributes.printingSpeed = computePrintingSpeed(quoteAttributes);
    quoteAttributes.totalFinishedRolls = computeTotalFinishedRolls(quoteAttributes);
    quoteAttributes.frameLength = computeFrameLength(overridableValues.die, quoteAttributes);
    quoteAttributes.initialStockLength = computeInitialStockLength(quoteAttributes);
    quoteAttributes.printCleanerFeet = computePrintCleanerFeet(quoteAttributes);
    quoteAttributes.dieLineSetupFeet = computeDieLineSetupFeet(quoteAttributes);
    quoteAttributes.totalStockFeet = computeTotalStockFeet(quoteAttributes);
    quoteAttributes.totalRollsOfPaper = computeTotalRollsOfPaper(quoteAttributes);
    quoteAttributes.reinsertionSetupTime = computeReinsertionSetupTime(quoteAttributes);
    quoteAttributes.totalFrames = computeTotalFrames(quoteAttributes);
    quoteAttributes.throwAwayStockPercentage = computeThrowAwayStockPercentage(quoteAttributes);
    quoteAttributes.totalStockMsi = computeTotalStockMsi(quoteAttributes);
    quoteAttributes.totalStockCost = computeTotalStockCost(quoteAttributes);
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
    quoteAttributes.ThrowAwayPrintTimePercentage = computeThrowAwayPrintTimePercentage(quoteAttributes);
    quoteAttributes.totalPrintingCost = computeTotalPrintingCost(quoteAttributes);
    quoteAttributes.totalTimeAtCutting = computeTotalTimeAtCutting(quoteAttributes);
    quoteAttributes.totalCuttingCost = computeTotalCuttingCost(quoteAttributes);
    quoteAttributes.throwAwayCuttingTimePercentage = computeThrowAwayCuttingTimePercentage(quoteAttributes);
    quoteAttributes.totalFinishCost = computeTotalFinishCost(quoteAttributes);
    quoteAttributes.changeOverTime = computeChangeOverTime(quoteAttributes);
    quoteAttributes.finishedRollLength = computeFinishedRollLength(quoteAttributes, overridableValues.die);
    quoteAttributes.totalWindingRollTime = computeTotalWindingRollTime(quoteAttributes);
    quoteAttributes.totalWindingTime = computeTotalWindingTime(quoteAttributes);
    quoteAttributes.throwAwayWindingTimePercentage = computeThrowAwayWindingTimePercentage(quoteAttributes);
    quoteAttributes.totalWindingCost = computeTotalWindingCost(quoteAttributes);
    quoteAttributes.totalCostOfMachineTime = computeTotalCostOfMachineTime(quoteAttributes);
    quoteAttributes.frameUtilization = computeFrameUtilization(quoteAttributes);
    quoteAttributes.totalNumberOfRolls = computeTotalNumberOfRolls(quoteAttributes); // TODO: Update this on Lucid
    quoteAttributes.finishedRollDiameter = computeFinishedRollDiameter(quoteAttributes);
    quoteAttributes.finishedRollDiameterWithoutCore = computeFinishedRollDiameterWithoutCore(quoteAttributes);
    quoteAttributes.packagingDetails = computePackagingDetails(quoteAttributes);
    quoteAttributes.totalClicksCost = computeTotalClicksCost(quoteAttributes);

    return new QuoteModel(quoteAttributes);
};

function computeTotalClicksCost(quoteAttributes) {
    const { 
        scalingClickCost, proofRunupClickCost, printCleanerClickCost,
        totalFrames, numberOfColors
    } = quoteAttributes;

    const totalClicksCost = scalingClickCost + proofRunupClickCost + printCleanerClickCost + (totalFrames * numberOfColors * 2);

    return totalClicksCost;
}

function computeReinsertionSetupTime(quoteAttributes) {
    const { totalRollsOfPaper } = quoteAttributes;

    return totalRollsOfPaper * constants.REINSERTION_SETUP_TIME_PER_ROLL;
}

function computeFinishedRollDiameterWithoutCore(quoteAttributes) {
    const { finishedRollDiameter } = quoteAttributes;

    return finishedRollDiameter - ROLL_CORE_DIAMETER;
}

function computeFinishedRollDiameter(quoteAttributes) {
    const { finishedRollLength } = quoteAttributes;
    const combinedMaterialThicknessInMillimeters = computeCombinedMaterialThickness(quoteAttributes);
    const term1 = ((finishedRollLength * INCHES_PER_FOOT) * (combinedMaterialThicknessInMillimeters / ONE_THOUSAND)) / 3.142; // eslint-disable-line no-magic-numbers
    const term2 = Math.pow((ROLL_CORE_DIAMETER / 2), 2);

    return Math.sqrt(term1 + term2) * 2;
}

async function getDieFromProduct(product) {
    const { die: dieId } = product;
    
    return await DieModel.findById(dieId); 
}

async function getPrimaryMaterialFromProduct(product) {
    const { primaryMaterial: primaryMaterialId } = product;

    return await MaterialModel.findById(primaryMaterialId); 
}

async function getSecondaryMaterialFromProduct(product) {
    const { secondaryMaterial: secondaryMaterialId } = product;

    return await MaterialModel.findById(secondaryMaterialId);
}

async function getFinishFromProduct(product) {
    const { finish: finishId } = product;
    
    return await FinishModel.findById(finishId);
}

function computeCombinedMaterialThickness(quoteAttributes) {
    const { primaryMaterial, secondaryMaterial, finish } = quoteAttributes;

    const primaryMaterialThickness = primaryMaterial.thickness;
    const secondaryMaterialThickness = secondaryMaterial ? secondaryMaterial.thickness : 0;
    const finishThickness = finish ? finish.thickness : 0;

    return primaryMaterialThickness + secondaryMaterialThickness + finishThickness;
}

function computeTotalNumberOfRolls(quoteAttributes) {
    const { labelQty, labelsPerRoll } = quoteAttributes;

    return Math.ceil(labelQty / labelsPerRoll);
}

function computePackagingDetails(quoteAttributes) {
    const { BOX_WIDTH_INCHES, BOX_HEIGHT_INCHES } = constants;
    const { finishedRollDiameter, totalNumberOfRolls, die } = quoteAttributes;
    const finishedRollHeight = dieService.getCoreHeightFromDie(die);

    const layersPerBox = packagingService.getNumberOfLayers(BOX_HEIGHT_INCHES, finishedRollHeight);
    const rollsPerLayer = packagingService.getRollsPerLayer(finishedRollDiameter, BOX_WIDTH_INCHES);
    const rollsPerBox = layersPerBox * rollsPerLayer;
    const totalBoxes = packagingService.getNumberOfBoxes(rollsPerBox, totalNumberOfRolls);
    const layerLayoutImagePath = getImageForNCirclesInSquare(rollsPerLayer);

    return {
        rollsPerLayer,
        layersPerBox,
        rollsPerBox,
        totalBoxes,
        layerLayoutImagePath
    };
}

function computeFrameUtilization(quoteAttributes) {
    const { frameLength } = quoteAttributes;

    return frameLength / constants.MAX_FRAME_AROUND;
}

function computeTotalCostOfMachineTime(quoteAttributes) {
    const { totalPrintingCost, totalCuttingCost, totalWindingCost } = quoteAttributes;

    return totalPrintingCost + totalCuttingCost + totalWindingCost;
}

function computeTotalWindingCost(quoteAttributes) {
    const { totalWindingTime } = quoteAttributes;

    return (totalWindingTime / MINUTES_PER_HOUR) * constants.WINDING_HOURLY_RATE;
}

function computeThrowAwayWindingTimePercentage(quoteAttributes) {
    const { totalWindingRollTime, totalWindingTime } = quoteAttributes;

    return 1 - (totalWindingRollTime / totalWindingTime);
}

function computeTotalWindingTime(quoteAttributes) {
    const { 
        coreGatheringTime, changeOverTime, 
        totalWindingRollTime, labelDropoffAtShippingTime 
    } = quoteAttributes;

    const sum = coreGatheringTime + changeOverTime 
        + totalWindingRollTime + labelDropoffAtShippingTime;

    return sum;
}

function computeFinishedRollLength(quoteAttributes, die) {
    const { labelQty, labelsPerRoll } = quoteAttributes;
    const { sizeAcross, spaceAround } = die;

    if (labelQty >= labelsPerRoll) {
        return ((sizeAcross + spaceAround) * labelsPerRoll) / INCHES_PER_FOOT;
    } else {
        return ((sizeAcross + spaceAround) * labelQty) / INCHES_PER_FOOT;
    }
}

function computeTotalWindingRollTime(quoteAttributes) {
    const { totalFinishedRolls, finishedRollLength } = quoteAttributes;

    return totalFinishedRolls * (finishedRollLength / constants.REWIND_SPEED);
}

function computeChangeOverTime(quoteAttributes) {
    const { totalFinishedRolls } = quoteAttributes;

    return totalFinishedRolls * constants.REWINDING_CHANGE_OVER_MINUTES;
}

function computeThrowAwayCuttingTimePercentage(quoteAttributes) {
    const { cuttingStockTime, totalTimeAtCutting } = quoteAttributes;

    return 1 - (cuttingStockTime / totalTimeAtCutting);
}

function computeTotalFinishCost(quoteAttributes) {
    const { totalFinishMsi, finish } = quoteAttributes;
    
    const costPerMsi = finish ? finish.costPerMsi : 0;

    return totalFinishMsi * costPerMsi;
}

function computeTotalStockCost(quoteAttributes) {
    const { primaryMaterial, secondaryMaterial, totalStockMsi } = quoteAttributes;

    const primaryMaterialCost = totalStockMsi * primaryMaterial.quotePrice;
    const secondarMaterialCost = secondaryMaterial ? (totalStockMsi * secondaryMaterial.quotePrice) : 0;

    return primaryMaterialCost + secondarMaterialCost;
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
        reinsertionSetupTime, rollChangeOverTime, printingStockTime, 
        reinsertionPrintingTime, printTearDownTime 
    } = quoteAttributes;

    const sum = stockSpliceTime + colorCalibrationTime + proofPrintingTime
        + reinsertionSetupTime + rollChangeOverTime + printingStockTime
        + reinsertionPrintingTime + printTearDownTime;

    return sum;
}

function computeThrowAwayPrintTimePercentage(quoteAttributes) {
    const { printingStockTime, totalTimeAtPrinting } = quoteAttributes;

    return 1 - (printingStockTime / totalTimeAtPrinting);
}

function computePrintingStockTime(quoteAttributes) {
    const { totalStockFeet, printingSpeed } = quoteAttributes;

    return Math.ceil(totalStockFeet * printingSpeed);
}

function computePrintingSpeed(quoteAttributes) {
    const { numberOfColors, die } = quoteAttributes;
    const { sizeAround, spaceAround } = die;

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

function computeInitialStockLength(quoteAttributes) {
    const { die, labelQty } = quoteAttributes;
    const { sizeAround, spaceAround, numberAround } = die;
    
    const initialStockLength = (((sizeAround + spaceAround) * labelQty) / numberAround) / INCHES_PER_FOOT;
    
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