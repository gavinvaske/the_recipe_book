import React from 'react';
import './Inventory.scss'
import { observer } from 'mobx-react-lite';
import Summary from './Summary/Summary';
import MaterialCards from './Materials/MaterialCards.tsx';
import InventoryFilterBar from './InventoryFilterBar/InventoryFilterBar';
import { IMaterial } from '@shared/types/models.ts';
import { IMaterialOrder } from '@shared/types/models.ts';
import axios from 'axios';
import { useSuccessMessage } from '../_hooks/useSuccessMessage.ts';
import { useErrorMessage } from '../_hooks/useErrorMessage.ts';

export type MaterialInventory = {
  lengthOfMaterialInStock: number
  lengthOfMaterialOrdered: number
  material: IMaterial,
  netLengthOfMaterialInStock: number,
  purchaseOrdersForMaterial: IMaterialOrder[]
}

export type MaterialInventorySummary = {
  lengthOfAllMaterialsInInventory: number,
  lengthOfAllMaterialsOrdered: number,
  materialInventories: MaterialInventory[],
  netLengthOfMaterialInInventory: number
}

const Inventory = observer(() => {
  function calculateInventory() {
    axios.get('/materials/recalculate-inventory')
      .then(() => useSuccessMessage('Inventory successfully calculated!'))
      .catch((error) => useErrorMessage(new Error(`Error calculating inventory: ${error.message}`)))
  }

  return (
    <div id='inventory-page' className='page-wrapper' data-test='inventory-page'>
      <button onClick={calculateInventory}>Calculate Inventory</button>
      <Summary />
      <InventoryFilterBar />
      <MaterialCards />
    </div>
  )
});

export default Inventory;