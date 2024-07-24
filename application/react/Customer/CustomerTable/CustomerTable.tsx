import React from 'react';
import './CustomerTable.scss';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { Customer } from '../../_types/databasemodels/customer.ts';
import { CustomerRowActions } from './CustomerRowActions/CustomerRowActions'
import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '../../_queries/customer';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import SearchBar from '../../_global/SearchBar/SearchBar';
import { Table } from '../../_global/Table/Table';
import { TableHead } from '../../_global/Table/TableHead/TableHead';
import { TableBody } from '../../_global/Table/TableBody/TableBody';
import Row from '../../_global/Table/Row/Row';

const columnHelper = createColumnHelper<Customer>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name'
  }),
  columnHelper.accessor('_id', {
    header: 'ID'
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: props => <CustomerRowActions row={props.row}/>
  })
];

export const CustomerTable = () => {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { isError, data: creditTerms, error } = useQuery({
    queryKey: ['get-customers'],
    queryFn: getCustomers,
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
    <div className='page-wrapper credit-term-table'>
      <div className='card table-card'>
        <div className="header-description">
          <h1 className="text-blue">Customers</h1>
          <p>Complete list of all <p className='text-blue'>{rows.length} </p> customers.</p>
        </div>
         <SearchBar value={globalFilter} onChange={(e: any) => setGlobalFilter(e.target.value)} />

        <Table id='customer-table'>
          <TableHead table={table} />
          
          <TableBody>
            {rows.map(row => (
              <Row row={row} key={row.id}></Row>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
