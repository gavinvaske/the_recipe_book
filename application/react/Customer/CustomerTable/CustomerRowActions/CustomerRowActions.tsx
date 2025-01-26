import React from 'react'
import './CustomerRowActions.scss'
import { RowActions } from '../../../_global/Table/RowActions/RowActions';
import { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom'
import { MongooseId } from '../../../_types/typeAliases';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useErrorMessage } from '../../../_hooks/useErrorMessage';
import { Customer } from '../../../_types/databasemodels/customer.ts';
import { useQueryClient } from '@tanstack/react-query';
import { useSuccessMessage } from '../../../_hooks/useSuccessMessage';

type Props = {
  row: Row<Customer>
}

export const CustomerRowActions = (props: Props) => {
  const { row } = props;
  const { _id : mongooseObjectId } = row.original;

  const navigate = useNavigate();
  const queryClient = useQueryClient()

  const onDeleteClicked = (mongooseObjectId: MongooseId) => {
    axios.delete(`/customers/${mongooseObjectId}`)
      .then((_ : AxiosResponse) => {
        queryClient.invalidateQueries({ queryKey: ['get-vendors']})
        useSuccessMessage('Deletion was successful')
      })
      .catch((error: AxiosError) => useErrorMessage(error))
  }

  const onEditClicked = (mongooseObjectId: MongooseId) => {
    navigate(`/react-ui/forms/customer/${mongooseObjectId}`)
  }

  return (
    <RowActions>
      <div className='dropdown-option' onClick={() => onEditClicked(mongooseObjectId)}><i className="fa-regular fa-pen-to-square"></i>Edit</div>
      <div className='dropdown-option' onClick={() => onDeleteClicked(mongooseObjectId)}><i className="fa-regular fa-trash"></i>Delete</div>
    </RowActions>
  )
}