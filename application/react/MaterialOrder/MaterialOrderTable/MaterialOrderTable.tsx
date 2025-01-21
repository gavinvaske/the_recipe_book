import React from 'react';
import './MaterialOrderTable.scss'
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { MaterialOrder } from '../../_types/databaseModels/materialOrder';
import { MaterialOrderRowActions } from './MaterialOrderRowActions/MaterialOrderRowActions';
import { useQuery } from '@tanstack/react-query';
import { getMaterialOrders } from '../../_queries/materialOrder';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import SearchBar from '../../_global/SearchBar/SearchBar';
import { Table } from '../../_global/Table/Table';
import { TableHead } from '../../_global/Table/TableHead/TableHead';
import { TableBody } from '../../_global/Table/TableBody/TableBody';
import Row from '../../_global/Table/Row/Row';
import { getDateFromIsoStr, getDateTimeFromIsoStr } from '@ui/utils/dateTime';

const columnHelper = createColumnHelper<MaterialOrder>()

const columns = [
  columnHelper.accessor('purchaseOrderNumber', {
    header: 'P.O Number',
  }),
  columnHelper.accessor(row => row.material?.materialId, {
    id: 'material.materialId', // Specify an ID since the accessor is a function
    header: 'Material ID',
  }),
  columnHelper.accessor(row => getDateFromIsoStr(row.orderDate), {
    header: 'Order Date'
  }),
  columnHelper.accessor(row => getDateFromIsoStr(row.arrivalDate), {
    header: 'Arrival Date'
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
    cell: props => <MaterialOrderRowActions row={props.row} />
  })
];

export const MaterialOrderTable = () => {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { isError, data: materialOrders, error } = useQuery({
    queryKey: ['get-material-orders'],
    queryFn: getMaterialOrders,
    initialData: []
  })

  if (isError) {
    useErrorMessage(error)
  }

  const table = useReactTable({
    data: materialOrders,
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
    <div className='page-wrapper credit-term-table'>
      <div className='card table-card'>
        <div className="header-description">
          <h1 className="text-blue">Material Orders</h1>
          <p>Complete list of all <p className='text-blue'>{rows.length} </p> material orders.</p>
        </div>
         <SearchBar value={globalFilter} onChange={(e: any) => setGlobalFilter(e.target.value)} />

        <Table id='material-order-table'>
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