import React from 'react';
import './Summary.scss'
import { observer } from 'mobx-react-lite';
import { MaterialInventorySummary } from '../Inventory';

const Summary = observer((props: {inventorySummaryStore: any}) => {
  const { inventorySummaryStore } = props;
  const inventorySummary: Partial<MaterialInventorySummary> = inventorySummaryStore.getInventorySummary();

  return (
    <div className='material-summary-container'>
      <div className='card col col-one'>
        <h1>Inventory</h1>
      </div>
      <div className='card col col-two'>
        <span>Feet On Hand</span>
        <h2 className='total-length-of-material-in-inventory'>{inventorySummary.lengthOfAllMaterialsInInventory}</h2>
      </div>
      <div className='card col col-three'>
        <span>Net Feet</span>
        <h2 className='net-length-of-material-in-inventory'>{inventorySummary.netLengthOfMaterialInInventory}</h2>
      </div>
      <div className='card col col-four'>
        <span>Feet On Order</span>
        <h2 className='total-length-of-material-ordered'>{inventorySummary.lengthOfAllMaterialsOrdered}</h2>
      </div>
    </div>
  )
});

export default Summary;