import React from 'react'
import './TableHead.scss'
import RowHeader from '../RowHeader/RowHeader';
import { RowData, Table } from '@tanstack/react-table';

export const TableHead = (props) => {
  const { table }: {table: Table<RowData>} = props;

  return (
    <div className='table-head'>
      <RowHeader columnHeaders={table.getFlatHeaders()} />
    </div>
  )
}
