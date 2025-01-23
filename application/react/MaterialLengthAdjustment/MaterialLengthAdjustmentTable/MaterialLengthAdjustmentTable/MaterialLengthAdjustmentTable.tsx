import { useQuery } from '@tanstack/react-query';
import { createColumnHelper, getCoreRowModel, getSortedRowModel, SortingState, useReactTable, PaginationState } from '@tanstack/react-table';
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
import { SearchResult } from '@shared/types/http';

type TODO = any;

const columnHelper = createColumnHelper<TODO>()

const columns = [
  columnHelper.accessor(row => row.material.name, {
    id: 'material.name',
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
  const [globalSearch, setGlobalSearch] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  })
  const defaultData = useMemo(() => [], [])

  const { isError, data: materialLengthAdjustments, error, isLoading } = useQuery({
    queryKey: ['get-material-length-adjustments', pagination, sorting, globalSearch],
    queryFn: async () => {
      const sortDirection = sorting.length ? (sorting[0]?.desc ? '-1' : '1') : undefined;
      const sortField = sorting.length ? sorting[0]?.id : undefined;
      const results: SearchResult<any> = await getMaterialLengthAdjustments({
        query: globalSearch,
        pageIndex: String(pagination.pageIndex),
        limit: String(pagination.pageSize),
        sortField: sortField,
        sortDirection: sortDirection
      }) || {}

      return results
    },
    meta: { keepPreviousData: true, initialData: { results: [], totalPages: 0 } }
    })

  if (isError) {
    useErrorMessage(error)
  }

  const table = useReactTable<any>({
    data: materialLengthAdjustments?.results ?? defaultData,
    columns,
    rowCount: materialLengthAdjustments?.totalResults ?? 0,
    manualSorting: true,
    manualPagination: true,
    state: {
      globalFilter: globalSearch,
      sorting: sorting,
      pagination: pagination

    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updaterOrValue) => {
      table.resetPageIndex(); // reset to first page when sorting
      setSorting((oldSorting) => 
        typeof updaterOrValue === 'function' 
          ? updaterOrValue(oldSorting) 
          : updaterOrValue
      );
    },
    onGlobalFilterChange: setGlobalSearch,
    getSortedRowModel: getSortedRowModel(),
  })

  const rows = table.getRowModel().rows;

  return (
    <div className='page-wrapper'>
      <div className='card table-card'>
        <div className="header-description">
          <h1 className="text-blue">Material Length Adjustments</h1>
          <p>Viewing <p className='text-blue'>{rows.length} </p> material length adjustments.</p>
        </div>
         <SearchBar value={globalSearch} performSearch={(value: string) => {
          setGlobalSearch(value)
          table.resetPageIndex();
        }} />

        <Table id='material-length-adjustment-table'>
          <TableHead table={table} />
          
          <TableBody>
            {rows.map(row => (
              <Row row={row} key={row.id}></Row>
            ))}
          </TableBody>

          <PageSelect
            table={table}
            isLoading={isLoading}
          />
        </Table>
      </div>
    </div>
  )
}