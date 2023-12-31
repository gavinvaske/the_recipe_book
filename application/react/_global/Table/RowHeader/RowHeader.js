import React from 'react'
import { flexRender } from '@tanstack/react-table'
import './RowHeader.scss'

const RowHeader = (props) => {
  const { columnHeaders } = props;

  return (
    <div className='row'>
      {
        columnHeaders.map(header => (
          <div className='column' key={header.id} onClick={header.column.getToggleSortingHandler()}>
            <div className='column-icon'>
              {
                header.column.getCanSort() && <i class="fa-regular fa-arrow-down-arrow-up"></i>
              }
            </div>
            <div className='column-name'>
              {
                header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
              }
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default RowHeader