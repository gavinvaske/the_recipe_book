import * as purchaseOrderService from './purchaseOrderService.ts';
import { MaterialLengthAdjustmentModel } from '../models/materialLengthAdjustment.ts';
import { MongooseId } from '@shared/types/typeAliases.ts';
import { IMaterial, IMaterialOrder } from '@shared/types/models.ts';

/* 
  @See: 
    https://mongoplayground.net/
  
  @Returns: 
    A map where the key is the material _id which maps to the net length of that material found in the MaterialLengthAdjustment db table
  
  @Notes:
    type materialIdsWithTotalLengthAdjustments = {
      _id: mongooseId,
      totalLength: number
    }
*/
export async function groupLengthAdjustmentsByMaterial(): Promise<Record<string, number>> {
    const materialIdsWithTotalLengthAdjustments = await MaterialLengthAdjustmentModel.aggregate([
        {
            $group: {
                _id: '$material',
                totalLength: {
                    $sum: {
                        '$toDouble': '$length'
                    }
                }
            }
        }
    ]);

    const materialIdToTotalLengthAdjustment = {};

    materialIdsWithTotalLengthAdjustments.forEach(({_id, totalLength}) => {
        materialIdToTotalLengthAdjustment[_id] = totalLength; 
    });

    return materialIdToTotalLengthAdjustment;
}

export function mapMaterialIdToPurchaseOrders(materialIds: MongooseId[], purchaseOrders: IMaterialOrder[]): Record<string, IMaterialOrder[]> {
    const materialIdToPurchaseOrders = {};

    materialIds.forEach((materialId) => {
        materialIdToPurchaseOrders[materialId as string] = [];
    });

    purchaseOrders.forEach((purchaseOrder) => {
        const materialId = purchaseOrder.material;
        
        materialIdToPurchaseOrders[materialId as string].push(purchaseOrder);
    });

    return materialIdToPurchaseOrders;
}

export function getInventoryForMaterial(purchaseOrdersForMaterial: IMaterialOrder[], materialLengthAdjustment: number): IMaterial['inventory'] {
  const arrivedOrders = purchaseOrderService.findPurchaseOrdersThatHaveArrived(purchaseOrdersForMaterial);
  const notArrivedOrders = purchaseOrderService.findPurchaseOrdersThatHaveNotArrived(purchaseOrdersForMaterial);
  const lengthArrived = purchaseOrderService.computeLengthOfMaterialOrders(arrivedOrders);
  const lengthNotArrived = purchaseOrderService.computeLengthOfMaterialOrders(notArrivedOrders);
  const materialOrderIds = purchaseOrdersForMaterial.map((purchaseOrder) => purchaseOrder._id);

  return {
    lengthNotArrived: lengthNotArrived,
    lengthArrived: lengthArrived,
    materialOrders: materialOrderIds,
    manualLengthAdjustment: materialLengthAdjustment,
  }
}

export function buildMaterialInventory(material, allPurchaseOrdersForMaterial, materialLengthAdjustments) {
    const purchaseOrdersThatHaveArrived = purchaseOrderService.findPurchaseOrdersThatHaveArrived(allPurchaseOrdersForMaterial);
    const purchaseOrdersThatHaveNotArrived = purchaseOrderService.findPurchaseOrdersThatHaveNotArrived(allPurchaseOrdersForMaterial);
    const lengthOfMaterialInStock = purchaseOrderService.computeLengthOfMaterialOrders(purchaseOrdersThatHaveArrived);

    return {
        material,
        lengthOfMaterialOrdered: purchaseOrderService.computeLengthOfMaterialOrders(purchaseOrdersThatHaveNotArrived),
        lengthOfMaterialInStock: lengthOfMaterialInStock,
        netLengthOfMaterialInStock: lengthOfMaterialInStock + materialLengthAdjustments,
        purchaseOrdersForMaterial: purchaseOrdersThatHaveNotArrived
    };
}

export function computeNetLengthOfMaterialInInventory(materialInventories) {
    const initialValue = 0;

    return materialInventories.reduce((accumulator, currentMaterialInventory) => {
        return accumulator + currentMaterialInventory.netLengthOfMaterialInStock;
    }, initialValue);
}