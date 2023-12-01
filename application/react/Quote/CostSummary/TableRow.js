import React from 'react';
import './TableRow.scss'

const TableRow = (props) => {
    const { header, data } = props;
    return (
      <div className='row'>
        <div>{header}</div>
        {data && data.map((value) => <div>{value}</div>)}
      </div>
    )
}

export default TableRow;