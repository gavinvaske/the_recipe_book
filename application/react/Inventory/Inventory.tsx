import React, { useEffect, useState } from 'react';
import './Inventory.scss'
import { observer } from 'mobx-react-lite';
import Summary from './Summary/Summary';
import Materials from './Materials/Materials';
import FilterInventory from './FilterInventory/FilterInventory';
import { MaterialOrder } from '../_types/databaseModels/MaterialOrder';
import axios from 'axios';
import { Material } from '../_types/databaseModels/material';

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
  netLengthOfMaterialInInventory: number,
  totalPurchaseOrders: number
}

const Inventory = observer(() => {
  const [inventorySummary, setInventorySummary] = useState<MaterialInventorySummary>();

  useEffect(() => {
    axios.get('/material-inventory')
      .then(({data}) => {
        console.log(data)
        setInventorySummary(data)
      })
      .catch((error) => alert('Error fetching the inventory for materials: ' + error.message));
  }, []);

  return (
    <div id='inventory-page'>
      {inventorySummary && <Summary inventorySummary={inventorySummary}/>}  {/* TODO: Add Loading Icon to Section */}
      <FilterInventory />
      {inventorySummary && <Materials inventorySummary={inventorySummary}/>} {/* /* TODO: Add Loading Icon to Section */}
    </div>
  )
});

export default Inventory;