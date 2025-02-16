import React, { useEffect, useState } from 'react';
import './Inventory.scss'
import { observer } from 'mobx-react-lite';
import Summary from './Summary/Summary';
import Materials from './Materials/Materials';
import inventorySummaryStore from '../stores/inventorySummaryStore';
import { io } from 'socket.io-client';
import InventoryFilterBar from './InventoryFilterBar/InventoryFilterBar';
import { MaterialDetailsModal } from './MaterialDetailsModal/MaterialDetailsModal';
import { IMaterial } from '@shared/types/models.ts';
import { IMaterialOrder } from '@shared/types/models.ts';
import axios from 'axios';
import { useSuccessMessage } from '../_hooks/useSuccessMessage.ts';
import { useErrorMessage } from '../_hooks/useErrorMessage.ts';

const socket = io();

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
  const inventorySummary: Partial<MaterialInventorySummary> = inventorySummaryStore.getInventorySummary()
  const [clickedMaterial, setClickedMaterial] = useState<MaterialInventory | null>(null);
  
  useEffect(() => {
    inventorySummaryStore.recalculateInventorySummary() /* Populates the mobx store with Inventory data which is then auto-rendered on screen */
  }, []);

  socket.on('MATERIAL:CHANGED', (_: IMaterial) => {
    inventorySummaryStore.recalculateInventorySummary() /* Populates the mobx store with Inventory data which is then auto-rendered on screen */
  })

  socket.on('MATERIAL_ORDER:CHANGED', (_: IMaterialOrder) => {
    inventorySummaryStore.recalculateInventorySummary() /* Populates the mobx store with Inventory data which is then auto-rendered on screen */
  })

  function displayMaterialInventoryDetailsModal(materialInventory: MaterialInventory) {
    setClickedMaterial(materialInventory)
  }

  function closeMaterialInventoryDetailsModal() {
    setClickedMaterial(null)
  }

  function calculateInventory() {
    axios.get('/inventories/all')
      .then(() => useSuccessMessage('Inventory successfully calculated!'))
      .catch((error) => useErrorMessage(new Error(`Error calculating inventory: ${error.message}`)))
  }

  return (
    <div id='inventory-page' className='page-wrapper' data-test='inventory-page'>
      <button onClick={calculateInventory}>Calculate Inventory</button>
      {
        clickedMaterial && 
        (<MaterialDetailsModal materialInventory={clickedMaterial} onClose={() => closeMaterialInventoryDetailsModal()} />)
      }
      
      {
        inventorySummary &&
        <Summary inventorySummaryStore={inventorySummaryStore} />
      }

      <InventoryFilterBar />
      
      {
        inventorySummary &&
          <Materials
            inventorySummaryStore={inventorySummaryStore}
            onMaterialClicked={(materialInventory: MaterialInventory) => displayMaterialInventoryDetailsModal(materialInventory)}
          />
      }
    </div>
  )
});

export default Inventory;