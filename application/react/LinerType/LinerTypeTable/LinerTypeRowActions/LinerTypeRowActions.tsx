import React from 'react';
import './LinerTypeRowActions.scss';
import { RowActions } from '../../../_global/Table/RowActions/RowActions';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { MongooseId } from '../../../_types/typeAliases';
import { useNavigate } from "react-router-dom";
import { useErrorMessage } from '../../../_hooks/useErrorMessage';
import { Row } from '@tanstack/react-table';
import { LinerType } from '../../../_types/databasemodels/linerType.ts';
import { useQueryClient } from '@tanstack/react-query';
import { useSuccessMessage } from '../../../_hooks/useSuccessMessage';

type Props = {
  row: Row<LinerType>
}

export const LinerTypeRowActions = (props: Props) => {
  const { row } = props
  const { _id : mongooseObjectId } = row.original;

  const navigate = useNavigate();
  const queryClient = useQueryClient()
  
  const onDeleteClicked = (mongooseObjectId: MongooseId) => {
    alert('TODO: Add a confirmation modal before deletion?')
    axios.delete(`/liner-types/${mongooseObjectId}`)
      .then((_ : AxiosResponse) => {
        queryClient.invalidateQueries({ queryKey: ['get-liner-types']})
        useSuccessMessage('Deletion was successful')
      })
      .catch((error: AxiosError) => useErrorMessage(error))
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