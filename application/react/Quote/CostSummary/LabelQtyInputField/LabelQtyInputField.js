import React from 'react';
import './LabelQtyInputField.scss'

export default LabelQtyInputField = (props) => {
  const { labelQuantities, index } = props;

  const onChange = (e) => {
    labelQuantities[index] = Number(e.target.value)
  };

  return (
    <input type='text' placeholder='# of labels' onChange={onChange}></input>
  );
}