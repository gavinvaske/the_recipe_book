import React from 'react'
import './TableHead.scss'
import RowHeader from '../RowHeader/RowHeader';
import { RowData, Table } from '@tanstack/react-table';

export const TableHead = (props) => {
  const { table }: {table: Table<RowData>} = props;

  return (
      <RowHeader columnHeaders={table.getFlatHeaders()} />
  )
}
