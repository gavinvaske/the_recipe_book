import React from 'react';
import './ProductTable.scss';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { IBaseProduct } from '../../../api/models/baseProduct';
import { ProductRowActions } from './ProductRowActions/ProductRowActions';
import { getProducts } from '../../_queries/product';
import { useQuery } from '@tanstack/react-query';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import SearchBar from '../../_global/SearchBar/SearchBar';
import { Table } from '../../_global/Table/Table';
import { TableHead } from '../../_global/Table/TableHead/TableHead';
import { TableBody } from '../../_global/Table/TableBody/TableBody';
import Row from '../../_global/Table/Row/Row';

const columnHelper = createColumnHelper<IBaseProduct>()

export const GET_PRODUCTS_QUERY_KEY = 'get-products'

const columns = [
  columnHelper.accessor('productNumber', {
    header: 'Product Number',
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
    cell: props => <ProductRowActions row={props.row} />
  })
];

export const ProductTable = () => {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { isError, data: products, error } = useQuery({
    queryKey: [GET_PRODUCTS_QUERY_KEY],
    queryFn: getProducts,
    initialData: []
  })

  if (isError) {
    useErrorMessage(error)
  }

  const table = useReactTable({
    data: products,
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
    <div className='page-wrapper products-table'>
      <div className='card table-card'>
        <div className="header-description">
          <h1 className="text-blue">Products</h1>
          <p>Complete list of all <p className='text-blue'>{rows.length} </p> products.</p>
        </div>
         <SearchBar value={globalFilter} onChange={(e: any) => setGlobalFilter(e.target.value)} />

        <Table id='product-table'>
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
};