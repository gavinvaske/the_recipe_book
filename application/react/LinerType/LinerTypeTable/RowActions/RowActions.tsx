import React from 'react';
import './RowActions.scss';
import { RowActions } from '../../../_global/Table/RowActions/RowActions';
import axios from 'axios';
import flashMessageStore from '../../../stores/flashMessageStore'
import { MongooseId } from '../../../_types/typeAliases';
import { useNavigate } from "react-router-dom";

type Props = {
  row: any,
  
}

export const LinerTypeRowActions = (props: Props) => {
  const { row } = props
  const { _id : mongooseObjectId } = row.original as any;
  const navigate = useNavigate();

  console.log('Showing the row options for Object Id: ', mongooseObjectId);
  
  const onDeleteClicked = (mongooseObjectId: MongooseId) => {
    alert('you clicked it (Delete)')
    axios.delete(`/liner-types/${mongooseObjectId}`)
      .then(() => flashMessageStore.addSuccessMessage('Deletion was successfully'))
      .catch(({ response }) => flashMessageStore.addErrorMessage(response.data))
  }

  const onEditClicked = (mongooseObjectId: MongooseId) => {
    alert('you clicked it (edit)')
    navigate('/react-ui/tables/liner-type')
  }

  return (
    <RowActions>
      <div onClick={() => onEditClicked(mongooseObjectId)}>Edit</div>
      <div onClick={() => onDeleteClicked(mongooseObjectId)}>Delete</div>
    </RowActions>
  )
}