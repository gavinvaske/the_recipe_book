import React, { useEffect } from 'react';
import './InputField.scss';

const ALLOWED_INPUT_FIELD_TYPES = ['text', 'checkbox'];

export default InputField = (props) => {
  const { accessor, header, onChange, inputFieldType } = props;

    useEffect(() => {
        if (inputFieldType && !ALLOWED_INPUT_FIELD_TYPES.includes(inputFieldType)) {
            throw new Error(`Invalid input field type: ${inputFieldType}`);
        }
    }, [])

  return (
    <div className='quote-input-field'>
      <div className='input-field-header'>{header}:</div>
      <div className='input-field-data'>
        <input name={accessor} type={inputFieldType ? inputFieldType : 'text'} placeholder='foo' onChange={onChange} />
      </div>
    </div>
  )
}