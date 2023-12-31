import * as React from 'react'
import axios from 'axios'
import './DeliveryMethodTable.scss'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table'
import ExpandableRow from '../../_global/Table/ExpandableRow/ExpandableRow'
import RowHeader from '../../_global/Table/RowHeader/RowHeader'
import SearchBar from '../../_global/SearchBar/SearchBar'
import ExpandedRowContent from './ExpandedRowContent/ExpandedRowContent'

const columnHelper = createColumnHelper()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name'
  }),
];

function DeliveryMethodTable() {
  const [deliveryMethods, setDeliveryMethods] = React.useState([])
  const [globalFilter, setGlobalFilter] = React.useState("");

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
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(globalFilter),
    state: {
      globalFilter: globalFilter
    },
    onGlobalFilterChanged: setGlobalFilter
  })

  return (
    <div className="p-2">
      <SearchBar value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} />

      <div className='table'>
        <div className='table-header'>
          <RowHeader columnHeaders={table.getAllColumns()} />
        </div>
        <div className='table-body'>
          {table.getRowModel().rows.map(row => (
            <ExpandableRow row={row} key={row.id} ExpandedRowContent={ExpandedRowContent} />
          ))}
        </div>
      </div>
      <div />
      <br />
      <p>Row Count: {table.getRowModel().rows.length}</p>
    </div>
  )
}

export default DeliveryMethodTable;