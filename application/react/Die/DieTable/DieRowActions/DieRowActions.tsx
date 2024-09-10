import React from 'react';
import './DieRowActions.scss';
import { RowActions } from '../../../_global/Table/RowActions/RowActions';
import { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { IDie } from '../../../../api/models/die'

type Props = {
  row: Row<IDie>
}

export const DieRowActions = (props: Props) => {
  const { row } = props;
  const { _id : mongooseObjectId } = row.original;

  const navigate = useNavigate();
  const queryClient = useQueryClient()

  const onEditClicked = (mongooseObjectId) => {
    navigate(`/react-ui/forms/die/${mongooseObjectId}`)
  }
  
  const onDeleteClicked = (mongooseObjectId) => {
    alert('TODO: Implement delete functionality')
  }

  return (
    <RowActions>
    <div className='dropdown-option' onClick={() => onEditClicked(mongooseObjectId)}><i className="fa-regular fa-pen-to-square"></i>Edit</div>
    <div className='dropdown-option' onClick={() => onDeleteClicked(mongooseObjectId)}><i className="fa-regular fa-trash"></i>Delete</div>
  </RowActions>
  )
}