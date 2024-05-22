import React from 'react';
import './Inventory.scss'
import { observer } from 'mobx-react-lite';
import Summary from './Summary/Summary';
import Materials from './Materials/Materials';
import FilterInventory from './FilterInventory/FilterInventory';

const Inventory = observer(() => {
  return (
    <div id='inventory-page'>
      <Summary />
      <FilterInventory />
      <Materials />
    </div>
  )
});

export default Inventory;