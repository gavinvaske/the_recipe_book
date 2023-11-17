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
const Decimal = require('decimal.js');

const INCHES_PER_FOOT = 12;
const FEET_PER_ROLL = 5000;
const ONE_THOUSAND = 1000;
const FOUR = 4;
const MINUTES_PER_HOUR = 60;
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
        numberOfDesigns: numberOfDesignsOverride ? numberOfDesignsOverride : products.length,
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
        cuttingStockTime: 0
    };

    // TODO (11-14-2023): maybe quote = new QuoteModel(quoteAttributes); here before executing formulas below so stuff is rounded before executing formulas?
    quoteAttributes.extraFrames = computeExtraFrames(quoteAttributes);
    quoteAttributes.colorCalibrationFeet = computeColorCalibrationFeet(quoteAttributes);
    quoteAttributes.totalFinishedRolls = computeTotalFinishedRolls(quoteAttributes);
    quoteAttributes.frameLength = computeFrameLength(quoteAttributes);
    quoteAttributes.printingSpeed = computePrintingSpeed(quoteAttributes);
    quoteAttributes.dieCutterSetupFeet = computeDieCutterSetupFeet(quoteAttributes);
    quoteAttributes.initialStockLength = computeInitialStockLength(quoteAttributes);
    quoteAttributes.printCleanerFeet = computePrintCleanerFeet(quoteAttributes);
    quoteAttributes.dieLineSetupFeet = computeDieLineSetupFeet(quoteAttributes);
    quoteAttributes.totalStockFeet = computeTotalStockFeet(quoteAttributes); // TODO
    quoteAttributes.combinedMaterialThickness = computeCombinedMaterialThickness(quoteAttributes);
    quoteAttributes.cuttingDiameter = computeCuttingDiameter(quoteAttributes);

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
    quoteAttributes.totalBoxCost = computeTotalBoxCost(quoteAttributes);
    quoteAttributes.totalClicksCost = computeTotalClicksCost(quoteAttributes);
    quoteAttributes.totalMaterialsCost = computeTotalMaterialsCost(quoteAttributes);
    quoteAttributes.boxCreationTime = computeBoxCreationTime(quoteAttributes);
    quoteAttributes.packagingBoxTime = computePackagingBoxTime(quoteAttributes);
    quoteAttributes.totalShippingTime = computeTotalShippingTime(quoteAttributes);
    quoteAttributes.totalShippingCost = computeTotalShippingCost(quoteAttributes);

    return new QuoteModel(quoteAttributes);
};

function computeTotalShippingCost(quoteAttributes) {
    const { totalShippingTime } = quoteAttributes;

    const totalShippingCost = (totalShippingTime / MINUTES_PER_HOUR) * constants.SHIPPING_HOURLY_RATE;

    return totalShippingCost;
}

function computeTotalShippingTime(quoteAttributes) {
    const { boxCreationTime, packagingBoxTime, packingSlipsTime } = quoteAttributes;

    const sum = boxCreationTime + packagingBoxTime + packingSlipsTime;

    return sum;
}

function computePackagingBoxTime(quoteAttributes) {
    const { packagingDetails } = quoteAttributes;

    return packagingDetails.totalBoxes * constants.PACKAGING_PER_BOX_TIME;
}

function computeBoxCreationTime(quoteAttributes) {
    const { packagingDetails } = quoteAttributes;

    return packagingDetails.totalBoxes * constants.BOX_CREATION_TIME;
}

function computeTotalMaterialsCost(quoteAttributes) {
    const { totalStockCost, totalFinishCost, inlinePrimingCost, totalClicksCost, totalBoxCost } = quoteAttributes;

    const sum = totalStockCost + totalFinishCost + inlinePrimingCost + totalClicksCost + totalBoxCost;

    return sum;
}

function computeTotalBoxCost(quoteAttributes) {
    const { packagingDetails } = quoteAttributes;

    return packagingDetails.totalBoxes * constants.BOX_COST;
}

function computeTotalClicksCost(quoteAttributes) {
    const { 
        scalingClickCost, proofRunupClickCost, printCleanerClickCost,
        totalFrames, numberOfColors
    } = quoteAttributes;
    const { COST_PER_COLOR } = constants;

    const totalClicksCost = scalingClickCost + proofRunupClickCost + printCleanerClickCost + (COST_PER_COLOR * (totalFrames * numberOfColors * 2));

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

function computeDiameterUsingMaterialLength(materialLengthInFeet, materialThickness) {
    const materialLengthInInches = materialLengthInFeet * INCHES_PER_FOOT;
    const term1 = ((materialLengthInInches) * (materialThickness / ONE_THOUSAND)) / 3.142; // eslint-disable-line no-magic-numbers
    const term2 = Math.pow((ROLL_CORE_DIAMETER / 2), 2);

    return Math.sqrt(term1 + term2) * 2;
}

function computeCuttingDiameter(quoteAttributes) {
    const { totalStockFeet, combinedMaterialThickness : combinedMaterialThicknessInMillimeters } = quoteAttributes;

    return computeDiameterUsingMaterialLength(totalStockFeet, combinedMaterialThicknessInMillimeters);
}

function computeFinishedRollDiameter(quoteAttributes) {
    const { finishedRollLength, combinedMaterialThickness : combinedMaterialThicknessInMillimeters } = quoteAttributes;

    return computeDiameterUsingMaterialLength(finishedRollLength, combinedMaterialThicknessInMillimeters);
    // const term1 = ((finishedRollLength * INCHES_PER_FOOT) * (combinedMaterialThicknessInMillimeters / ONE_THOUSAND)) / 3.142; // eslint-disable-line no-magic-numbers
    // const term2 = Math.pow((ROLL_CORE_DIAMETER / 2), 2);

    // return Math.sqrt(term1 + term2) * 2;
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
    if (!product) return null;

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

    const primaryMaterialCost = totalStockMsi * primaryMaterial.quotePricePerMsi;
    const secondarMaterialCost = secondaryMaterial ? (totalStockMsi * secondaryMaterial.quotePricePerMsi) : 0;

    return primaryMaterialCost + secondarMaterialCost;
}

function computeTotalFrames(quoteAttributes) {
    const { totalStockFeet, frameLength, numberOfDesigns } = quoteAttributes;

    const totalFramesPerDesign = Math.ceil(new Decimal(totalStockFeet).dividedBy(frameLength).times(INCHES_PER_FOOT));

    return totalFramesPerDesign * numberOfDesigns;
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

    return totalStockFeet / printingSpeed;
}

function computePrintingSpeed(quoteAttributes) {
    const { numberOfColors, frameLength } = quoteAttributes;

    const printingSpeed = 60 / ((numberOfColors * 0.49) * (12 / (frameLength))); // eslint-disable-line no-magic-numbers

    return printingSpeed;
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

    return totalStockMsi * constants.INLINE_PRIMING_COST_PER_MSI;
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
    const { initialStockLength, dieCutterSetupFeet, printCleanerFeet, dieLineSetupFeet } = quoteAttributes;
    
    const sum = initialStockLength + dieCutterSetupFeet + printCleanerFeet + dieLineSetupFeet;

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

function computeFrameLength(quoteAttributes) {
    const { die } = quoteAttributes;
    const frameNumberAround = Math.floor(constants.MAX_FRAME_LENGTH_INCHES / (die.sizeAround + die.spaceAround));

    return (die.sizeAround + die.spaceAround) * frameNumberAround;
}

function computeInitialStockLength(quoteAttributes) {
    const { die, labelQty } = quoteAttributes;
    const { sizeAround, spaceAround, numberAcross } = die;
    
    const initialStockLength = (((sizeAround + spaceAround) * labelQty) / numberAcross) / INCHES_PER_FOOT;
    
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

function computeDieCutterSetupFeet(quoteAttributes) {
    const { frameLength, numberOfDesigns, extraFrames } = quoteAttributes;

    const dieCutterSetupFeetPerDesign = (extraFrames * frameLength) / INCHES_PER_FOOT;

    return dieCutterSetupFeetPerDesign * numberOfDesigns;
}

function computeColorCalibrationFeet(quoteAttributes) {
    const { numberOfDesigns } = quoteAttributes;

    return numberOfDesigns * constants.COLOR_CALIBRATION_FEET;
}

function computeExtraFrames(quoteAttributes) {
    const { numberOfDesigns } = quoteAttributes;
    const { EXTRA_FRAMES_FOR_THE_FIRST_DESIGN, EXTRA_FRAMES_PER_ADDITIONAL_DESIGN } = constants;

    return EXTRA_FRAMES_FOR_THE_FIRST_DESIGN + ((numberOfDesigns - 1) * EXTRA_FRAMES_PER_ADDITIONAL_DESIGN);
}