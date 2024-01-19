import { Row, RowData } from '@tanstack/react-table';
import React from 'react'

export const RowActions = (props) => {
  const [isOpened, setIsOpened] = React.useState(false);
  const { row }: {row: Row<RowData>} = props;
  const { _id : mongooseObjectId } = row.original as any;

  console.log('Rendering the options for Object Id: ', mongooseObjectId);
  
  const toggleRowActions = () => setIsOpened(!isOpened)

  return (
    <>
    <div className="options-reveal-box" onClick={toggleRowActions}>
      <svg data-v-32017d0f="" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="align-middle text-body feather feather-more-vertical"><circle data-v-32017d0f="" cx="12" cy="12" r="1"></circle><circle data-v-32017d0f="" cx="12" cy="5" r="1"></circle><circle data-v-32017d0f="" cx="12" cy="19" r="1"></circle></svg>
      <div>
        These options should be hidden until clicked.
      </div>
    </div>
    </>

  )
}