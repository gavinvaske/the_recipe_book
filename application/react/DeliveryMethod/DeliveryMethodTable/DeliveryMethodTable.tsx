import * as React from 'react'
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
import { DeliveryMethodRowActions } from './DeliveryMethodRowActions/DeliveryMethodRowActions'
import { getDeliveryMethods } from '../../_queries/deliveryMethod'
import { useQuery } from '@tanstack/react-query'
import { useErrorMessage } from '../../_hooks/useErrorMessage'
import { getDateTimeFromIsoStr } from '@ui/utils/dateTime.ts'

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
    cell: props => <DeliveryMethodRowActions row={props.row} />
  })
];

function DeliveryMethodTable() {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { isError, data: deliveryMethods, error } = useQuery({
    queryKey: ['get-delivery-methods'],
    queryFn: getDeliveryMethods,
    initialData: []
  })

  if (isError) {
    useErrorMessage(error)
  }

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

      <Table id='delivery-method-table'>
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