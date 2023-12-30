import * as React from 'react'
import axios from 'axios'
import './DeliveryMethodTable.scss'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel
} from '@tanstack/react-table'

const columnHelper = createColumnHelper()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name'
  }),
]

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
      <input 
        type='text' 
        value={globalFilter} 
        onChange={e => setGlobalFilter(e.target.value)}
      ></input>

      <div className="h-4" />

      <div className='table'>
        <div className='table-header'>
          {table.getHeaderGroups().map(headerGroup => (
            <div className='row' key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <div className='row-header' key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className='table-body'>
          {table.getRowModel().rows.map(row => (
            <div className='row' key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="h-4" />
    </div>
  )
}

export default DeliveryMethodTable;