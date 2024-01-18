import React from 'react'
import './TableHead.scss'
import RowHeader from '../RowHeader/RowHeader';

export const TableHead = (props) => {
  const { table } = props;

  return (
    <div className='table-head'>
      <RowHeader columnHeaders={table.getFlatHeaders()} />
    </div>
  )
}
