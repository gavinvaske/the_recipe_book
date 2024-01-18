import * as React from 'react'
import axios from 'axios'
import './DeliveryMethodTable.scss'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import ExpandableRow from '../../_global/Table/ExpandableRow/ExpandableRow'
import RowHeader from '../../_global/Table/RowHeader/RowHeader'
import SearchBar from '../../_global/SearchBar/SearchBar'
import { TableHead } from '../../_global/Table/TableHead/TableHead'
import { TableBody } from '../../_global/Table/TableBody/TableBody'
import { Table } from '../../_global/Table/Table'
import { RowActions } from '../../_global/Table/RowActions/RowActions'

const columnHelper = createColumnHelper()

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
    cell: props => <RowActions row={props.row} />
  })
];

function DeliveryMethodTable() {
  const [deliveryMethods, setDeliveryMethods] = React.useState([])
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState([])

  React.useEffect(() => {
    axios.get('/delivery-methods?responseDataType=JSON')
    .then((response) => {
        const { data } = response;
        setDeliveryMethods(data);
     })
    .catch((error) => {
       alert('Error loading Delivery Methods: ' +  JSON.stringify(error));
     })
  }, [])

  const table = useReactTable({
    data: deliveryMethods,
    columns,
    state: {
      globalFilter: globalFilter,
      sorting: sorting,
    },
    getFilteredRowModel: getFilteredRowModel(globalFilter),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChanged: setGlobalFilter,
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
              <div>@Storm: Click on a row to see this expandable row content</div>
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