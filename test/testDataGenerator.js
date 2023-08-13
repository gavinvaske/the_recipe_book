const chance = require('chance').Chance();
const mongoose = require('mongoose');

const { dieShapes } = require('../application/enums/dieShapesEnum');
const { toolTypes } = require('../application/enums/toolTypesEnum');
const { dieVendors } = require('../application/enums/dieVendorsEnum');
const { dieMagCylinders } = require('../application/enums/dieMagCylindersEnum');
const { dieStatuses } = require('../application/enums/dieStatusesEnum');
const { unwindDirections } = require('../application/enums/unwindDirectionsEnum');
const { finishTypes } = require('../application/enums/finishTypesEnum');

const { AVAILABLE_USER_TYPES } = require('../application/enums/userTypesEnum');

module.exports.mockData = {
    Die: getDie,
    Material: getMaterial,
    Finish: getFinish,
    Customer: getCustomer,
    Contact: getContact,
    User: getUser,
    SharedBaseProductAttributes: getSharedBaseProduct,
};

function getDie() {
    return {
        dieShape: chance.pickone(dieShapes),
        sizeAcross: chance.floating({ min: 0, max: 10, fixed: 2 }),
        sizeAround: chance.floating({ min: 0, max: 10, fixed: 2 }),
        dieNumber: 'DC-1234',
        dieNumberAcross: chance.d100(),
        dieNumberAround: chance.d100(),
        gear: chance.d100(),
        toolType: chance.pickone(toolTypes),
        notes: chance.string(),
        cost: chance.floating({ min: 0, fixed: 2 }),
        vendor: chance.pickone(dieVendors),
        magCylinder: chance.pickone(dieMagCylinders),
        cornerRadius: chance.floating({ min: 0, max: 10, fixed: 2 }),
        spaceAcross: chance.floating({ min: 0, max: 10, fixed: 2 }),
        spaceAround: chance.floating({ min: 0, max: 10, fixed: 2 }),
        facestock: chance.string(),
        liner: chance.string(),
        specialType: chance.string(),
        serialNumber: chance.string(),
        status: chance.pickone(dieStatuses),
        quantity: chance.d100()
    };
}

function getMaterial() {
    return {
        name: chance.string(),
        materialId: chance.string(),
        vendor: new mongoose.Types.ObjectId(),
        materialCategory: new mongoose.Types.ObjectId(),
        thickness: chance.integer({ min: 0 }),
        weight: chance.integer({ min: 0 }),
        materialCost: `${chance.floating({ min: 0 })}`,
        freightCost: `${chance.floating({ min: 0 })}`,
        width: chance.d12(),
        faceColor: chance.string(),
        adhesive: chance.string(),
        adhesiveCategory: new mongoose.Types.ObjectId(),
        quotePrice: chance.integer({ min: 0 }),
        description: chance.string(),
        whenToUse: chance.string(),
        alternativeStock: chance.string(),
        length: chance.integer({ min: 0 })
    };
}

function getFinish() {
    return {
        name: chance.string(),
        finishId: chance.string(),
        vendor: mongoose.Types.ObjectId(),
        category: mongoose.Types.ObjectId(),
        thickness: chance.integer({ min: 0 }),
        weight: chance.d100(),
        finishCost: chance.floating({ min: 0, fixed: 2 }),
        freightCost: chance.floating({ min: 0, fixed: 2 }),
        width: chance.d100(),
        quotePrice: chance.floating({ min: 0, fixed: 2 }),
        description: chance.string(),
        whenToUse: chance.string(),
        alternativeFinish: chance.string()
    };
}

function getContact() {
    return {
        fullName: chance.string(),
        contactStatus: chance.string()
    };
}

function getCustomer() {
    return {
        name: chance.string(),
        notes: chance.string(),
        overun: chance.d100(),
        customerId: chance.string(),
        contacts: chance.n(getContact, chance.d10()),
    };
}

function getUser() {
    const PASSWORD_MIN_LENGTH = 8;

    return {
        email: chance.email(),
        password: chance.string({ length: PASSWORD_MIN_LENGTH }),
        userType: chance.pickone(AVAILABLE_USER_TYPES)
    };
}

function getSharedBaseProduct() {
    return {
        productDescription: chance.string(),
        unwindDirection: chance.pickone(unwindDirections),
        artNotes: chance.string(),
        finishType: chance.pickone(finishTypes),
        labelsPerRoll: chance.d100(),
        numberOfColors: chance.d12()
    };
}