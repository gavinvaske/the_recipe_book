import React from 'react'
import './QuoteRowActions'
import { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { MongooseId } from '../../../_types/typeAliases';
import { RowActions } from '../../../_global/Table/RowActions/RowActions';

type TODO = any;

type Props = {
  row: Row<TODO>
}

export const QuoteRowActions = (props: Props) => {
  const { row }: { row: any } = props;
  const { _id : mongooseObjectId } = row.original;

  // const navigate = useNavigate();
  // const queryClient = useQueryClient()

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
