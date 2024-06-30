import React from 'react'
import './CreditTermRowActions.scss'
import { RowActions } from '../../../_global/Table/RowActions/RowActions';
import { Row, RowData } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom'
import { MongooseId } from '../../../_types/typeAliases';
import axios, { AxiosError, AxiosResponse } from 'axios';
import flashMessageStore from '../../../stores/flashMessageStore';

export const CreditTermRowActions = (props) => {
  const { row }: { row: Row<RowData> } = props;
  const { _id : mongooseObjectId } = row.original as any;

  const navigate = useNavigate();

  const onDeleteClicked = (mongooseObjectId: MongooseId) => {
    alert('@TODO Storm: Add a confirmation modal before deletion?')
    axios.delete(`/credit-terms/${mongooseObjectId}`)
      .then((_ : AxiosResponse) => flashMessageStore.addSuccessMessage('Deletion was successfully'))
      .catch((error: AxiosError) => flashMessageStore.addErrorMessage(error.response?.data as string || error.message))
  }

  const onEditClicked = (mongooseObjectId: MongooseId) => {
    alert('TODO @Gavin: Enable editing via CreditTermForm')
    navigate(`/react-ui/forms/credit-term/${mongooseObjectId}`)
  }

  return (
    <RowActions>
      <div onClick={() => onDeleteClicked(mongooseObjectId)}>Edit</div>
      <div onClick={() => onEditClicked(mongooseObjectId)}>Delete</div>
    </RowActions>
  )
}