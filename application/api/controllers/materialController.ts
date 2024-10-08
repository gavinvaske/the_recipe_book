import { Router } from 'express';
const router = Router();
import { MaterialModel } from '../models/material.ts';
import { verifyBearerToken } from '../middleware/authorize.ts';
import { VendorModel } from '../models/vendor.ts';
import { MaterialCategoryModel } from '../models/materialCategory.ts';

import * as materialInventoryService from '../services/materialInventoryService.ts';
import * as materialService from '../services/materialService.ts';
import * as purchaseOrderService from '../services/purchaseOrderService.ts';
import * as ticketService from '../services/ticketService.ts';
import * as mongooseService from '../services/mongooseService.ts';

const SHOW_ALL_MATERIALS_ENDPOINT = '/materials';
import { SERVER_ERROR, SUCCESS } from '../enums/httpStatusCodes.ts';

router.use(verifyBearerToken);

router.delete('/:mongooseId', async (request, response) => {
    try { 
        const deletedMaterial = await MaterialModel.findByIdAndDelete(request.params.mongooseId).exec();

        return response.status(SUCCESS).json(deletedMaterial);
    } catch (error) {
        console.error('Failed to delete material: ', error);

        return response.status(SERVER_ERROR).send(error.message);
    }
});

router.get('/', async (request, response) => {
    try {
        const materials = await MaterialModel.find().exec();

        return response.json(materials);
    } catch (error) {
        console.error('Error fetching materials: ', error);

        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

router.patch('/:mongooseId', async (request, response) => {
    try {
        const updatedMaterial = await MaterialModel.findOneAndUpdate(
            { _id: request.params.mongooseId }, 
            { $set: request.body }, 
            { runValidators: true, new: true }
        ).exec();

        return response.json(updatedMaterial);
    } catch (error) {
        console.error('Failed to update material: ', error);

        response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

router.get('/form', async (request, response) => {
    const vendors = await VendorModel.find().exec();
    const materialCategories = await MaterialCategoryModel.find().exec();

    return response.render('createMaterial', { vendors, materialCategories });
});

router.post('/', async (request, response) => {
    try {
        const material = await MaterialModel.create(request.body);

        return response.json(material);
    } catch (error) {
        console.log('Error creating material: ', error);
        return response.status(SERVER_ERROR).send(error.message);
    }
});

router.get('/update/:id', async (request, response) => {
    try {
        const material = await MaterialModel.findById(request.params.id);
        const vendors = await VendorModel.find().exec();
        const materialCategories = await MaterialCategoryModel.find().exec();

        return response.render('updateMaterial', {
            material,
            vendors,
            materialCategories
        });
    } catch (error) {
        console.log(error);
        request.flash('errors', [error.message]);

        return response.redirect('back');
    }
});

router.post('/update/:id', async (request, response) => {
    try {
        await MaterialModel.findByIdAndUpdate(request.params.id, request.body, { runValidators: true }).exec();

        request.flash('alerts', 'Updated successfully');
        response.redirect(SHOW_ALL_MATERIALS_ENDPOINT);
    } catch (error) {
        console.log(error);
        request.flash('errors', error.message);

        return response.redirect('back');
    }
});

/* @Deprecated */
router.get('/delete/:id', async (request, response) => {
    try {
        await MaterialModel.findByIdAndDelete(request.params.id).exec();

        request.flash('alerts', 'Deletion was successful');
    } catch (error) {
        console.log(error);
        request.flash('errors', error.message);
    }

    return response.redirect('back');
});

router.get('/inventory', async (request, response) => {
    try {
        const allMaterials = await MaterialModel
            .find()
            .populate({path: 'materialCategory'})
            .populate({path: 'vendor'})
            .populate({path: 'adhesiveCategory'})
            .exec();

        const distinctMaterialObjectIds = mongooseService.getObjectIds(allMaterials);
        const distinctMaterialIds = materialService.getMaterialIds(allMaterials);

        const materialIdToNetLengthAdjustment = await materialInventoryService.groupLengthAdjustmentsByMaterial();

        const allPurchaseOrders = await purchaseOrderService.getPurchaseOrdersForMaterials(distinctMaterialObjectIds);
        const materialIdToPurchaseOrders = materialInventoryService.mapMaterialIdToPurchaseOrders(distinctMaterialObjectIds, allPurchaseOrders);

        const purchaseOrdersThatHaveArrived = purchaseOrderService.findPurchaseOrdersThatHaveArrived(allPurchaseOrders);
        const purchaseOrdersThatHaveNotArrived = purchaseOrderService.findPurchaseOrdersThatHaveNotArrived(allPurchaseOrders);

        const lengthOfAllMaterialsInInventory = purchaseOrderService.computeLengthOfMaterial(purchaseOrdersThatHaveArrived);
        const lengthOfAllMaterialsOrdered = purchaseOrderService.computeLengthOfMaterial(purchaseOrdersThatHaveNotArrived);

        const materialObjectIdToLengthUsedByTickets = await ticketService.getLengthOfEachMaterialUsedByTickets(distinctMaterialIds);

        const materialInventories = allMaterials.map((material) => {
            const feetOfMaterialAlreadyUsedByTickets = materialObjectIdToLengthUsedByTickets[material.materialId] || 0;
            const purchaseOrdersForMaterial = materialIdToPurchaseOrders[material._id];
            const materialNetLengthAdjustment = materialIdToNetLengthAdjustment[material._id] || 0;

            return materialInventoryService.buildMaterialInventory(material, purchaseOrdersForMaterial, feetOfMaterialAlreadyUsedByTickets, materialNetLengthAdjustment);
        });

        const netLengthOfMaterialInInventory = materialInventoryService.computeNetLengthOfMaterialInInventory(materialInventories);

        return response.send({
            materialInventories,
            lengthOfAllMaterialsInInventory,
            lengthOfAllMaterialsOrdered,
            netLengthOfMaterialInInventory
        });

    } catch (error) {
        console.log(`Error fetching inventory data: ${error}`);

        return response.status(SERVER_ERROR).send(error.message);
    }
});

router.get('/:mongooseId', async (request, response) => {
    try {
        const material = await MaterialModel.findById(request.params.mongooseId);

        return response.json(material);
    } catch (error) {
        console.error('Error searching for material: ', error);

        return response
            .status(SERVER_ERROR)
            .send(error.message);
    }
});

export default router;