import React from 'react';
import './TableRow.scss'

const DEFAULT_VALUE = '-';

const TableRow = (props) => {
    const { header, data, formatter } = props;

    const getValue = (value) => {
        if (value === null || value === undefined) {
            return DEFAULT_VALUE;
        }

        return formatter ? formatter(value) : value
    }

    return (
      <div className='row'>
        <div className='header'>{header}</div>
        {data && data.map((value) => <div className='cell'>{getValue(value)}</div>)}
      </div>
    )
}

export default TableRow;