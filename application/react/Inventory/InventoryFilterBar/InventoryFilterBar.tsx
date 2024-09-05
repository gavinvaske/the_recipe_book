import React from 'react'
import './InventoryFilterBar.scss'
import inventorySummaryStore from '../../stores/inventorySummaryStore';
import { observer } from 'mobx-react-lite';
import { conditionalQuickFilters, textQuickFilters } from './quickFilters';
import { FilterBar } from '../../_global/FilterBar/FilterBar';
import { Link } from 'react-router-dom';

const InventoryFilterBar = observer((_) => {

  return (
    <div id='inventory-filter-bar' className="workflow-filter flex-center-left-row full-width card">
      <Link
        to='/react-ui/forms/material-order'
        className='create bg-blue text-white border-blue btn-create'
      >PO <i className="fa-regular fa-plus"></i></Link>
      <Link
        to='/react-ui/forms/material'
        className='create bg-blue text-white border-blue btn-create'
      >Material <i className="fa-regular fa-plus"></i></Link>
      <Link
        to='/react-ui/forms/material-length-adjustment'
        className='create bg-blue text-white border-blue btn-create'
      >Adjustment <i className="fa-regular fa-plus"></i></Link>

      <FilterBar
          conditionalQuickFilters={conditionalQuickFilters}
          textQuickFilters={textQuickFilters}
          store={inventorySummaryStore}
          filterableItemsCount={inventorySummaryStore.getAllMaterialInventories().length}
      />
    </div>
  )
})

export default InventoryFilterBar