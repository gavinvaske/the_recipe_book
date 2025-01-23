import React from 'react';
import './CreditTermTable.scss'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table'
import Row from '../../_global/Table/Row/Row'
import SearchBar from '../../_global/SearchBar/SearchBar'
import { TableHead } from '../../_global/Table/TableHead/TableHead'
import { TableBody } from '../../_global/Table/TableBody/TableBody'
import { Table } from '../../_global/Table/Table'
import { CreditTermRowActions } from './CreditTermRowActions/CreditTermRowActions';
import { useQuery } from '@tanstack/react-query';
import { getCreditTerms } from '../../_queries/creditTerm';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { getDateTimeFromIsoStr } from '@ui/utils/dateTime.ts';

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.accessor('description', {
    header: 'Description'
  }),
  columnHelper.accessor(row => getDateTimeFromIsoStr(row.updatedAt), {
    header: 'Updated'
  }),
  columnHelper.accessor(row => getDateTimeFromIsoStr(row.createdAt), {
    header: 'Created'
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: props => <CreditTermRowActions row={props.row} />
  })
];

export const CreditTermTable = () => {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { isError, data: creditTerms, error } = useQuery({
    queryKey: ['get-credit-terms'],
    queryFn: getCreditTerms,
    initialData: []
  })

  if (isError) {
    useErrorMessage(error)
  }

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
    <div className='page-wrapper credit-term-table'>
      <div className='card table-card'>
        <div className="header-description">
          <h1 className="text-blue">Credit Terms</h1>
          <p>Showing <p className='text-blue'>{rows.length} </p> credit terms.</p>
        </div>
         <SearchBar value={globalFilter} onChange={(e: any) => setGlobalFilter(e.target.value)} />

        <Table id='credit-term-table'>
          <TableHead table={table} />
          
          <TableBody>
            {rows.map(row => (
              <Row row={row} key={row.id}></Row>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    </>
  )
};
