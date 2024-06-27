import React from 'react';
import './MaterialTable.scss';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Material } from '../../_types/databaseModels/material';
import { MaterialRowActions } from './MaterialRowActions/MaterialRowActions';
import flashMessageStore from '../../stores/flashMessageStore';
import SearchBar from '../../_global/SearchBar/SearchBar';
import { Table } from '../../_global/Table/Table';
import { TableHead } from '../../_global/Table/TableHead/TableHead';
import { TableBody } from '../../_global/Table/TableBody/TableBody';
import ExpandableRow from '../../_global/Table/ExpandableRow/ExpandableRow';
import { useQuery } from '@tanstack/react-query';
import { getMaterials } from '../../_queries/material';
import { AxiosError } from 'axios';

const columnHelper = createColumnHelper<Material>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name'
  }),
  columnHelper.accessor('materialId', {
    header: 'Material ID'
  }),
  columnHelper.accessor('productNumber', {
    header: 'Product Number'
  }),
  columnHelper.accessor('linerType', {
    header: 'Liner Type'
  }),
  columnHelper.accessor('whenToUse', {
    header: 'When-to-Use'
  }),
  columnHelper.accessor('description', {
    header: 'Description'
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: props => <MaterialRowActions row={props.row} />
  })
];

export const MaterialTable = () => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([])
  const { isError, data: materials, error } = useQuery({
    queryKey: ['materials'],
    queryFn: getMaterials,
    initialData: []
  })

  if (isError) {
    if (error instanceof AxiosError) flashMessageStore.addErrorMessage(error.response?.data as string)
    else flashMessageStore.addErrorMessage(error.message)
  }

  const table = useReactTable({
    data: materials,
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
      <SearchBar value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} />

      <Table>
        <TableHead table={table} />
        
        <TableBody>
          {rows.map(row => (
            <ExpandableRow row={row} key={row.id}>
              <div>@Storm: Any HTML elements within ExpandableRow are auto-magically placed into a, wait for it - expandable row ;)</div>
            </ExpandableRow>
          ))}
        </TableBody>
      </Table>

      <br />
      <p>Row Count: {rows.length}</p>
    </>
  )
};