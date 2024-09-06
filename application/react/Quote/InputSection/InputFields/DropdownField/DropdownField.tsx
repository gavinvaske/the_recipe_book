import React from 'react';
import './DropdownField.scss';

type Option = {
  value: string,
  label: string
}

type Props = {
  options: Option[],
  header: string
}

export const DropdownField = (props: Props) => {
    const { options, header } = props;

  return (
    <div className='column'>
      <div className='text-field-header'>{header}:</div>
      <select>
      <option value="">--Please choose an option--</option>
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    </div>

  )
}