import React from 'react';
import './CheckboxField.scss';

export default CheckboxField = (props) => {
  const { accessor, header, onChange } = props;

  return (
    <div className='quote-checkbox-field card'>
      <div className='checkbox-field-header'>{header}:</div>
      <div className='checkbox-field-data'>
        <input name={accessor} type={'checkbox'} value={true} onChange={onChange} />
      </div>
    </div>
  )
}