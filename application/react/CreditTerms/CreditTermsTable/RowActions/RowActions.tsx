import React from 'react'
import './RowActions.scss'
import { RowActions } from '../../../_global/Table/RowActions/RowActions';
import { Row, RowData } from '@tanstack/react-table';

export const CreditTermsRowActions = (props) => {
  const { row }: { row: Row<RowData> } = props;
  const { _id : mongooseObjectId } = row.original as any;

  console.log('Rendering the options for Object Id: ', mongooseObjectId);

  return (
    <RowActions>
      <div>Edit (TODO)</div>
      <div>Delete (TODO)</div>
    </RowActions>
  )
}