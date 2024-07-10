import React from 'react';
import './LinerTypeRowActions.scss';
import { RowActions } from '../../../_global/Table/RowActions/RowActions';
import axios, { AxiosError } from 'axios';
import flashMessageStore from '../../../stores/flashMessageStore'
import { MongooseId } from '../../../_types/typeAliases';
import { useNavigate } from "react-router-dom";
import { useErrorHandler } from '../../../_hooks/useErrorHandler';

type Props = {
  row: any
}

export const LinerTypeRowActions = (props: Props) => {
  const { row } = props
  const { _id : mongooseObjectId } = row.original as any;
  const navigate = useNavigate();
  
  const onDeleteClicked = (mongooseObjectId: MongooseId) => {
    alert('TODO: Add a confirmation modal before deletion?')
    axios.delete(`/liner-types/${mongooseObjectId}`)
      .then(() => flashMessageStore.addSuccessMessage('Deletion was successfully'))
      .catch((error: AxiosError) => useErrorHandler(error))
  }

  const onEditClicked = (mongooseObjectId: MongooseId) => {
    navigate(`/react-ui/forms/liner-type/${mongooseObjectId}`)
  }

  return (
    <RowActions>
      <div onClick={() => onEditClicked(mongooseObjectId)}>Edit</div>
      <div onClick={() => onDeleteClicked(mongooseObjectId)}>Delete</div>
    </RowActions>
  )
}