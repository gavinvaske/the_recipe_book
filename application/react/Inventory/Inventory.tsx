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
      <Materials />
      <FilterInventory />
    </div>
  )
});

export default Inventory;