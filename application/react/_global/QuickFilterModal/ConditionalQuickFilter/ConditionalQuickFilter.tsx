import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import './ConditionalQuickFilter.scss'
import { ConditionalFilterFunction } from '../../../_types/Filters';
import { activeFilter } from '../../../utils/front-end-animations'

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

  function onClick(e) {
    activeFilter(e);
    setIsEnabled(!isEnabled);

    const filterBecameEnabled = !isEnabled;
    
    if (filterBecameEnabled) onEnabled(uuid, conditionalFilterFunction)
    else onDisabled(uuid)
  }

 

  return (<div className='conditional-quick-filter-btn filter-btn' onClick={(e) => onClick(e)}>{textToDisplay}</div>)
});