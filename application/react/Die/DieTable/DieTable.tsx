import React from 'react';
import './DieTable.scss';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { DieRowActions } from './DieRowActions/DieRowActions';
import { useQuery } from '@tanstack/react-query';
import { getDies } from '../../_queries/die';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import SearchBar from '../../_global/SearchBar/SearchBar';
import { Table } from '../../_global/Table/Table';
import { TableHead } from '../../_global/Table/TableHead/TableHead';
import { TableBody } from '../../_global/Table/TableBody/TableBody';
import Row from '../../_global/Table/Row/Row';
import { getDateTimeFromIsoStr } from '@ui/utils/dateTime';

const columnHelper = createColumnHelper<any>()

export const GET_DIES_QUERY_KEY = 'get-dies'

const columns = [
  columnHelper.accessor('dieNumber', {
    header: 'Die Number',
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
    cell: props => <DieRowActions row={props.row} />
  })
];

export const DieTable = () => {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { isError, data: dies, error } = useQuery({
    queryKey: [GET_DIES_QUERY_KEY],
    queryFn: getDies,
    initialData: []
  })

  if (isError) {
    useErrorMessage(error)
  }

  const table = useReactTable({
    data: dies,
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
    <div className='page-wrapper'>
      <div className='card table-card'>
        <div className="header-description">
          <h1 className="text-blue">Dies</h1>
          <p>Complete list of all <p className='text-blue'>{rows.length} </p> dies.</p>
        </div>
        <div className='table-search-bar-container'>
          <SearchBar value={globalFilter} onChange={(e: any) => setGlobalFilter(e.target.value)} />
        </div>

        <Table id='die-table'>
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
};