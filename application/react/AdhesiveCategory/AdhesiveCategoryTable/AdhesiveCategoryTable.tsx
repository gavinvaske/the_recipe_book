import React from 'react';
import './AdhesiveCategoryTable.scss';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { AdhesiveCategoryRowActions } from './AdhesiveCategoryRowActions/AdhesiveCategoryRowActions';
import { getAdhesiveCategories } from '../../_queries/adhesiveCategory';
import { useQuery } from '@tanstack/react-query';
import { useErrorMessage } from '../../_hooks/useErrorMessage';
import SearchBar from '../../_global/SearchBar/SearchBar';
import { Table } from '../../_global/Table/Table';
import { TableHead } from '../../_global/Table/TableHead/TableHead';
import { TableBody } from '../../_global/Table/TableBody/TableBody';
import Row from '../../_global/Table/Row/Row';
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
    cell: props => <AdhesiveCategoryRowActions row={props.row} />
  })
];

export const AdhesiveCategoryTable = () => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { isError, data: adhesiveCategories, error } = useQuery({
    queryKey: ['get-adhesive-categories'],
    queryFn: getAdhesiveCategories,
    initialData: []
  })

  if (isError) {
    useErrorMessage(error)
  }

  const table = useReactTable({
    data: adhesiveCategories,
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
          <h1 className="text-blue">Adhesive Categories</h1>
          <p>Complete list of all <p className='text-blue'>{rows.length} </p> Adhesive Categories.</p>
        </div>
         <SearchBar value={globalFilter} onChange={(e: any) => setGlobalFilter(e.target.value)} />

        <Table id='adhesive-category-table'>
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