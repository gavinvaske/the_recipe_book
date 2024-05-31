import React from 'react'
import './InventoryFilterBar.scss'
import inventorySummaryStore from '../../stores/inventorySummaryStore';
import { observer } from 'mobx-react-lite';
import { conditionalQuickFilters, textQuickFilters } from './quickFilters';
import { FilterBar } from '../../_global/FilterBar/FilterBar';

const InventoryFilterBar = observer((_) => {

  return (
    <div id='inventory-filter-bar' className="workflow-filter flex-center-left-row full-width card">
      <a className="create bg-blue text-white border-blue btn-create new-po-btn" href="/material-orders/create">PO <i className="fa-regular fa-plus"></i></a>
      <a className="create bg-blue text-white border-blue btn-create new-po-btn" href="/materials/form" role="button">Material <i className="fa-regular fa-plus"></i></a>
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