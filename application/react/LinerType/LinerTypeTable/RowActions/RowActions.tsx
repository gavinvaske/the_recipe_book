import React from 'react';
import './RowActions.scss';
import { RowActions } from '../../../_global/Table/RowActions/RowActions';

type Props = {
  row: any
}

export const LinerTypeRowActions = (props: Props) => {
  const { row } = props
  const { _id : mongooseObjectId } = row.original as any;

  console.log('Showing the row options for Object Id: ', mongooseObjectId);

  return (
    <RowActions>
      <div>Edit (TODO)</div>
      <div>Delete (TODO)</div>
    </RowActions>
  )
}