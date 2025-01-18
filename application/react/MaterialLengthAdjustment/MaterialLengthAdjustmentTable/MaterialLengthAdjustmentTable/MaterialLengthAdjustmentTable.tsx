import { useQuery } from '@tanstack/react-query';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable, PaginationState } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useErrorMessage } from '../../../_hooks/useErrorMessage';
import { MaterialLengthAdjustmentRowActions } from '../MaterialLengthAdjustmentRowActions/MaterialLengthAdjustmentRowActions';
import { getMaterialLengthAdjustments } from '../../../_queries/materialLengthAdjustment' 
import SearchBar from '../../../_global/SearchBar/SearchBar';
import { Table } from '../../../_global/Table/Table';
import { TableHead } from '../../../_global/Table/TableHead/TableHead';
import { TableBody } from '../../../_global/Table/TableBody/TableBody';
import Row from '../../../_global/Table/Row/Row';
import './MaterialLengthAdjustmentTable.scss'

import { PageSelect } from '../../../_global/Table/PageSelect/PageSelect';

import { SearchResult } from '@shared/http';


type TODO = any;

const columnHelper = createColumnHelper<TODO>()

const columns = [
  columnHelper.accessor(row => row.material.name, {
    id: 'materialName', // Specify an ID since the accessor is a function
    header: 'Material Name',
  }),
  columnHelper.accessor('length', {
    header: 'Length',
  }),
  columnHelper.accessor('notes', {
    header: 'Notes',
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Updated'
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created'
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: props => <MaterialLengthAdjustmentRowActions row={props.row} />
  })
];

export const MaterialLengthAdjustmentTable = () => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 2,
  })
  const defaultData = useMemo(() => [], [])
  console.log('globalFilter: ', globalFilter)

  const { isError, data: materialLengthAdjustments, error } = useQuery({
    queryKey: ['get-material-length-adjustments', pagination],
    queryFn: async () => {
      const results: SearchResult<any> = await getMaterialLengthAdjustments({ query: globalFilter, pagination: pagination, sorting: [] }) || {}
      return results
    },
    meta: { keepPreviousData: true, initialData: { rows: [], total: 0 } } // Initial data shape
  })

  if (isError) {
    useErrorMessage(error)
  }

  const table = useReactTable({
    data: materialLengthAdjustments?.results ?? defaultData,
    columns,
    pageCount: materialLengthAdjustments?.totalPages ?? 0,
    manualSorting: true, // Disable front-end sorting
    manualPagination: true, // Disable front-end pagination
    state: {
      globalFilter: globalFilter,
      sorting: sorting,
      pagination: pagination
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    debugTable: true,
  })

  const rows = table.getRowModel().rows;

  const onPageChange = (pageIndex: number) => {
    setPagination((prev: any) => ({...prev, pageIndex }))
  }

  const onPageSizeChange = (pageSize: number) => {
    setPagination((prev: any) => ({...prev, pageSize }))
  }

  return (
    <div className='page-wrapper'>
      <div className='card table-card'>
        <div className="header-description">
          <h1 className="text-blue">Material Length Adjustments</h1>
          <p>Complete list of all <p className='text-blue'>{rows.length} </p> material length adjustments.</p>
        </div>
         <SearchBar value={globalFilter} onChange={(e: any) => setGlobalFilter(e.target.value)} />

        <Table id='material-length-adjustment-table'>
          <TableHead table={table} />
          
          <TableBody>
            {rows.map(row => (
              <Row row={row} key={row.id}></Row>
            ))}
          </TableBody>
          <div>
            <p>CurrentPage: {table.getState().pagination.pageIndex}</p>
          </div>

          <PageSelect currentPage={table.getState().pagination.pageIndex} totalPages={table.getPageCount()} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} pageSize={table.getState().pagination.pageSize}/>
        </Table>
      </div>
    </div>
  )
}