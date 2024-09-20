import React from 'react';
import './UnwindDirection.scss';
import quoteStore from '../../../../stores/quoteStore'

const UnwindDirectionOption = (props) => {
  const { value, onChange } = props;

  return (
    <div className={`unwind-${value} unwind-option`} onClick={(e) => onChange(value)}>
      <span>{value}</span>
    </div>
  )
}

export default UnwindDirection = () => {
  const updateUnwindDirection = (unwindDirection) => {
    alert('TODO Storm: highlight this field, the selcted unwind direction is: ' + unwindDirection);
    quoteStore.quoteInputs.unwindDirection = unwindDirection;
  };

  return (
    <div className="unwind-direction-input-section card">
      <div className='unwind-direction-container'>
        <div className='unwind-direction-label'>Unwind Direction:</div>
        <div className='unwind-direction-options'>
          <UnwindDirectionOption value={1} onChange={updateUnwindDirection}/>
          <UnwindDirectionOption value={2} onChange={updateUnwindDirection}/>
          <UnwindDirectionOption value={3} onChange={updateUnwindDirection}/>
          <UnwindDirectionOption value={4} onChange={updateUnwindDirection}/>
          <UnwindDirectionOption value={5} onChange={updateUnwindDirection}/>
          <UnwindDirectionOption value={6} onChange={updateUnwindDirection}/>
          <UnwindDirectionOption value={7} onChange={updateUnwindDirection}/>
          <UnwindDirectionOption value={8} onChange={updateUnwindDirection}/>
        </div>
      </div>
    </div>
  )
}