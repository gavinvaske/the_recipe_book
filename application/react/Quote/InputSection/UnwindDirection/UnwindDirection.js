import React from 'react';
import './UnwindDirection.scss';

const UnwindDirectionOption = (props) => {
  const { value } = props;

  return (
    <div>
      <div>{value}</div>
    </div>
  )
}

export default UnwindDirection = () => {
  return (
    <div className="unwind-direction-input-section">
      <div className='unwind-direction-container'>
        <div className='unwind-direction-label'>Unwind Direction</div>
        <div className='unwind-direction-options'>
          <UnwindDirectionOption value={1}/>
          <UnwindDirectionOption value={2}/>
          <UnwindDirectionOption value={3}/>
          <UnwindDirectionOption value={4}/>
          <UnwindDirectionOption value={5}/>
          <UnwindDirectionOption value={6}/>
          <UnwindDirectionOption value={7}/>
          <UnwindDirectionOption value={8}/>
        </div>
      </div>
    </div>
  )
}