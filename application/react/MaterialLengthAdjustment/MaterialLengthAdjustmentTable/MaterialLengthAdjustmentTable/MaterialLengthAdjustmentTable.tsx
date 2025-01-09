import { useQuery } from '@tanstack/react-query';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import React from 'react';
import { useErrorMessage } from '../../../_hooks/useErrorMessage';
import { MaterialLengthAdjustmentRowActions } from '../MaterialLengthAdjustmentRowActions/MaterialLengthAdjustmentRowActions';
import { getMaterialLengthAdjustments } from '../../../_queries/materialLengthAdjustment' 
import SearchBar from '../../../_global/SearchBar/SearchBar';
import { Table } from '../../../_global/Table/Table';
import { TableHead } from '../../../_global/Table/TableHead/TableHead';
import { TableBody } from '../../../_global/Table/TableBody/TableBody';
import Row from '../../../_global/Table/Row/Row';

type TODO = any;

const columnHelper = createColumnHelper<TODO>()

const columns = [
  columnHelper.accessor('material', {
    header: 'Material ID',
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

  const { isError, data: materialLengthAdjustments, error } = useQuery({
    queryKey: ['get-delivery-methods'],
    queryFn: getMaterialLengthAdjustments,
    initialData: []
  })

  if (isError) {
    useErrorMessage(error)
  }

  const table = useReactTable({
    data: materialLengthAdjustments,
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
        </Table>
      </div>
    </div>
  )
}