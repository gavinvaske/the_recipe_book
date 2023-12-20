import React from 'react';
import './LabelQtyInputField.scss'

export default LabelQtyInputField = (props) => {
  const { labelQuantities, index } = props;

  const onChange = (e) => {
    labelQuantities[index] = Number(e.target.value)
  };

  return (
    <div className='cell'>
      <input className='qty-input' type='text'  defaultValue='0' onChange={onChange}></input>
    </div>
  );
}