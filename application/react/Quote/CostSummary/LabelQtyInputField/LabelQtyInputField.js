import React from 'react';
import './LabelQtyInputField.scss'

export default LabelQtyInputField = (props) => {
    const { onChange, value } = props;

    return (
        <input type='text' value={value} placeholder='# of labels' onChange={onChange}></input>
    );
}