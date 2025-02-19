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
import { useQuery } from '@tanstack/react-query';
import { getMaterials } from '../_queries/material.ts';
import { MongooseIdStr } from '@shared/types/typeAliases.ts';
import { LoadingIndicator } from '../_global/LoadingIndicator/LoadingIndicator.tsx';

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

  const materials = inventorySummaryStore.getMaterials()

  const { isPending } = useQuery({
    queryKey: ['get-materials'],
    queryFn: async () => {
      const materials = await getMaterials();
      inventorySummaryStore.setMaterials(materials)
    },
  })

  useEffect(() => {
    socket.on('MATERIAL:CREATED', (material: IMaterial) => {
      inventorySummaryStore.setMaterial(material)
    })

    socket.on('MATERIAL:UPDATED', (material: IMaterial) => {
      inventorySummaryStore.setMaterial(material)
    })
  
    socket.on('MATERIAL:DELETED', (materialMongooseId: MongooseIdStr) => {
      inventorySummaryStore.removeMaterial(materialMongooseId)
    })

    return () => {
      socket.off('MATERIAL:CREATED')
      socket.off('MATERIAL:UPDATED')
      socket.off('MATERIAL:DELETED')
    }
  }, [])

  function calculateInventory() {
    axios.get('/inventories/all')
      .then(() => useSuccessMessage('Inventory successfully calculated!'))
      .catch((error) => useErrorMessage(new Error(`Error calculating inventory: ${error.message}`)))
  }

  if (isPending) return (<LoadingIndicator />);

  return (
    <div id='inventory-page' className='page-wrapper' data-test='inventory-page'>
      <button onClick={calculateInventory}>Calculate Inventory</button>
      
      {
        inventorySummary &&
        <Summary inventorySummaryStore={inventorySummaryStore} />
      }

      <InventoryFilterBar />
      
      {
        inventorySummary &&
        <Materials
          materials={materials}
        />
      }
    </div>
  )
});

export default Inventory;