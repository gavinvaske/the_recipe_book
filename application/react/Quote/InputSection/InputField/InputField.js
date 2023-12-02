import React from 'react';
import './InputField.scss';

export default InputField = (props) => {
  const { accessor, header, onChange } = props;

  return (
    <div className='quote-input-field'>
      <div className='input-field-header'>{header}:</div>
      <div className='input-field-data'>
        <input name={accessor} type='text' placeholder='foo' onChange={onChange} />
      </div>
    </div>
  )
}