import React from 'react';
import './DropdownField.scss';

export default DropdownField = (props) => {
    const { options, header } = props;

  return (
    <div className='column'>
      <div className='text-field-header'>{header}:</div>
      <select>
      <option value="">--Please choose an option--</option>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
    </div>

  )
}