import React from 'react';
import './MaterialDetailsModal.scss'
import { MaterialInventory } from '../Inventory';
import { FullscreenModal } from '../../_global/FullscreenModal/FullscreenModal';

type Props = {
  materialInventory: MaterialInventory,
  onClose: () => void
}

export const MaterialDetailsModal = (props: Props) => {
  const { materialInventory, onClose } = props
  const { material } = materialInventory;

  return (
    <FullscreenModal onClose={() => onClose()}>
      <h1>Inventory Details for this Material</h1>
      
      <p>lengthOfMaterialInStock: {materialInventory.lengthOfMaterialInStock}</p>
      <p>lengthOfMaterialOrdered: {materialInventory.lengthOfMaterialOrdered}</p>
      <p>netLengthOfMaterialInStock: {materialInventory.netLengthOfMaterialInStock}</p>
      <p># of Purchase orders: {materialInventory.purchaseOrdersForMaterial.length}</p>

      <h1>Material Details</h1>

      <p>Name: {material.name}</p>
      <p>materialId: {material.materialId}</p>
      <p>vendor: {typeof material.vendor === 'object' && material?.vendor?.name}</p>
      <p>materialCategory: {typeof material.materialCategory === 'object' && material?.materialCategory?.name}</p>
      <p>thickness: {material.thickness}</p>
      <p>weight: {material.weight}</p>
      <p>costPerMsi: {material.costPerMsi}</p>
      <p>freightCostPerMsi: {material.freightCostPerMsi}</p>
      <p>width: {material.width}</p>
      <p>faceColor: {material.faceColor}</p>
      <p>adhesive: {material.adhesive}</p>
      <p>adhesiveCategory: {typeof material.adhesiveCategory === 'object' && material?.adhesiveCategory?.name}</p>
      <p>quotePricePerMsi: {material.quotePricePerMsi}</p>
      <p>description: {material.description}</p>
      <p>whenToUse: {material.whenToUse}</p>
      <p>alternativeStock: {material.alternativeStock}</p>
      <p>length: {material.length}</p>
      <p>facesheetWeightPerMsi: {material.facesheetWeightPerMsi}</p>
      <p>adhesiveWeightPerMsi: {material.adhesiveWeightPerMsi}</p>
      <p>linerWeightPerMsi: {material.linerWeightPerMsi}</p>
    </FullscreenModal>
  )
}