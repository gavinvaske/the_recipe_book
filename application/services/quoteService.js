const constants = require('../enums/constantsEnum');

// updateQuote(...)
// createQuote(...)
// (?) computeQuote(...)
module.exports.createQuote = (quoteInputs) => {
    const { isSheeted } = quoteInputs;

    const quote = {
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
        packingSlipsTime: constants.PACKING_SLIP_TIME
    }

    return quote;
};