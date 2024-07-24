import BaseProductModel from '../models/baseProduct.ts';

export async function getCombinedMaterialThicknessByBaseProductId(baseProductId) {
    const baseProduct = await BaseProductModel
        .findById(baseProductId)
        .populate({path: 'primaryMaterial'})
        .populate({path: 'secondaryMaterial'})
        .populate({path: 'finish'})
        .exec();

    const { primaryMaterial, secondaryMaterial, finish } = baseProduct;
    const primaryMaterialThickness = (primaryMaterial && primaryMaterial.thickness) ? primaryMaterial.thickness : 0;
    const secondaryMaterialThickness = (secondaryMaterial && secondaryMaterial.thickness) ? secondaryMaterial.thickness : 0;
    const finishThickness = (finish && finish.thickness) ? finish.thickness : 0;
    const combinedThickness = primaryMaterialThickness + secondaryMaterialThickness + finishThickness;

    return combinedThickness;
}