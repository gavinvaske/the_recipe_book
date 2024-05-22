import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Materials.scss'
import { observer } from 'mobx-react-lite';
import Material from './Material/Material';
import { MaterialOrder } from '../../_types/databaseModels/MaterialOrder';
import { MaterialInventorySummary, MaterialInventory } from '../Inventory';

const Materials = observer((props: {inventorySummary: MaterialInventorySummary}) => {
  const {inventorySummary} = props;
  const { materialInventories }: {materialInventories: MaterialInventory[]} = inventorySummary;

  return (
    <div className='material-card-section full-width'>
      {materialInventories && materialInventories.map(materialInventory => <Material materialInventory={materialInventory} key={materialInventory.material._id} />)}
    </div>
  )
});

export default Materials;