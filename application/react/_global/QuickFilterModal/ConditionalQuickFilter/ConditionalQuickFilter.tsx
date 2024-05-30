import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import './ConditionalQuickFilter.scss'
import { ConditionalFilterFunction } from '../../../stores/inventorySummaryStore';

type Props<T> = {
  uuid: string,
  textToDisplay: string,
  conditionalFilterFunction: (objects: Partial<T>[]) => Partial<T>[], 
  onEnabled: (
    uuid: string, 
    conditionalFilterFunction: ConditionalFilterFunction<T>
  ) => void, 
  onDisabled: (uuid: string) => void 
}

export const ConditionalQuickFilter = observer(<T extends any>(props: Props<T>) => {
  const { uuid, conditionalFilterFunction, textToDisplay, onEnabled, onDisabled } = props;
  const [isEnabled, setIsEnabled] = useState(false);

  function onClick() {
    setIsEnabled(!isEnabled);

    const filterBecameEnabled = !isEnabled;
    
    if (filterBecameEnabled) onEnabled(uuid, conditionalFilterFunction)
    else onDisabled(uuid)
  }

  return (<div className='conditional-quick-filter-btn' onClick={() => onClick()}>{textToDisplay}</div>)
});