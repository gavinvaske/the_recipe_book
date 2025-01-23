import React from 'react';
import './LinerTypeTable.scss';
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
import { LinerTypeRowActions } from './LinerTypeRowActions/LinerTypeRowActions'
import { useQuery } from '@tanstack/react-query';
import { getLinerTypes } from '../../_queries/linerType';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import { getDateTimeFromIsoStr } from '@ui/utils/dateTime.ts';

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name'
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
    cell: props => <LinerTypeRowActions row={props.row} />
  })
];

export const LinerTypeTable = () => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { isError, data: linerTypes, error } = useQuery({
    queryKey: ['get-liner-types'],
    queryFn: getLinerTypes,
    initialData: []
  })

  if (isError) {
    useErrorMessage(error)
  }


  const table = useReactTable({
    data: linerTypes,
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

      <Table id='liner-type-table'>
        <TableHead table={table} />
        
        <TableBody>
          {rows.map(row => (
            <ExpandableRow row={row} key={row.id}>
              <div>@Storm: This div makes a row expandable. If you delete this div, the row will no-longer be "expandable"</div>
            </ExpandableRow>
          ))}
        </TableBody>
      </Table>

      <br />
      <p>Row Count: {rows.length}</p>
    </>
  )
}