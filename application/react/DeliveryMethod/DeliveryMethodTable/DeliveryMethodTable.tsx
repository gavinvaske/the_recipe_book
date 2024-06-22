import * as React from 'react'
import axios, { AxiosError } from 'axios'
import './DeliveryMethodTable.scss'
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
import { DeliveryMethodsRowActions } from './RowActions/RowActions'
import FlashMessageStore from '../../stores/flashMessageStore'
import flashMessageStore from '../../stores/flashMessageStore'

type DeliveryMethod = {
  _id: string,
  name: string,
  createdAt: string,
  updatedAt: string
}

const columnHelper = createColumnHelper<DeliveryMethod>()

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
    cell: props => <DeliveryMethodsRowActions row={props.row} />
  })
];

function DeliveryMethodTable() {
  const [deliveryMethods, setDeliveryMethods] = React.useState<DeliveryMethod[]>([])
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([])

  React.useEffect(() => {
    axios.get('/delivery-methods')
    .then((response) => {
        const { data } = response;
        setDeliveryMethods(data);
     })
     .catch((error: AxiosError) => flashMessageStore.addErrorMessage(error.response?.data as string || error.message))
  }, [])

  const table = useReactTable({
    data: deliveryMethods,
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
              <div>@Storm: Click on a row to see this expandable row content. Delete this div to make the row no-longer expandable</div>
            </ExpandableRow>
          ))}
        </TableBody>
      </Table>

      <br />
      <p>Row Count: {rows.length}</p>
    </>
  )
}

export default DeliveryMethodTable;