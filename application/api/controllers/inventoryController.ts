import { Router, Request, Response } from 'express';
import { verifyBearerToken } from '../middleware/authorize.ts';
import * as mongooseService from '../services/mongooseService.ts';
import * as materialInventoryService from '../services/materialInventoryService.ts';
import * as purchaseOrderService from '../services/purchaseOrderService.ts';
import { MaterialModel } from '../models/material.ts';
import { IMaterial } from '@shared/types/models.ts';
import { SERVER_ERROR, SUCCESS } from '../enums/httpStatusCodes.ts';
import { MongooseId } from '@shared/types/typeAliases.ts';

const router = Router();

router.use(verifyBearerToken);

router.get('/all', async (request: Request, response: Response) => {
    try {
        const allMaterials: IMaterial[] = await MaterialModel
            .find()
            .populate({path: 'materialCategory'})
            .populate({path: 'vendor'})
            .populate({path: 'adhesiveCategory'})
            .exec();

        const distinctMaterialObjectIds = mongooseService.getObjectIds<IMaterial>(allMaterials);
        const materialIdToNetLengthAdjustment = await materialInventoryService.groupLengthAdjustmentsByMaterial();
        const allPurchaseOrders = await purchaseOrderService.getPurchaseOrdersForMaterials(distinctMaterialObjectIds);
        const materialIdToPurchaseOrders = materialInventoryService.mapMaterialIdToPurchaseOrders(distinctMaterialObjectIds, allPurchaseOrders);

        const materialIdToInventory: Record<string, IMaterial['inventory']> = {};

        allMaterials.forEach((material) => {
          const materialOrders = materialIdToPurchaseOrders[material._id as string] || [];
          const materialNetLengthAdjustment = materialIdToNetLengthAdjustment[material._id as string] || 0;
          materialIdToInventory[material._id as string] = materialInventoryService.getInventoryForMaterial(materialOrders, materialNetLengthAdjustment)
        });

        const bulkOps = Object.keys(materialIdToInventory).map((materialId) => ({
          updateOne: {
            filter: {_id: materialId},
            update: {$set: { inventory: materialIdToInventory[materialId] }},
            upsert: false
          }
        }))

        await MaterialModel.bulkWrite(bulkOps)

        return response.sendStatus(SUCCESS)
    } catch (error) {
        console.log('Error refreshing material inventory.', error);

        return response.status(SERVER_ERROR).send(error.message);
    }
})

export default router;