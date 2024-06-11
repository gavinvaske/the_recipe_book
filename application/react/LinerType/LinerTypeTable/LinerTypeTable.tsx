import React from 'react';
import './LinerTypeTable.scss';
import axios from 'axios';
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
import { LinerTypeRowActions } from './RowActions/RowActions'
import { LinerType } from '../../_types/databaseModels/linerType';
import FlashMessageStore from '../../stores/flashMessageStore'

const columnHelper = createColumnHelper<LinerType>()

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
    cell: props => <LinerTypeRowActions row={props.row} />
  })
];

export const LinerTypeTable = () => {
  const [linerTypes, setLinerTypes] = React.useState([])
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([])

  React.useEffect(() => {
    axios.get('/liner-types')
    .then((response) => {
        const { data } = response;
        setLinerTypes(data);
     })
    .catch(({response}) => {
      FlashMessageStore.addErrorMessage(response.data)
     })
  }, [])


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

      <Table>
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