import React from 'react';
import './TextField.scss';

export default TextField = (props) => {
  const { accessor, header, onChange, isReadOnly, value } = props;

  return (
    <div className='quote-text-field'>
      <div className='text-field-header'>{header}:</div>
      <div className='text-field-data'>
        <input name={accessor} type={'text'} placeholder='...' onChange={onChange} readOnly={isReadOnly} value={value} />
      </div>
    </div>
  )
}