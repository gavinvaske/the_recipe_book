import React from 'react'
import './FilterBar.scss'
import SearchBar from '../../_global/SearchBar/SearchBar'
import inventorySummaryStore from '../../stores/inventorySummaryStore';
import { observer } from 'mobx-react-lite';

const FilterBar = observer((props) => {
  return (
    <div className="workflow-filter flex-center-left-row full-width card">
      <a className="create bg-blue text-white border-blue btn-create new-po-btn" href="/material-orders/create">PO <i className="fa-regular fa-plus"></i></a>
      <a className="create bg-blue text-white border-blue btn-create new-po-btn" href="/materials/form" role="button">Material <i className="fa-regular fa-plus"></i></a>
      
      <div className="search-wrapper flex-center-left-row">
        <i className="fa-regular fa-magnifying-glass flex-center-center-row"></i>
        <SearchBar 
          value={inventorySummaryStore.getTextFilter()} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => inventorySummaryStore.setTextFilter(e.target.value)} 
        />
      </div>

      <div className="split-btn-frame btn-filter flex-center-center-row tooltip">
        <span className="tooltiptext">Filter by anything</span>
        <div className="filter-btn-wrapper flex-center-center-row">
          <button className="btn-split quick-filter flex-center-center-row">
            <i className="fa-light fa-filter"></i>Filter
          </button>
          <button className="btn-split-arrow-dropdown btn-advanced-filter"><i className="fa-regular fa-chevron-down"></i></button>
        </div>
        <div className="quick-filter-dropdown dropdown">
          <h5><b>Quick Filter</b></h5>
          <p>Testing how big the dropdown box can be</p>
          <a>This was where all materials were</a>
        </div>
        <div className="advanced-filter-dropdown dropdown">
          <h5><b>Advanced Filter</b></h5>
          <p>Testing how big the dropdown box can be</p>
        </div>
      </div>
      <div className="all-wrapper tooltip">
        <span className="tooltiptext">See All</span>
        <button className="sort btn-sort see-all"><i className="fa-solid fa-layer-group"></i> See All(<span id="material-count">Count</span>)</button>
      </div>
    </div>
  )
})

export default FilterBar