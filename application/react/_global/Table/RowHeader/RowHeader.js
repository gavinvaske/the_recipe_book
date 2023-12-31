import React from 'react'
import { flexRender } from '@tanstack/react-table'
import './RowHeader.scss'

const RowHeader = (props) => {
  const { columnHeaders } = props;

  const getSortIcon = (sortDirection) => {
    console.log('sortDirection: ', sortDirection)
    if (sortDirection === 'asc') {
      return <i class="fa-regular fa-arrow-down"></i>
    } else if (sortDirection === 'desc') {
      return <i class="fa-regular fa-arrow-up"></i>
    } else {
      return <i class="fa-regular fa-arrow-up-arrow-down"></i>
    }
  }

  return (
    <div className='row'>
      {
        columnHeaders.map(header => (
          <div className='column' key={header.id} onClick={header.column.getToggleSortingHandler()}>
            <div className='column-icon'>
              {
                header.column.getCanSort() && getSortIcon(header.column.getIsSorted())
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