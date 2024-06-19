import React, { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import './CreditTermsTable.scss'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table'
import ExpandableRow from '../../_global/Table/ExpandableRow/ExpandableRow'
import SearchBar from '../../_global/SearchBar/SearchBar'
import { TableHead } from '../../_global/Table/TableHead/TableHead'
import { TableBody } from '../../_global/Table/TableBody/TableBody'
import { Table } from '../../_global/Table/Table'
import { CreditTermsRowActions } from './RowActions/RowActions';
import flashMessageStore from '../../stores/flashMessageStore';

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
    cell: props => <CreditTermsRowActions row={props.row} />
  })
];

const CreditTermsTable = () => {
  const [creditTerms, setCreditTerms] = useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([])

  useEffect(() => {
    axios.get('/credit-terms')
      .then((response : AxiosResponse) => setCreditTerms(response.data))
      .catch((error: AxiosError) => flashMessageStore.addErrorMessage(error.response?.data as string))
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