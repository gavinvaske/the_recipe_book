import React from 'react';
import './AdhesiveCategoryRowActions.scss';
import { AdhesiveCategory } from '../../../_types/databaseModels/adhesiveCategory';
import { Row } from '@tanstack/react-table';

type Props = {
  row: Row<AdhesiveCategory>
}

export const AdhesiveCategoryRowActions = (props: Props) => {
  const { row } = props
  const { _id : mongooseObjectId } = row.original;

  return (
    <div>TODO: Build row actions </div>
  )
}