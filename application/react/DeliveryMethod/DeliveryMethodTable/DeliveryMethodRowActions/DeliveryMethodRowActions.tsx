import React from 'react'
import './DeliveryMethodRowActions.scss'
import { RowActions } from '../../../_global/Table/RowActions/RowActions';
import { MongooseId } from '../../../_types/typeAliases';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError, AxiosResponse } from 'axios';
import flashMessageStore from '../../../stores/flashMessageStore';

export const DeliveryMethodRowActions = (props) => {
  const { row }: { row: any } = props;
  const { _id : mongooseObjectId } = row.original as any;

  const navigate = useNavigate();

  const onDeleteClicked = (mongooseObjectId: MongooseId) => {
    alert('@TODO Storm: Add a confirmation modal before deletion?')
    axios.delete(`/delivery-methods/${mongooseObjectId}`)
      .then((_ : AxiosResponse) => flashMessageStore.addSuccessMessage('Deletion was successfully'))
      .catch((error: AxiosError) => flashMessageStore.addErrorMessage(error.response?.data as string || error.message))
  }

  const onEditClicked = (mongooseObjectId: MongooseId) => {
    alert('TODO @Gavin: Enable editing via DeliveryMethodForm')
    navigate(`/react-ui/forms/delivery-method/${mongooseObjectId}`)
  }
  return (
    <RowActions>
      <div onClick={() => onDeleteClicked(mongooseObjectId)}>Edit</div>
      <div onClick={() => onEditClicked(mongooseObjectId)}>Delete</div>
    </RowActions>
  )
}