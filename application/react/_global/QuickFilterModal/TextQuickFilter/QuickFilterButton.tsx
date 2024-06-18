import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import './QuickFilterButton.scss';
import { activeFilter } from '../../../utils/front-end-animations'

export const TextQuickFilter = observer((
  props: {
    uuid: string,
    filterValue: string, 
    onEnabled: (uuid: string, filter: string) => void, 
    onDisabled: (uuid: string) => void 
  }) => {
  const { uuid, filterValue, onEnabled, onDisabled } = props;
  const [isEnabled, setIsEnabled] = useState(false);

  function onClick(e) {
    activeFilter(e);
    setIsEnabled(!isEnabled);

    const filterBecameEnabled = !isEnabled;
    
    if (filterBecameEnabled) onEnabled(uuid, filterValue)
    else onDisabled(uuid)
  }


  return (
    <div className='quick-filter-btn filter-btn' onClick={(e) => onClick(e)}>
      {filterValue}
    </div>
  )
});