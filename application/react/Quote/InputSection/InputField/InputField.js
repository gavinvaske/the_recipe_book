import React from 'react';
import './InputField.scss';

export default InputField = (props) => {
  const { header } = props;

  return (
    <div className='quote-input-field'>
      <div className='input-field-header'>{header}:</div>
      <div className='input-field-data'>
        <input type='text' placeholder='foo' />
      </div>
    </div>
  )
}