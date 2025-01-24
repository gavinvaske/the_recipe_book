import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { getDateTimeFromIsoStr } from '@ui/utils/dateTime';
import { CustomerRowActions } from '../../Customer/CustomerTable/CustomerRowActions/CustomerRowActions';
import { VendorRowActions } from './VendorRowActions/VendorRowActions';

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
    cell: props => <VendorRowActions row={props.row}/>
  })
];

export const VendorTable = () => {
  return (
    <div>TODO: VendorTable.tsx</div>
  )
}