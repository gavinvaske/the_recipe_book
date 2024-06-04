import React, { useEffect, useState } from 'react';
import './Inventory.scss'
import { observer } from 'mobx-react-lite';
import Summary from './Summary/Summary';
import Materials from './Materials/Materials';
import { MaterialOrder } from '../_types/databaseModels/MaterialOrder';
import { Material } from '../_types/databaseModels/material';
import inventorySummaryStore from '../stores/inventorySummaryStore';
import { io } from 'socket.io-client';
import InventoryFilterBar from './InventoryFilterBar/InventoryFilterBar';
import { MaterialDetailsModal } from './MaterialDetailsModal/MaterialDetailsModal';

const socket = io();

export type MaterialInventory = {
  lengthOfMaterialInStock: number
  lengthOfMaterialOrdered: number
  material: Material,
  netLengthOfMaterialInStock: number,
  purchaseOrdersForMaterial: MaterialOrder[]
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

  socket.on('MATERIAL:CHANGED', (_: Material) => {
    inventorySummaryStore.recalculateInventorySummary() /* Populates the mobx store with Inventory data which is then auto-rendered on screen */
  })

  socket.on('MATERIAL_ORDER:CHANGED', (_: MaterialOrder) => {
    inventorySummaryStore.recalculateInventorySummary() /* Populates the mobx store with Inventory data which is then auto-rendered on screen */
  })

  function displayMaterialInventoryDetailsModal(materialInventory: MaterialInventory) {
    setClickedMaterial(materialInventory)
  }

  function closeMaterialInventoryDetailsModal() {
    setClickedMaterial(null)
  }

  return (
    <div id='inventory-page'>
      {
        clickedMaterial && 
        <MaterialDetailsModal materialInventory={clickedMaterial} onClose={() => closeMaterialInventoryDetailsModal()} />
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