import React from 'react'
import { flexRender } from '@tanstack/react-table'
import './RowHeader.scss'

const RowHeader = (props) => {
  const { columnHeaders } = props;

  return (
    <div className='row'>
      {
        columnHeaders.map(header => (
          <div className='row-header' key={header.id}>
            {
              header.isPlaceholder
                ? null
                : flexRender(header.columnDef.header)
            }
          </div>
        ))
      }
    </div>
  )
}

export default RowHeader