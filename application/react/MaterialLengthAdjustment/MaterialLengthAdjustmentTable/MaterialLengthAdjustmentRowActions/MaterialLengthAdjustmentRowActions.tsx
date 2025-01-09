import React from 'react'
import './MaterialLengthAdjustmentRowActions.scss'
import { Row } from '@tanstack/react-table';
import { MongooseId } from '../../../_types/typeAliases';
import { RowActions } from '../../../_global/Table/RowActions/RowActions';

type TODO = any;

type Props = {
  row: Row<TODO>
}

export const MaterialLengthAdjustmentRowActions = (props: Props) => {
  const { row }: { row: any } = props;
  const { _id : mongooseObjectId } = row.original;

  const onViewClicked = (mongooseObjectId: MongooseId) => {
    alert("TODO: Implement view logic")
  }

  const onDeleteClicked = (mongooseObjectId: MongooseId) => {
    alert('@TODO Storm: Add a confirmation modal before deletion?')
    alert("TODO: Implement deletion logic")
  }

  const onEditClicked = (mongooseObjectId: MongooseId) => {
    alert("TODO: Implement edit logic")
  }

  return (
    <RowActions>
      <div onClick={() => onViewClicked(mongooseObjectId)}>View</div>
      <div onClick={() => onEditClicked(mongooseObjectId)}>Edit</div>
      <div onClick={() => onDeleteClicked(mongooseObjectId)}>Delete</div>
    </RowActions>
  )
};