import React from 'react'
import './DeliveryMethodRowActions.scss'
import { RowActions } from '../../../_global/Table/RowActions/RowActions';
import { MongooseId } from '../../../_types/typeAliases';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useErrorMessage } from '../../../_hooks/useErrorMessage';
import { useSuccessMessage } from '../../../_hooks/useSuccessMessage';

export const DeliveryMethodRowActions = (props) => {
  const { row }: { row: any } = props;
  const { _id : mongooseObjectId } = row.original as any;

  const navigate = useNavigate();

  const onDeleteClicked = (mongooseObjectId: MongooseId) => {
    alert('@TODO Storm: Add a confirmation modal before deletion?')
    axios.delete(`/delivery-methods/${mongooseObjectId}`)
      .then((_ : AxiosResponse) => useSuccessMessage('Deletion was successfully'))
      .catch((error: AxiosError) => useErrorMessage(error))
  }

  const onEditClicked = (mongooseObjectId: MongooseId) => {
    navigate(`/react-ui/forms/delivery-method/${mongooseObjectId}`)
  }

  return (
    <RowActions>
      <div onClick={() => onEditClicked(mongooseObjectId)}>Edit</div>
      <div onClick={() => onDeleteClicked(mongooseObjectId)}>Delete</div>
    </RowActions>
  )
}