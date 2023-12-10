import React from 'react';
import './TableRow.scss'

const TableRow = (props) => {
    const { header, data } = props;
    return (
      <div className='row'>
        <div className='header'>{header}</div>
        {data && data.map((value) => <div className='cell'>{value}</div>)}
      </div>
    )
}

export default TableRow;