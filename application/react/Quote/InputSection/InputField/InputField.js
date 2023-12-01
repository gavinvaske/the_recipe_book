import React from 'react';
import './InputField.scss';

export default InputField = (props) => {
  const { header } = props;

  return (
    <div class='quote-input-field'>
      <div class='input-field-header'>{header}:</div>
      <div class='input-field-data'>
        <input type='text' placeholder='foo' />
      </div>
    </div>
  )
}