import React from 'react';
import './LabelQtyInputField.scss'

export default LabelQtyInputField = (props) => {
    const { onChange } = props;

    return (
        <input type='text' placeholder='# of labels' onChange={onChange}></input>
    );
}