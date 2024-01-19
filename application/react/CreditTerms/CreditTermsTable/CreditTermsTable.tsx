// <reference types="react-table" />
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CreditTermsTable.scss'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import ExpandableRow from '../../_global/Table/ExpandableRow/ExpandableRow'
import SearchBar from '../../_global/SearchBar/SearchBar'
import { TableHead } from '../../_global/Table/TableHead/TableHead'
import { TableBody } from '../../_global/Table/TableBody/TableBody'
import { Table } from '../../_global/Table/Table'
import { RowActions } from '../../_global/Table/RowActions/RowActions'

type CreditTerm = {
  _id: string,
  description: string,
  createdAt: string,
  updatedAt: string
}

const columnHelper = createColumnHelper<CreditTerm>()

const columns = [
  columnHelper.accessor('description', {
    header: 'Description'
  }),
  columnHelper.accessor('_id', {
    header: 'ID'
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: props => <RowActions row={props.row} />
  })
];


const CreditTermsTable = () => {
  const [creditTerms, setCreditTerms] = useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState([])

  useEffect(() => {
    axios.get('/credit-terms?responseDataType=JSON')
      .then((response) => {
         const { data } = response;
         setCreditTerms(data);
      })
      .catch((error) => {
        alert('Error loading Credit Terms: ' + JSON.stringify(error));
      })
  }, [])

  const table = useReactTable({
    data: creditTerms,
    columns,
    state: {
      globalFilter: globalFilter,
      sorting: sorting,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
  })

  const rows = table.getRowModel().rows;

  return (
    <>
      <SearchBar value={globalFilter} onChange={(e: any) => setGlobalFilter(e.target.value)} />

      <Table>
        <TableHead table={table} />
        
        <TableBody>
          {rows.map(row => (
            <ExpandableRow row={row} key={row.id}>
              <div>@Storm: Click on a row to see this expandable row content. Delete this div to make the row no-longer expandable</div>
            </ExpandableRow>
          ))}
        </TableBody>
      </Table>

      <br />
      <p>Row Count: {rows.length}</p>
    </>
  )
};

export default CreditTermsTable;